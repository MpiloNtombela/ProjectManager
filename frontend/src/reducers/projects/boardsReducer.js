import produce from "immer";
import * as action from "../../actions/projectTypes";

const initialState = {
  boards: null,
  isBoardsLoading: false,
  isCreating: false
};

const boardsReducer = (state = initialState, {type, payload}) => produce(state, (draft) => {
  switch (type) {
    case action.GET_BOARDS:
      draft.isBoardsLoading = true
      break
    case action.CREATE_BOARD:
      draft.isCreating = true
      break

    // request success
    case action.TASK_ADDED:
      draft.boards[payload.index]["board_tasks"].push(payload.data)
      break
    case action.TASK_DELETED:
      draft.boards[payload.boardIndex]["board_tasks"].splice(payload.taskIndex, 1)
      break
    case action.BOARDS_LOADED:
      draft.boards = payload
      draft.isBoardsLoading = false
      break
    case action.BOARD_CREATED:
      draft.boards.push(payload)
      draft.isCreating = false
      break
    case action.BOARD_DELETED:
      draft.boards.splice(payload, 1)
      break

    // request failed
    case action.BOARDS_REQUEST_FAILED:
      draft.isBoardsLoading = false
      draft.isCreating = false
      break

    // clear
    case action.CLEAR_PROJECT_STATE:
    case action.CLEAR_BOARD_STATE:
      return initialState
    default:
      return state;
  }
});
export default boardsReducer
