import React, { useState } from "react";
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
import { useMutation } from "react-query";
import { RESET_INVITE_LINK } from "../../../actions/projectTypes";
import LinearProgress from "@material-ui/core/LinearProgress";
import { copyTextToClipboard, shareData } from "../../../utils";
import { alpha } from "@material-ui/core/styles/colorManipulator";
import FeatureDetect from "../../common/FeatureDetect";

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

const inviteAction = async (reqData) => {
  const { id, action, token } = reqData;
  return await axios.put(
    `/api/projects/req/project/${id}/invites?action=${action}`,
    null,
    tokenConfig(token)
  );
};

function InvitationAction({ id, anchorEl, setAnchorEl }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const invitation = useSelector(
    (state) => state.projectsState.project.invitation
  );
  const { token } = useSelector((state) => state.auth);
  const [active, setActive] = useState(invitation.active);

  const { mutate: toggle, isLoading: isToggleLoading } = useMutation(
    inviteAction,
    {
      onSuccess: ({ data: { active } }) => {
        setActive(active);
      },
      onError: ({ response: { data, status } }) => {
        dispatch(createSnackAlert(data, status));
      },
    }
  );

  const handleToggle = () => {
    toggle({ id, action: "status", token });
  };

  const {
    mutate: resetLink,
    isLoading: isResetLoading,
    isSuccess: isResetSuccess,
  } = useMutation(inviteAction, {
    onSuccess: ({ data: { url } }) => {
      dispatch({
        type: RESET_INVITE_LINK,
        payload: url,
      });
      dispatch(createSnackAlert("invite link changed", 200));
    },
    onError: ({ response: { data, status } }) => {
      dispatch(createSnackAlert(data, status));
    },
  });

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
    <RePopper anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
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
            checked={active}
          />
        </Typography>
        <Typography className={classes.caution} variant={"caption"}>
          {active
            ? "Anyone with link can join project"
            : "Invite link has been deactivated"}
        </Typography>
      </div>
      {isLoading && <LinearProgress variant={"indeterminate"} />}
    </RePopper>
  );
}

InvitationAction.propTypes = {
  id: PropTypes.string.isRequired,
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.func.isRequired,
};

export default InvitationAction;
