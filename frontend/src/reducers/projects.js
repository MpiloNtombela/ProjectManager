import produce from "immer";
import * as action from "../actions/projectTypes";

const initialState = {
  projects: null,
  project: null,
  boardsState: {
    boards: null,
    isBoardsLoading: false,
    isCreating: false
  },
  tasksState: {
    task: null,
    tasks: null,
    isTaskLoading: false,
    isAdding: false,
    isRequesting: false
  }
};

export default function (state = initialState, {type, payload}) {
  return produce(state, (draft) => {
    switch (type) {
      case action.GET_USER_PROJECTS:
      case action.GET_PROJECT:
        draft.isLoading = true
        break
      case action.GET_TASK:
        draft.tasksState.isTaskLoading = true
        break
      case action.ADD_TASK:
        draft.tasksState.isAdding = true
        break
      case action.GET_BOARDS:
        draft.boardsState.isBoardsLoading = true
        break
      case action.CREATE_BOARD:
        draft.boardsState.isCreating = true
        break
      case action.TASK_VIEW_REQUESTING:
        draft.tasksState.isRequesting = true
        break

      // request success
      case action.PROJECTS_LOADED:
        draft.projects = payload
        draft.isLoading = false
        break;
      case action.PROJECT_LOADED:
        draft.project = payload
        draft.isLoading = false
        break
      case action.TASK_LOADED:
        draft.tasksState.task = payload
        draft.tasksState.isTaskLoading = false
        break
      case action.TASK_ADDED:
        draft.boardsState.boards[payload.index]["board_tasks"].push(payload.data)
        draft.tasksState.isAdding = false
        break
      case action.TASK_DELETED:
        draft.boardsState.boards[payload.boardIndex]["board_tasks"].splice(payload.taskIndex, 1)
        draft.tasksState.task = null
        break
      case action.BOARDS_LOADED:
        draft.boardsState.boards = payload
        draft.boardsState.isBoardsLoading = false
        break
      case action.BOARD_CREATED:
        draft.boardsState.boards.push(payload)
        draft.boardsState.isCreating = false
        break
      case action.BOARD_DELETED:
        draft.boardsState.boards.splice(payload, 1)
        break
      case action.COMMENT_ADDED:
        draft.tasksState.task['task_comments'].unshift(payload)
        draft.tasksState.isRequesting = false
        break

      // request failed
      case action.PROJECTS_REQUEST_FAILED:
      case action.PROJECT_REQUEST_FAILED:
        draft.isLoading = false
        break
      case action.BOARDS_REQUEST_FAILED:
        draft.boardsState.isBoardsLoading = false
        draft.boardsState.isCreating = false
        break
      case action.TASK_REQUEST_FAILED:
      case action.COMMENT_REQUEST_FAILED:
        draft.tasksState.isTaskLoading = false
        draft.tasksState.isAdding = false
        draft.tasksState.isRequesting = false
        break

      // clear
      case action.CLEAR_PROJECT_STATE:
        return initialState
      default:
        return state;
    }
  });
}

