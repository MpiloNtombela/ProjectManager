import * as action from "../projectTypes";
import axios from "axios";
import {tokenConfig} from "../../components/common/axiosConfig";
import createSnackAlert from "../snackAlerts";


/**
 * @description creates an new task
 * @param {string} name name of the task
 * @param {string} id of the board the task belong to
 * */
export const addTask = (name, id) => (dispatch, getState) => {
  dispatch({type: action.ADD_TASK})
  const body = JSON.stringify({name})
  axios.post(`/api/projects/req/board/${id}/tasks/`, body, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.TASK_ADDED,
        payload: res.data
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
 * **allow editing of task**
 * @param {string} id an id of the task
 * @param {object} data a data to be updated
 */
export const updateTask = (id, data) => (dispatch, getState) => {
  dispatch({type: action.TASK_VIEW_REQUESTING});
  const body = JSON.stringify(data)
  axios.patch(`/api/projects/req/task/${id}/`, body, tokenConfig(getState().auth.token))
    .then((res) => {
      dispatch({
        type: action.TASK_UPDATED,
        payload: {
          id,
          data: res.data.response
        }
      });
      dispatch(createSnackAlert(res.data.message, res.status))
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
 * @description action creator for deleting task
 * @param {string} id of the task to be deleted
 * */
export const deleteTask = (id) => (dispatch, getState) => {
  dispatch({type: action.TASK_VIEW_REQUESTING})
  axios.delete(`/api/projects/req/task/${id}/`, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.TASK_DELETED,
        payload: id
      })
      dispatch(createSnackAlert(res.data.message, res.status))
    }).catch(err => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    dispatch({type: action.TASK_REQUEST_FAILED})
  })
}

/**
 * @description add user to task members
 * @param {string} taskId task id
 * @param {string} userId user id
 * @param {string} type alteration type [add | remove]
 * */
export const addRemoveMember = (taskId, userId, type) => (dispatch, getState) => {
  if (type.toLowerCase() !== 'add' && type.toLowerCase() !== 'remove') {
    return
  }
  dispatch({type: action.TASK_VIEW_REQUESTING})
  const body = JSON.stringify({id: userId, type})
  axios.patch(`/api/projects/req/task/${taskId}/members/`, body, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.TASK_MEMBER_ALTERED,
        payload: {
          type,
          data: res.data.response,
          id: taskId
        }
      })
      dispatch(createSnackAlert(res.data.message, res.status))
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
 * @description add a comment
 * @param {string} comment comment body
 * @param {string} id task id
 * */
export const addComment = (comment, id) => (dispatch, getState) => {
  dispatch({type: action.TASK_VIEW_REQUESTING})
  const body = JSON.stringify({comment})
  axios.post(`/api/projects/req/task/${id}/comments/`, body, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.COMMENT_ADDED,
        payload: res.data
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

export const deleteComment = (id) => (dispatch, getState) => {
  dispatch({type: action.TASK_VIEW_REQUESTING})
  axios.delete(`/api/projects/req/comment/${id}/`, tokenConfig(getState().auth.token))
    .then(res => {
      dispatch({
        type: action.COMMENT_DELETED,
        payload: id
      })
      dispatch(createSnackAlert(res.data.message, res.status))
    }).catch((err) => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    dispatch({type: action.COMMENT_REQUEST_FAILED})
  })
}
