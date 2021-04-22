import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TaskViewSkeleton from "../../skeletons/projects/TaskViewSkeleton";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import DateRange from "@material-ui/icons/DateRange";
// import PersonAdd from "@material-ui/icons/PersonAdd";
import {useDispatch, useSelector} from "react-redux";
import TaskComments from "./TaskComments";
import TaskCommentForm from "./forms/TaskCommentForm";
import {addComment, deleteTask} from "../../../actions/projects/tasks";
import createSnackAlert from "../../../actions/snackAlerts";
import LinearProgress from "@material-ui/core/LinearProgress";
import TasksMembers from "./TaskMembers";
import {TaskDescriptionEdit, TaskNameEdit} from "./InlineEditable";
import DeadlineForm from "./forms/DeadlineForm";
import TaskLogs from "./TaskLogs";
import SubtaskForm from "./forms/SubtaskForm";
import Subtasks from "./Subtasks";
import TaskViewBar from "./TaskViewBar";
import MembersForm from "./forms/MembersForm";
import Chip from "@material-ui/core/Chip";
import Alarm from "@material-ui/icons/Alarm";
import {timeDiffFromNow} from "../../../utils";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    width: '100%'
  },
  paper: {
    maxWidth: '820px'
  },
  
  dialogContentRoot: {
    padding: 0,
    margin: 0
  },
  gridItem: {
    padding: 0
  },
  
  actionButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    
    '& .deleteButton': {
      color: theme.palette.error.main,
      fontWeight: '600'
    }
  },
  
  subHeader: {
    fontSize: 'medium'
  },
  main: {
    padding: '1.5rem .75rem'
  },
  sideBar: {
    padding: '1.5rem .75rem'
  },
  closeBtn: {
    position: 'absolute',
    right: '.75rem',
    top: '.25rem'
  }
}))


const TaskView = ({openTask, setOpenTask}) => {
  const smMatches = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const classes = useStyles()
  const {isTaskLoading, task, isRequesting} = useSelector(state => state.tasksState)
  const dispatch = useDispatch()
  const [deadlineAnchorEl, setDeadlineAnchorEl] = React.useState(null);
  
  
  const handleDeadlineClick = (event) => {
    setDeadlineAnchorEl(deadlineAnchorEl ? null : event.currentTarget);
  };
  
  const handleClose = () => {
    setOpenTask(false)
  }
  
  const handleOnClose = (e) => {
    e.preventDefault()
  }
  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }
  
  const handleAddComment = (commentBody) => {
    const comment = commentBody.trim()
    if (comment) {
      dispatch(addComment(comment, task.id))
    } else {
      dispatch(createSnackAlert('write a comment first!', 400))
    }
  }
  
  return (
    <Dialog fullWidth fullScreen={smMatches} open={openTask} scroll='body' classes={{paper: classes.paper}}
            aria-labelledby="tasks-details" onClose={handleOnClose}>
      {isTaskLoading ? <TaskViewSkeleton/>
        : task ?
          <>
            <TaskViewBar avatar={task.creator.avatar} handleClose={handleClose} handleDelete={handleDelete}/>
            {isRequesting && <LinearProgress variant={'indeterminate'} color={'secondary'}/>}
            <DialogContent classes={{root: classes.dialogContentRoot}}>
              <Grid container className={classes.root}>
                <Grid item xs={12} sm={8} className={classes.main}>
                  <TaskNameEdit id={task.id} name={task.name} isRequesting={isRequesting}/>
                  <Box sx={{mt: 1, mb: 2, mx: 2}}>
                    <TaskDescriptionEdit id={task.id} description={task.description} isRequesting={isRequesting}/>
                  </Box>
                  <Box sx={{mt: 1, mb: 2}}>
                    {task['subtasks'].length > 0 &&
                    <div>
                      <Typography className={classes.subHeader} component={'h5'}>Subtasks</Typography>
                      <Subtasks subtasks={task['subtasks']}/>
                    </div>}
                    <Box sx={{mx: 2}}>
                      <SubtaskForm id={task.id}/>
                    </Box>
                  </Box>
                  <Divider/>
                  <Box sx={{my: 1}}>
                    <Typography className={classes.subHeader} component="h5">Comments</Typography>
                    <Box sx={{my: 2}}>
                      <TaskCommentForm handleAddComment={handleAddComment}/>
                    </Box>
                    {task['task_comments'].length ?
                      <TaskComments comments={task['task_comments']}/>
                      : <Typography color={'textSecondary'} variant={'body2'} component={'h2'}>
                        Ooh so empty, there is literally nothing here...
                      </Typography>
                    }
                  </Box>
                </Grid>
                {/*---------------------- aside ----------------------*/}
                <Grid item xs={12} sm={4} className={classes.sideBar}>
                  {task.deadline &&
                    <Chip icon={<Alarm/>} label={`task due ${timeDiffFromNow(task.deadline)}`}/>}
                  <Button size="small" startIcon={<DateRange/>} disableElevation
                          fullWidth color='secondary' onClick={handleDeadlineClick}>
                    new Deadline
                  </Button>
                  <Box sx={{my: 2}}>
                    <Typography className={classes.subHeader} component='h2'>Members</Typography>
                    <TasksMembers id={task.id} members={task.members} isRequesting={isRequesting}/>
                    <MembersForm/>


                   
                  </Box>
                  <Typography className={classes.subHeader} component='h2'>Task Logs</Typography>
                  {task['task_logs'].length ?
                    <TaskLogs logs={task['task_logs']}/>
                    : <Typography color={'textSecondary'} component={'small'} variant={"caption"}>
                      task changes appear here
                    </Typography>}
                </Grid>
              </Grid>
              <Divider/>
              <Box sx={{my: 2}} className={classes.actionButton}>
                <Button color='primary'
                        disableElevation
                        variant='text'
                        onClick={handleClose}
                        disabled={isRequesting}>
                  close
                </Button>
              </Box>
            </DialogContent>
            <DeadlineForm
              anchorEl={deadlineAnchorEl}
              setAnchorEl={setDeadlineAnchorEl}
              deadline={task.deadline}
              id={task.id}/>
          </> : <Typography>not found</Typography>}
    </Dialog>
  );
};

TaskView.propTypes = {
  openTask: PropTypes.bool.isRequired,
  setOpenTask: PropTypes.func.isRequired,
  handleTaskDelete: PropTypes.func
};

export default TaskView;