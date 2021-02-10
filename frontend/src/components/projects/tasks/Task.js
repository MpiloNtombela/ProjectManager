import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {Comment, InsertDriveFile, People} from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import {getTask} from "../../../actions/projects";
import {useDispatch} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TaskDetails from "./TaskDetails";
import whyDidYouRender from "@welldone-software/why-did-you-render";


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

const Task = ({task}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [openTask, setOpenTask] = useState(false)
  const handleTaskCardClick = (id) => {
    dispatch(getTask(id))
    setOpenTask(true)
  };
  return (
    <>
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
    </>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired
};

export default memo(Task);