import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import {PlaylistAdd} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import NewTaskForm from "./forms/NewTaskForm";
import {useSelector} from "react-redux";
import Task from "./Task";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TaskSkeleton from "../../skeletons/projects/TaskSkeleton";

const Tasks = ({tasks, boardId}) => {
  const [isNewTask, setIsNewTask] = useState(false)
  const isAdding = useSelector(state => state.tasksState.isAdding)

  const handleClickAway = () => {
    setIsNewTask(isAdding)
  }
  const handleAddNewTaskClick = () => {
    setIsNewTask(true)
  };

  return (
    <>
      {tasks.map((task) => (
        <Task key={task.id} task={task}/>
      ))}
      {isAdding && isNewTask && <TaskSkeleton num={[1]}/>}
      {isNewTask ?
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <NewTaskForm setIsNewTask={setIsNewTask} boardId={boardId}/>
          </div>
        </ClickAwayListener>
        : <Button
          fullWidth color='secondary'
          startIcon={<PlaylistAdd/>}
          onClick={handleAddNewTaskClick}
          disabled={isAdding}>add new task</Button>
      }
    </>
  )
}

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  boardId: PropTypes.string
}

export default memo(Tasks);
