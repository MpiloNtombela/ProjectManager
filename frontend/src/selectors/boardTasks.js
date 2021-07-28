import { createSelector } from "reselect";
const boardSelector = (state, board) =>
  state.boardsState.boards.find((b) => b.id === board.id);
const taskSelector = (state) => state.tasksState.tasks;

const getBoardTask = (board, tasks) => {
  if (!board || !tasks) {
    return false;
  }
  const taskx = tasks.filter((task) => task.board.id === board.id).sort((a, b) => a.moved_at - b.moved_at);
  return taskx;
};

export default createSelector(boardSelector, taskSelector, getBoardTask);
