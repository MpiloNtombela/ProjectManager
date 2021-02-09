import axios from "axios";
import * as action from "./projectTypes";
import createSnackAlert from "./snackAlerts";
import {tokenConfig} from "../components/common/axiosConfig";
import {batch} from "react-redux";

/**
 * **gets all logged in user projects**
 */
export const loadUserProjects = () => {
  // getApiData(
  //   '/api/projects/req/projects/',
  //   action.GET_USER_PROJECTS,
  //   action.PROJECTS_LOADED,
  //   action.PROJECTS_REQUEST_FAILED)
};

/**
 * **gets a single project and all it boards**
 * @param {string} id of the requested project
 */
export const getProject = (id) => (dispatch, getState) => {
  const token = getState().auth.token
  const ROOT_URL = `/api/projects/req/project/${id}`
  dispatch({type: action.GET_PROJECT})
  dispatch({type: action.GET_BOARDS})
  const getProject = () => axios.get(`${ROOT_URL}/`, tokenConfig(token))
  const getBoards = () => axios.get(`${ROOT_URL}/boards/`, tokenConfig(token))
  axios.all([getProject(), getBoards()])
    .then(res => {
      const [project, boards] = res
      dispatch({
        type: action.PROJECT_LOADED,
        payload: project.data
      });
      dispatch({
        type: action.BOARDS_LOADED,
        payload: boards.data
      });
    }).catch((err) => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    batch(() => {
      dispatch({type: action.PROJECT_REQUEST_FAILED})
      dispatch({type: action.BOARDS_REQUEST_FAILED})
    })
  })
}

/**
 * **gets a single task**
 * @param {string} id of the task
 */
export const getTask = (id) => (dispatch, getState) => {
  dispatch({type: action.GET_TASK});
  axios.get(`/api/projects/req/task/${id}/`, tokenConfig(getState().auth.token))
    .then((res) => {
      dispatch({
        type: action.TASK_LOADED,
        payload: res.data
      });
    })
    .catch((err) => {
      if (err.response) {
        dispatch(createSnackAlert(err.response.data, err.response.status))
      } else {
        dispatch(createSnackAlert(err.message, 400))
      }
      dispatch({type: action.TASK_REQUEST_FAILED})
    });
}

export const createBoard = (name, id) => (dispatch, getState) => {
  dispatch({type: action.CREATE_BOARD})
  const body = JSON.stringify({name, project: id})
  axios.post(`/api/projects/req/project/${id}/boards/`, body, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.BOARD_CREATED,
        payload: res.data
      })
    }).catch((err) => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    dispatch({type: action.BOARDS_REQUEST_FAILED})
  })
}

/**
 * **action to delete the board**
 * @param {string} id *id of the board to be deleted*
 * @param {number} index *index of the board to be deleted, use index to remove board from the state*
 * */
export const deleteBoard = (id, index) => (dispatch, getState) => {
  axios.delete(`/api/projects/req/board/${id}/`, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.BOARD_DELETED,
        payload: index
      })
      dispatch(createSnackAlert("board deleted successfully", res.status))
    }).catch(err => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    dispatch({type: action.BOARDS_REQUEST_FAILED})
  })
}