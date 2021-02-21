import produce from "immer";
import * as action from "../../actions/projectTypes";

const initialState = {
  task: null,
  tasks: null,
  isTaskLoading: false,
  isAdding: false,
  isRequesting: false
};

const tasksReducer = (state = initialState, {type, payload}) => produce(state, (draft) => {
  switch (type) {
    case action.GET_TASK:
      draft.isTaskLoading = true
      break
    case action.ADD_TASK:
      draft.isAdding = true
      break
    case action.TASK_VIEW_REQUESTING:
      draft.isRequesting = true
      break

    // request success
    case action.TASK_LOADED:
      draft.task = payload
      draft.isTaskLoading = false
      break
    case action.TASK_ADDED:
      draft.isAdding = false
      break
    case action.TASK_DELETED:
      draft.task = null
      draft.isRequesting = false
      break
    case action.TASK_MEMBER_ALTERED:
      if (payload.type.toLowerCase() === 'add') {
        draft.task['members'].push(payload.data)
      } else if (payload.type.toLowerCase() === 'remove') {
        draft.task['members'].splice(
          draft.task['members'].findIndex(member => member.id === payload.data.id), 1)
      }
      draft.isRequesting = false
      break
    case action.COMMENT_ADDED:
      draft.task['task_comments'].unshift(payload)
      draft.isRequesting = false
      break
    case action.COMMENT_DELETED:
      draft.task['task_comments'].splice(
        draft.task['task_comments'].findIndex(comment => comment.id === payload), 1)
      draft.isRequesting = false
      break

    // request failed
    case action.TASK_REQUEST_FAILED:
    case action.COMMENT_REQUEST_FAILED:
      draft.isTaskLoading = false
      draft.isAdding = false
      draft.isRequesting = false
      break

    // clear
    case action.CLEAR_PROJECT_STATE:
    case action.CLEAR_TASK_STATE:
      return initialState
    default:
      return state;
  }
});

export default tasksReducer
