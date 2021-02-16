import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {Comment, InsertDriveFile, People} from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import {useDispatch} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TaskView from "./TaskView";
import {deleteTask, getTask} from "../../../actions/projects/tasks";


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

const Task = ({task, taskIndex, boardIndex}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [openTask, setOpenTask] = useState(false)
  const handleTaskCardClick = () => {
    dispatch(getTask(task.id))
    setOpenTask(true)
  };
  const handleTaskDelete = () =>{
    dispatch(deleteTask(task.id, boardIndex, taskIndex))
  }
  return (
    <>
      <Card className={classes.root}
            onClick={handleTaskCardClick}>
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
                <People color='inherit' classes={{root: classes.svgRoot}}/> {task.members.length}
              </Typography></Grid>
            {/*<Grid item></Grid>*/}
          </Grid>
        </CardActionArea>
      </Card>
      <TaskView id={task.id} setOpenTask={setOpenTask} openTask={openTask} handleTaskDelete={handleTaskDelete}/>
    </>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  taskIndex: PropTypes.number,
  boardIndex: PropTypes.number,
};

export default memo(Task);