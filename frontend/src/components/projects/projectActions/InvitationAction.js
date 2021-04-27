import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import createSnackAlert from "../../../actions/snackAlerts";
import RePopper from "../../reuse/RePopper";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { tokenConfig } from "../../common/axiosConfig";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LinearProgress from "@material-ui/core/LinearProgress";
import { copyTextToClipboard, shareData } from "../../../utils";
import { alpha } from "@material-ui/core/styles/colorManipulator";
import FeatureDetect from "../../common/FeatureDetect";
import { useImmer } from "use-immer";

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

  const handleReset = () => {
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
      <div className={classes.inviteCard}>
        <Typography variant={"h6"} component={"h5"}>
          Invite link
        </Typography>
        <Tooltip title={invitation.url} placement={"top"} arrow>
          <Typography
            noWrap
            variant={"caption"}
            color={"textPrimary"}
            component={"p"}>
            {invitation.url}
          </Typography>
        </Tooltip>
        <FeatureDetect feature={navigator.share}>
          <Button
            size={"small"}
            disabled={isLoading}
            onClick={() => {
              shareData(_shareData);
            }}>
            share
          </Button>
        </FeatureDetect>
        <Button size={"small"} disabled={isLoading} onClick={handleCopy}>
          copy
        </Button>
        <Button
          size={"small"}
          className={classes.dangerBtn}
          disabled={isLoading || isResetSuccess}
          onClick={handleReset}>
          reset
        </Button>

        <Typography variant={"subtitle2"}>
          <strong>Link Active </strong>
          <Switch
            edge="end"
            disabled={isLoading}
            onChange={handleToggle}
            checked={invitation.active}
          />
        </Typography>
        <Typography className={classes.caution} variant={"caption"}>
          {invitation.active
            ? "Anyone with link can join project"
            : "Invite link has been deactivated"}
        </Typography>
      </div>
      {isLoading && <LinearProgress variant={"indeterminate"} />}
    </>
  );
};

const getInvite = async (id, token) => {
  return await axios.get(
    `/api/projects/req/project/${id}/invites`,
    tokenConfig(token)
  );
};

const InvitationPopper = ({ id, anchorEl, setAnchorEl }) => {
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
      {isLoading && <h6>Loading...</h6>}
      {isError && <h6>Oops... error!</h6>}
      {isSuccess && <Invitation id={id} data={data.data} />}
    </RePopper>
  );
};

Invitation.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
};
InvitationPopper.propTypes = {
  id: PropTypes.string.isRequired,
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.func.isRequired,
};

export default InvitationPopper;
