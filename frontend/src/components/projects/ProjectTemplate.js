import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import React, { Suspense } from "react";
import ProjectPageSkeleton from "../skeletons/projects/ProjectPageSkeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { tokenConfig } from "../common/axiosConfig";
import { useQuery } from "react-query";
import {
  BOARDS_LOADED,
  PROJECT_LOADED,
  TASKS_LOADED,
} from "../../actions/projectTypes";

const ProjectView = React.lazy(() => import("./ProjectView"));

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background:
      theme.palette.mode === "light"
        ? "#eee"
        : theme.palette.background.default,
    overflowY: "auto",
    minWidth: "100%",
    paddingTop: "3.75rem",
    scrollbarWidth: "tiny",
    "&::-webkit-scrollbar": {
      width: ".25rem",
    },
  },
  container: {
    height: "100%",
    padding: 0,
  },
}));

const ROOT_URL = `/api/projects/req/project`;
const getProj = async (id, token) =>
  await axios.get(`${ROOT_URL}/${id}/`, tokenConfig(token));

const getBoards = async (id, token) =>
  await axios.get(`${ROOT_URL}/${id}/boards/`, tokenConfig(token));

const getTasks = async (id, token) =>
  await axios.get(`${ROOT_URL}/${id}/tasks/`, tokenConfig(token));

const ProjectTemplate = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const {
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery(["project", id, token], () => getProj(id, token), {
    onSuccess: ({ data }) => {
      return dispatch({
        type: PROJECT_LOADED,
        payload: data,
      });
    },
    // refetchInterval: 50000,
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isBoardsLoading,
    isError: isBoardsError,
  } = useQuery(["boards", id, token], () => getBoards(id, token), {
    onSuccess: ({ data }) => {
      return dispatch({
        type: BOARDS_LOADED,
        payload: data,
      });
    },
    // refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useQuery(["tasks", id, token], () => getTasks(id, token), {
    onSuccess: ({ data }) => {
      return dispatch({
        type: TASKS_LOADED,
        payload: data,
      });
    },
    // refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  const isLoading = Boolean(isProjectLoading || isBoardsLoading || isTasksLoading)
  const isError = Boolean(isProjectError || isBoardsError || isTasksError)

  return (
    <Paper square elevation={0} className={classes.root}>
      <Container maxWidth="xl" className={classes.container}>
        <Suspense fallback={<ProjectPageSkeleton />}>
          <ProjectView isLoading={isLoading} isError={isError}/>
        </Suspense>
      </Container>
    </Paper>
  );
};

export default ProjectTemplate;
