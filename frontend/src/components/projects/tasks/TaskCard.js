import React, {memo, useEffect, useState} from 'react';
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

const useStyles = makeStyles({
  cardPadding: {
    padding: '.55rem'
  }
})

const TaskCard = ({tasks, handleAddNewTask}) => {
  const classes = useStyles()
  const [isNewTask, setIsNewTask] = useState(false)
  const isAdding = useSelector(state => state.projectState.tasksState.isAdding)
  const [taskAdding, setTaskAdding] = useState(false)

  useEffect(() => {
    setTaskAdding(isAdding)
  }, [isAdding])

  const handleAddNewTaskClick = () => {
    setIsNewTask(true)
  };

  return (
    <>
      {tasks.map(task => (
        <Task key={task.id} task={task}/>
      ))}
      {taskAdding && isNewTask &&
      <Card>
        <CardHeader
          className={classes.cardPadding}
          title={<Skeleton variant='text' height={20}/>}
          subheader={<Skeleton animation="wave" variant='text' width='45%' height={10}/>}
        />
      </Card>}
      {isNewTask ?
        <NewTaskForm
          handleAddNewTask={handleAddNewTask}
          setIsNewTask={setIsNewTask}/>
        : <Button
          fullWidth color='secondary'
          startIcon={<PlaylistAdd/>}
          onClick={handleAddNewTaskClick}
          disabled={taskAdding}>add new task</Button>
      }
    </>
  )
}

TaskCard.propTypes = {
  tasks: PropTypes.array.isRequired,
  handleAddNewTask: PropTypes.func.isRequired
}

export default memo(TaskCard);
