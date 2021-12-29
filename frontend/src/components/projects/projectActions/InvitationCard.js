import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import createSnackAlert from "../../../actions/snackAlerts";
import RePopper from "../../reuse/RePopper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { tokenConfig } from "../../common/axiosConfig";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LinearProgress from "@material-ui/core/LinearProgress";
import { copyTextToClipboard, shareData } from "../../../utils";
import { alpha } from "@material-ui/core/styles/colorManipulator";
import FeatureDetect from "../../common/FeatureDetect";
import { useImmer } from "use-immer";
import BarLoader from "../../layout/BarLoader";
import LinkIcon from "@material-ui/icons/Link";
import FileCopyRounded from "@material-ui/icons/FileCopy";
import RotateLeft from "@material-ui/icons/RotateLeft";
import { AvatarIconButton } from "../../reuse/ReButtons";
import ShareRounded from "@material-ui/icons/Share";

const useStyles = makeStyles((theme) => ({
  inviteCard: {
    textAlign: "center",
  },
  caution: {
    color: theme.palette.grey[700],
    fontSize: "xx-small",
  },
  dangerBtn: {
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: alpha(
        theme.palette.error.main,
        theme.palette.action.hoverOpacity
      ),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
  },
}));

const updateInvitation = async (reqData) => {
  const { id, action, token } = reqData;
  return await axios.put(
    `/api/projects/req/project/${id}/invites?action=${action}`,
    null,
    tokenConfig(token)
  );
};

const Invitation = ({ id, data }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.auth);

  const [invitation, setInvitaion] = useImmer(data);

  const { mutate: toggle, isLoading: isToggleLoading } = useMutation(
    updateInvitation,
    {
      onSuccess: ({ data: { active } }) => {
        setInvitaion((draft) => {
          draft.active = active;
        });
        queryClient.invalidateQueries("project-invite-config");
      },
      onError: ({ response: { data, status } }) => {
        dispatch(createSnackAlert(data, status));
      },
    }
  );

  const {
    mutate: resetLink,
    isLoading: isResetLoading,
    isSuccess: isResetSuccess,
  } = useMutation(updateInvitation, {
    onSuccess: ({ data: { url } }) => {
      setInvitaion((draft) => {
        draft.url = url;
      });
      queryClient.invalidateQueries("project-invite-config");
      dispatch(createSnackAlert("invite link changed", 200));
    },
    onError: ({ response: { data, status } }) => {
      dispatch(createSnackAlert(data, status));
    },
  });

  const handleToggle = () => {
    toggle({ id, action: "status", token });
  };

  const handleNewLink = () => {
    resetLink({ id, action: "key", token });
  };

  const handleCopy = () => {
    copyTextToClipboard(invitation.url, null);
  };

  const isLoading = Boolean(isToggleLoading || isResetLoading);

  const _shareData = {
    title: "Hyprkit Project Invite",
    text: "Hey, join my cool project at hyprkit",
    url: invitation.url,
  };

  return (
    <>
      {isLoading && <LinearProgress variant={"indeterminate"} />}
      <div className={classes.inviteCard}>
        <Typography variant={"h6"} component={"h5"}>
          Invite link
        </Typography>
        {!invitation.url ? (
          <Button
            onClick={handleNewLink}
            startIcon={<LinkIcon />}
            sx={{ my: 2 }}
            size={"small"}
            variant="contained"
            color="primary">
            Get Invite url
          </Button>
        ) : (
          <>
            <Tooltip title={invitation.url} placement={"top"} arrow>
              <TextField
                fullWidth
                size={"small"}
                variant={"outlined"}
                defaultValue={invitation.url}
              />
            </Tooltip>
            <FeatureDetect feature={navigator.share}>
              <AvatarIconButton
                icon={<ShareRounded fontSize={"small"} />}
                onClick={() => {
                  shareData(_shareData);
                }}
                color={"secondary"}
                disabled={isLoading}
                size={"small"}
                text={"copy"}
              />
            </FeatureDetect>
            <AvatarIconButton
              icon={<FileCopyRounded fontSize={"small"} />}
              onClick={handleCopy}
              color={"secondary"}
              disabled={isLoading}
              size={"small"}
              text={"copy"}
            />
            <AvatarIconButton
              icon={<RotateLeft fontSize={"small"} />}
              size={"small"}
              color={"error"}
              disabled={isLoading || isResetSuccess}
              onClick={handleNewLink}
              text={"new link"}
            />

            <Typography variant={"subtitle2"}>
              <Typography variant={"overline"} component={"strong"}>
                Link Active{" "}
              </Typography>
              <Switch
                edge="end"
                disabled={isLoading}
                onChange={handleToggle}
                checked={invitation.active}
              />
            </Typography>
            <>
              {invitation.passcode && (
                <Typography variant={"subtitle2"}>
                  <Typography variant={"overline"} component={"strong"}>
                    Passcode:{" "}
                  </Typography>
                  {invitation.passcode}
                </Typography>
              )}
            </>
            <Typography className={classes.caution} variant={"caption"}>
              {invitation.active
                ? "Anyone with link can join project"
                : "Invite link has been deactivated"}
            </Typography>
          </>
        )}
      </div>
    </>
  );
};

const getInvite = async (id, token) => {
  return await axios.get(
    `/api/projects/req/project/${id}/invites`,
    tokenConfig(token)
  );
};

const InvitationCard = ({ id, anchorEl, setAnchorEl }) => {
  const { token } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, data, isError, error } = useQuery(
    ["project-invite-config", id, token],
    () => getInvite(id, token),
    {
      enabled: Boolean(anchorEl),
      refetchOnWindowFocus: false,
      staleTime: 200000,
    }
  );

  return (
    <RePopper anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
      {isLoading && <BarLoader />}
      {isError && (
        <Typography variant={"h6"}>Failed to load invite!</Typography>
      )}
      {isSuccess && <Invitation id={id} data={data.data} />}
    </RePopper>
  );
};

Invitation.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
};
InvitationCard.propTypes = {
  id: PropTypes.string.isRequired,
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.func.isRequired,
};

export default InvitationCard;
