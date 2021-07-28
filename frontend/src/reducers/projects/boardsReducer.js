import produce from "immer";
import * as action from "../../actions/projectTypes";

const initialState = {
  boards: null,
  isBoardsLoading: false,
  isCreating: false,
};

const boardsReducer = (state = initialState, { type, payload }) =>
  produce(state, (draft) => {
    switch (type) {
      case action.GET_BOARDS:
        draft.isBoardsLoading = true;
        break;
      case action.CREATE_BOARD:
        draft.isCreating = true;
        break;
      case action.BOARDS_LOADED:
        draft.boards = payload;
        draft.isBoardsLoading = false;
        break;
      case action.BOARD_CREATED:
        draft.boards.push(payload);
        draft.isCreating = false;
        break;
      case action.BOARD_UPDATED:
        if (payload.id) {
          const _board = draft.boards.find((board) => board.id === payload.id);
          for (let key of Object.keys(payload.data)) {
            if (_board[key]) _board[key] = payload.data[key];
          }
        }
        draft.isRequesting = false;
        break;
      case action.BOARD_DELETED:
        draft.boards.splice(payload, 1);
        break;
      case action.TASK_ADDED:
        draft.boards
          .find((board) => board.id === payload.boardId)
          .board_tasks.push(payload.task);
        break;
      case action.TASK_DELETED: {
        const board = draft.boards.find(
          (board) => board.id === payload.boardId
        );
        board.board_tasks.splice(
          board.board_tasks.findIndex((task) => task.id === payload.taskId),
          1
        );
        break;
      }
      case action.TASK_MOVED: {
        const sourceBoard = draft.boards.find(
          (board) => board.id === payload.board.source.id
        );
        const destinationBoard = draft.boards.find(
          (board) => board.id === payload.board.destination.id
        );
        if (!payload.error) {
          const [task] = sourceBoard.board_tasks.splice(
            payload.board.source.index,
            1
          );
          destinationBoard.board_tasks.push(task);
        } else {
          const task = sourceBoard.board_tasks.pop();
          destinationBoard.board_tasks.splice(
            payload.board.destination.index,
            0,
            task
          );
        }
        break;
      }
      case action.TASK_MEMBER_ALTERED: {
        const board = draft.boards.find(
          (board) => board.id === payload.boardId
        );
        const _task = board.board_tasks.find((task) => task.id === payload.id);
        if (payload.type.toLowerCase() === "add") {
          _task["members"].push(payload.data);
        } else if (payload.type.toLowerCase() === "remove") {
          _task["members"].splice(
            _task["members"].findIndex(
              (member) => member.id === payload.data.id
            ),
            1
          );
        }
        break;
      }
      case action.TASK_UPDATED:
        if (payload.id) {
          const board = draft.boards.find(
            (board) => board.id === payload.boardId
          );
          const _task = board.board_tasks.find(
            (task) => task.id === payload.id
          );
          for (let key of Object.keys(payload.data)) {
            // draft.task[key] = payload.data[key];
            if (_task[key]) _task[key] = payload.data[key];
          }
        }
        break;
      case action.BOARD_REQUEST_FAILED:
        draft.isBoardsLoading = false;
        draft.isCreating = false;
        break;
      case action.CLEAR_PROJECT_STATE:
      case action.CLEAR_BOARD_STATE:
        return initialState;
      default:
        return state;
    }
  });
export default boardsReducer;
