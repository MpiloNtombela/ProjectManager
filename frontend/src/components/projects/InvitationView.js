import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Group from "@material-ui/icons/Group";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { tokenConfig } from "../common/axiosConfig";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Check from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useMutation, useQuery } from "react-query";
import createSnackAlert from "../../actions/snackAlerts";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    background: theme.palette.background.default,
  },
  avatar: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    background: theme.palette.primary.main,
    height: 50,
    width: 50,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const getInvitation = async (key, token) => {
  return await axios.get(
    `/api/projects/req/project/doge?key=${key}`,
    tokenConfig(token)
  );
};
const acceptInvite = async (kwargs) => {
  const { key, token } = kwargs;
  return await axios.put(
    `/api/projects/req/project/doge?key=${key}`,
    null,
    tokenConfig(token)
  );
};

const InvitationView = () => {
  const classes = useStyles();
  const { token } = useSelector((state) => state.auth);
  const { key } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    isLoading: isQueryLoading,
    data: invitation,
    isError: isQueryError,
  } = useQuery(["projectInvite", key, token], () => getInvitation(key, token), {
    retry: 3,
    refetchOnWindowFocus: false,
    onError: (error) => {
      dispatch(createSnackAlert(error.response.data, error.response.status));
    },
  });

  const {
    mutate: acceptInvitation,
    isLoading,
    isSuccess,
    isError,
  } = useMutation(acceptInvite, {
    onSuccess: ({ data }) => history.push(`/project/${data.response.id}`),
  });

  const handleAccept = () => {
    acceptInvitation({ key, token });
  };

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

      {invitation && !isQueryError && (
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
                  {isSuccess ? (
                    <Check fontSize={"large"} />
                  ) : (
                    <Group fontSize={"large"} />
                  )}
                </Avatar>
              ) : (
                <CircularProgress size={50} />
              )}
            </Box>
            <Typography variant={"subtitle1"}>
              Invite to join <b>{invitation.data.project_name}</b>
            </Typography>
            <Typography
              color={"textSecondary"}
              variant={"caption"}
              component={"p"}>
              from {invitation.data.creator_name}
            </Typography>
            {!isSuccess && (
              <Box sx={{ my: 2 }}>
                <Button
                  size={"small"}
                  variant={"outlined"}
                  color={"secondary"}
                  disabled={isLoading}>
                  Ignore Invite
                </Button>{" "}
                <Button
                  size={"small"}
                  variant={"contained"}
                  color={"primary"}
                  onClick={handleAccept}
                  disabled={isLoading}>
                  Join Project
                </Button>
              </Box>
            )}
            {isError && (
              <Typography className={classes.error} variant={"caption"}>
                error
              </Typography>
            )}
          </CardContent>
        </Box>
      )}
      {isQueryError && (
        <Typography variant={"h5"}>Oops... invite link is not valid</Typography>
      )}
    </Box>
  );
};

export default InvitationView;
