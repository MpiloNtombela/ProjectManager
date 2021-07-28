import Paper from "@material-ui/core/Paper";
import React, { Suspense } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ProjectPageSkeleton from "../skeletons/projects/ProjectPageSkeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { tokenConfig } from "../common/axiosConfig";
import { useQuery } from "react-query";
import {
  BOARDS_LOADED,
  PROJECT_LOADED
} from "../../actions/projectTypes";
import ProjectDrawer from "./ProjectDrawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const ProjectView = React.lazy(() => import("./ProjectView"));

const useStyles = (matches) =>
  makeStyles((theme) => ({
    root: {
      minHeight: "100vh",
      background: theme.palette.primary.main,
      minWidth: "100%",
      scrollbarWidth: "tiny",
      "&::-webkit-scrollbar": {
        width: ".50rem",
        height: ".50rem",
      },
      "&::-webkit-scrollbar-thumb": {
        background: theme.palette.secondary.light,
      },
    },
    tabs: {
      background: theme.palette.background.paper,
      position: "sticky",
      top: theme.sizing.toolbarHeight,
      zIndex: 1,
      marginBottom: theme.spacing(1),
    },
    container: {
      marginTop: theme.mixins.toolbar.minHeight,
      minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
      marginLeft: () => (matches ? theme.spacing(8) : theme.spacing(0)),
    },
  }));

const ROOT_URL = `/api/projects/req/project`;
const getProj = async (id, token) =>
  await axios.get(`${ROOT_URL}/${id}/`, tokenConfig(token));

const getBoards = async (id, token) =>
  await axios.get(`${ROOT_URL}/${id}/boards/`, tokenConfig(token));

// const getTasks = async (id, token) =>
//   await axios.get(`${ROOT_URL}/${id}/tasks/`, tokenConfig(token));

const ProjectTemplate = () => {
  const matchesSmUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const classes = useStyles(matchesSmUp)();
  const dispatch = useDispatch();

  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const { isLoading: isProjectLoading, isError: isProjectError } = useQuery(
    ["project", id, token],
    () => getProj(id, token),
    {
      onSuccess: ({ data }) => {
        return dispatch({
          type: PROJECT_LOADED,
          payload: data,
        });
      },
      // refetchInterval: 50000,
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isBoardsLoading, isError: isBoardsError } = useQuery(
    ["boards", id, token],
    () => getBoards(id, token),
    {
      onSuccess: ({ data }) => {
        return dispatch({
          type: BOARDS_LOADED,
          payload: data,
        });
      },
      // refetchInterval: 10000,
      refetchOnWindowFocus: false,
    }
  );

  const isLoading = Boolean(
    isProjectLoading || isBoardsLoading
  );
  const isError = Boolean(isProjectError || isBoardsError);
  return (
    <Paper square elevation={2} className={classes.root}>
      <Suspense fallback={<ProjectPageSkeleton />}>
        <ProjectDrawer />
        <div className={classes.container}>
          <Tabs
            className={classes.tabs}
            value={0}
            aria-label="project tabs"
            textColor={"secondary"}
            indicatorColor={'secondary'}
            variant="scrollable">
            <Tab label="Board View" />
            <Tab label="Calendar View" />
            <Tab label="Attachments" />
          </Tabs>
          <ProjectView isLoading={isLoading} isError={isError} />
        </div>
      </Suspense>
    </Paper>
  );
};

export default ProjectTemplate;
