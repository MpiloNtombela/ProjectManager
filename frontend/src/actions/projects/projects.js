import axios from "axios";
import * as action from "../projectTypes";
import createSnackAlert from "../snackAlerts";
import {batch} from "react-redux";
import {tokenConfig} from "../../components/common/axiosConfig";

/**
 * @description **gets a single project and all it boards**
 * @param {string} id of the requested project
 */
export const getProject = (id) => (dispatch, getState) => {
  const token = getState().auth.token
  const ROOT_URL = `/api/projects/req/project/${id}`
  dispatch({type: action.GET_PROJECT})
  dispatch({type: action.GET_BOARDS})
  const getProject = () => axios.get(`${ROOT_URL}/`, tokenConfig(token))
  const getBoards = () => axios.get(`${ROOT_URL}/boards/`, tokenConfig(token))
  const getTasks = () => axios.get(`${ROOT_URL}/tasks/`, tokenConfig(token))
  axios.all([getProject(), getBoards(), getTasks()])
    .then(res => {
      const [project, boards, tasks] = res
      dispatch({
        type: action.PROJECT_LOADED,
        payload: project.data
      });
      dispatch({
        type: action.BOARDS_LOADED,
        payload: boards.data
      });
      dispatch({
        type: action.TASKS_LOADED,
        payload: tasks.data
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