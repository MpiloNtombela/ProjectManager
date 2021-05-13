import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {DoneAll} from "@material-ui/icons";
import Card from "@material-ui/core/Card";
import {useDispatch} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TaskView from "./TaskView";
import {getTask} from "../../actions/projects/tasks";
import AvatarGroup from "@material-ui/core/AvatarGroup";
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "0 0 .25rem rgba(0, 0, 0, .25)",
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(.75, 0)
  },
  cardPadding: {
    padding: '.55rem'
  },
  avatar: {
    width: '1.25rem',
    height: '1.25rem',
    fontSize: 'small',
  }
}))

const Task = ({task}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [openTask, setOpenTask] = useState(false)
  const handleTaskCardClick = () => {
    dispatch(getTask(task.id))
    setOpenTask(true)
  };
  
  return (
    <>
      <Card className={classes.root}
            onClick={handleTaskCardClick}>
        <CardActionArea style={{display: 'block'}} component='div'>
          <CardHeader
            classes={{root: classes.cardPadding}}
            title={<Typography variant={"subtitle2"}>{task.name}</Typography>}
          icon={<DoneAll/>}/>
          <Grid container justifyContent={"flex-end"} alignItems="center" spacing={1} style={{width: '100%'}}>
            <AvatarGroup max={3} classes={{avatar: classes.avatar}}>
              {task['members'].map(member => (
                <Avatar key={member.id} className={classes.avatar} alt={member.username} src={member.avatar}/>
              ))}
            </AvatarGroup>
          </Grid>
        </CardActionArea>
      </Card>
      <TaskView setOpenTask={setOpenTask} openTask={openTask}/>
    </>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired
};

export default memo(Task);