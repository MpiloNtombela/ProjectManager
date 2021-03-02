import {createSelector} from "reselect";
const boardSelector = (state, board) => state.boardsState.boards.find(b => b.id === board.id);
const taskSelector = state => state.tasksState.tasks

const getBoardTask = (board, tasks) => {
  if (!board || !tasks) {
    return false
  }
  const taskx =  tasks.filter(
    task => {
      return task.board.id === board.id
    }
  )
  return taskx
}

export default createSelector(
  boardSelector,
  taskSelector,
  getBoardTask
)