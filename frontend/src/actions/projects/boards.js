import * as action from "../projectTypes";
import axios from "axios";
import {tokenConfig} from "../../components/common/axiosConfig";
import createSnackAlert from "../snackAlerts";

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
    dispatch({type: action.BOARD_REQUEST_FAILED})
  })
}

/**
 * **update board**
 * @param {string} id an id of the task
 * @param {object} data a data to be updated
 */
export const updateBoard = (id, data) => (dispatch, getState) => {
  const body = JSON.stringify(data)
  axios.patch(`/api/projects/req/board/${id}/`, body, tokenConfig(getState().auth.token))
    .then((res) => {
      dispatch({
        type: action.BOARD_UPDATED,
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
      dispatch({type: action.BOARD_REQUEST_FAILED})
    });
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
      dispatch(createSnackAlert(res.data.message, res.status))
    }).catch(err => {
    if (err.response) {
      dispatch(createSnackAlert(err.response.data, err.response.status))
    } else {
      dispatch(createSnackAlert(err.message, 400))
    }
    dispatch({type: action.BOARD_REQUEST_FAILED})
  })
}
