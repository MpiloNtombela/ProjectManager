import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import {Comment, InsertDriveFile, People, PlaylistAdd} from "@material-ui/icons";
import TaskDetails from "./TaskDetails";
import Button from "@material-ui/core/Button";
import NewTaskForm from "./NewTaskForm";
import {getTask} from "../../../actions/projects";
import {useDispatch} from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "0 0 5px rgba(0, 0, 0, .2)",
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(1, 0)
  },
  cardPadding: {
    padding: '.55rem'
  },
  svgRoot: {
    width: '1rem',
    height: '1rem'
  }
}))

const TaskCard = ({tasks}) => {
  const classes = useStyles()
  const [openTask, setOpenTask] = useState(false)
  const [isNewTask, setIsNewTask] = useState(false)
  const dispatch = useDispatch()

  const handleCreateNewTask = () => {
    setIsNewTask(true)
  }
  const handleTaskCardClick = (id) => {
    dispatch(getTask(id))
    setOpenTask(true)
  };

  const addNewTask = (e) => {
    e.preventDefault()
  };

  return (
    <>
      {tasks.map(task => (
        <div key={task.id}>
          <Card className={classes.root}
                onClick={() => {
                  handleTaskCardClick(task.id)
                }}>
            <CardActionArea style={{display: 'block'}} component='div'>
              <CardHeader
                classes={{root: classes.cardPadding}}
                title={<Typography variant={"subtitle2"}>{task.name}</Typography>}
                subheader={<Typography color="textSecondary" component={'span'}
                                       variant={"caption"}> - {task['creator'].username}</Typography>}/>
              <Grid container justifyContent={"flex-end"} alignItems="center" spacing={2} style={{width: '100%'}}>

                <Grid item>
                  <Typography color="textSecondary" variant={"caption"}>
                    <Comment color='inherit' classes={{root: classes.svgRoot}}/> 0
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary" variant={"caption"}>
                    <InsertDriveFile color='inherit' classes={{root: classes.svgRoot}}/> 0
                  </Typography></Grid>
                <Grid item>
                  <Typography color="textSecondary" variant={"caption"}>
                    <People color='inherit' classes={{root: classes.svgRoot}}/> {task.assigned.length}
                  </Typography></Grid>
                {/*<Grid item></Grid>*/}
              </Grid>
            </CardActionArea>
          </Card>
          <TaskDetails id={task.id} setOpenTask={setOpenTask} openTask={openTask}/>
        </div>
      ))}
      {isNewTask ?
        <NewTaskForm
          addNewTask={addNewTask}
          setIsNewTask={setIsNewTask}/>
        : <Button fullWidth color='secondary'
                  startIcon={<PlaylistAdd/>}
                  onClick={handleCreateNewTask}>add new task</Button>}
    </>
  )
}

TaskCard.propTypes = {
  tasks: PropTypes.array.isRequired
}

export default memo(TaskCard);
