import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {PlaylistAdd} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import NewTaskForm from "./NewTaskForm";
import {useSelector} from "react-redux";
import Skeleton from "@material-ui/core/Skeleton";
import Task from "./Task";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles({
  cardSkeletonPadding: {
    padding: '.75rem .55rem'
  }
})

const Tasks = ({tasks, handleAddNewTask, boardIndex}) => {
  const classes = useStyles()
  const [isNewTask, setIsNewTask] = useState(false)
  const isAdding = useSelector(state => state.projectState.tasksState.isAdding)
  // const [taskAdding, setTaskAdding] = useState(false)

  // useEffect(() => {
  //   setTaskAdding(isAdding)
  // }, [isAdding])

  const handleClickAway = () => {
    setIsNewTask(false)
  }
  const handleAddNewTaskClick = () => {
    setIsNewTask(true)
  };

  return (
    <>
      {tasks.map((task, idx) => (
        <Task key={task.id} task={task} taskIndex={idx} boardIndex={boardIndex}/>
      ))}
      {isAdding && isNewTask &&
      <Card>
        <CardHeader
          className={classes.cardSkeletonPadding}
          title={<Skeleton variant='text' height={20}/>}
          subheader={<Skeleton animation="wave" variant='text' width='45%' height={10}/>}
        />
      </Card>}
      {isNewTask ?
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <NewTaskForm
              handleAddNewTask={handleAddNewTask}
              setIsNewTask={setIsNewTask}/>
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
  handleAddNewTask: PropTypes.func.isRequired,
  boardIndex: PropTypes.number
}

export default memo(Tasks);
