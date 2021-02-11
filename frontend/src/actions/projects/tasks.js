import * as action from "../projectTypes";
import axios from "axios";
import {tokenConfig} from "../../components/common/axiosConfig";
import createSnackAlert from "../snackAlerts";

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


/**
 * @description creates an new task
 * @param {string} name name of the task
 * @param {string} id of the board for the task
 * @param {number} idx index of the board in the store/state
 * */
export const addTask = (name, id, idx) => (dispatch, getState) => {
  dispatch({type: action.ADD_TASK})
  const body = JSON.stringify({name, project: id})
  axios.post(`/api/projects/req/board/${id}/tasks/`, body, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.TASK_ADDED,
        payload: {
          data: res.data,
          index: idx
        }
      })
    }).catch((err) => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    dispatch({type: action.TASK_REQUEST_FAILED})
  })
}

/**
 * @description action creator for deleting task
 * @param {string} id of the task to be deleted
 * @param {number} boardIndex index of the board the task is in at
 * @param {number} taskIndex index of the task in the board
* */
export const deleteTask = (id, boardIndex, taskIndex) => (dispatch, getState) => {
  axios.delete(`/api/projects/req/task/${id}/`, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.TASK_DELETED,
        payload: {
          boardIndex,
          taskIndex
        }
      })
      console.log(res)
      dispatch(createSnackAlert(res.data.message, res.status))
    }).catch(err => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    dispatch({type: action.BOARDS_REQUEST_FAILED})
  })
}
