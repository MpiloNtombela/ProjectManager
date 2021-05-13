import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Group from "@material-ui/icons/Group";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { tokenConfig } from "../common/axiosConfig";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Check from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useMutation, useQuery } from "react-query";
import createSnackAlert from "../../actions/snackAlerts";
import TextField from "@material-ui/core/TextField";
import { useSearchQuery } from "../hooks";
import { isValidUUID } from "../../validators/validators";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    background: theme.palette.background.default,
  },
  avatar: {
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    background: theme.palette.secondary.main,
    height: 50,
    width: 50,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const INVITE_BASE_URL = "/api/projects/req/project/invite?action=";

const getInvitation = async (kit, key, token) => {
  return await axios.get(
    `${INVITE_BASE_URL}get&kit=${kit}&key=${key}`,
    tokenConfig(token)
  );
};
const acceptInvite = async (kwargs) => {
  const { kit, key, token, passcode } = kwargs;
  const body = JSON.stringify({ passcode });
  return await axios.put(
    `${INVITE_BASE_URL}accept&kit=${kit}&key=${key}`,
    body,
    tokenConfig(token)
  );
};

const InvitationView = () => {
  const classes = useStyles();
  const { token } = useSelector((state) => state.auth);
  const query_params = useSearchQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const [passcode, setPasscode] = useState("");

  const key = query_params.get("key");
  const kit = query_params.get("kit");
  const action = query_params.get("action");
  const isValidParams = Boolean(isValidUUID(key, 4) && action && kit);

  const {
    isLoading: isQueryLoading,
    data: invitation,
    isError: isQueryError,
  } = useQuery(
    ["projectInvite", kit, key, token],
    () => getInvitation(kit, key, token),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        dispatch(createSnackAlert(error.response.data, error.response.status));
      },
      enabled: isValidParams,
    }
  );

  const {
    mutate: acceptInvitation,
    isLoading,
    isSuccess,
    isError,
  } = useMutation(acceptInvite, {
    onSuccess: ({ data }) => history.push(`/project/${data.response.id}`),
    onError: (error) => {
      dispatch(createSnackAlert(error.response.data, error.response.status));
    },
  });

  const handleAccept = () => {
    if (!isValidParams) return;
    if (passcode.trim().length < 1)
      return dispatch(createSnackAlert("passcode required", 400));
    acceptInvitation({ kit, key, token, passcode });
  };

  const handleIgnore = () => {
    history.push("/");
  };

  const handleChange = (e) => {
    setPasscode(e.target.value);
  };

  const inviteError = Boolean(isQueryError || !isValidParams);

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
      position={"absolute"}
      width={"100%"}
      top={"0"}>
      {isQueryLoading && <h3>Loading...</h3>}

      {invitation && isValidParams && (
        <Box
          className={classes.cardRoot}
          elevation={0}
          textAlign={"center"}
          component={Card}>
          <CardContent>
            <Typography variant={"h5"} component={"h3"}>
              Project Invite
            </Typography>
            <Box sx={{ my: 1 }} display={"flex"} justifyContent={"center"}>
              {!isLoading ? (
                <Avatar className={classes.avatar}>
                  {isSuccess || invitation.data.part_of_project ? (
                    <Check fontSize={"large"} />
                  ) : (
                    <Group fontSize={"large"} />
                  )}
                </Avatar>
              ) : (
                <CircularProgress size={50} />
              )}
            </Box>
            {invitation.data.part_of_project ? (
              <>
                <Typography variant={"h6"} sx={{my: 2}}>
                  You are already part of the project
                </Typography>
                <Button
                  variant={"contained"}
                  size={"small"}
                  onClick={() => {
                    history.push(`/project/${invitation.data.project_id}`);
                  }}>
                  open project
                </Button>
              </>
            ) : (
              <>
                <Typography variant={"subtitle1"}>
                  Invite to join <b>{invitation.data.project_name}</b>
                </Typography>
                <Typography
                  color={"textSecondary"}
                  variant={"caption"}
                  component={"p"}>
                  from {invitation.data.creator_name}
                </Typography>
              </>
            )}
            {!isSuccess && !invitation.data.part_of_project && (
              <Box sx={{ my: 2 }}>
                <TextField
                  variant={"outlined"}
                  size={"small"}
                  placeholder={"enter invite passcode"}
                  sx={{ my: 2, display: "block" }}
                  value={passcode}
                  onChange={handleChange}
                />
                <Button
                  size={"small"}
                  variant={"outlined"}
                  color={"secondary"}
                  disabled={isLoading}
                  onClick={handleIgnore}>
                  Ignore Invite
                </Button>{" "}
                <Button
                  size={"small"}
                  variant={"contained"}
                  color={"primary"}
                  onClick={handleAccept}
                  disabled={isLoading || passcode.trim().length < 2}>
                  Join Project
                </Button>
              </Box>
            )}
          </CardContent>
        </Box>
      )}

      {inviteError && (
        <Typography variant={"h5"}>Oops... invite link is not valid</Typography>
      )}
    </Box>
  );
};

export default InvitationView;
