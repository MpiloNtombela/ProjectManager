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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import DateRange from "@material-ui/icons/DateRange";
// import PersonAdd from "@material-ui/icons/PersonAdd";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck";
import {useDispatch, useSelector} from "react-redux";
import TaskComments from "./TaskComments";
import TaskCommentForm from "./TaskCommentForm";
import {addComment} from "../../../actions/projects/tasks";
import createSnackAlert from "../../../actions/snackAlerts";
import AddMembers from "./AddMembers";
import LinearProgress from "@material-ui/core/LinearProgress";
import PersonAdd from "@material-ui/icons/PersonAdd";
// import {useImmer} from "use-immer";
import TasksMembers from "./TaskMembers";
import {TaskDescriptionEdit, TaskNameEdit} from "./InlineEditable";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {Close} from "@material-ui/icons";

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

  feedList: {
    margin: 0
  },
  subHeader: {
    fontSize: 'medium'
  },
  main: {
    padding: '1.5rem .75rem'
  },
  sideBar: {
    background: theme.palette.background.default,
    padding: '1.5rem .75rem'
  },
  closeBtn: {
    position: 'absolute',
    right: '.75rem',
    top: '.25rem'
  }
}))

// TODO:  commit and add ability to add subtasks


const TaskView = ({openTask, setOpenTask, handleTaskDelete}) => {
  const smMatches = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const classes = useStyles()
  const {isTaskLoading, task, isRequesting} = useSelector(state => state.tasksState)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setOpenTask(false)
  }

  const handleOnClose = (e) => {
    e.preventDefault()
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
    <Dialog fullWidth fullScreen={smMatches} open={openTask}
            scroll='body'
            classes={{paper: classes.paper}}
            aria-labelledby="tasks-details"
            onClose={handleOnClose}>
      {isTaskLoading ? <TaskViewSkeleton/>
        : task ?
          <>
            {isRequesting && <LinearProgress variant={'indeterminate'} color={'secondary'}/>}
            <IconButton onClick={handleClose} className={classes.closeBtn} size={'small'}><Close/></IconButton>
            <DialogContent classes={{root: classes.dialogContentRoot}}>
              <Grid container className={classes.root}>
                <Grid item xs={12} sm={8} className={classes.main}>
                  <TaskNameEdit id={task.id} name={task.name} isRequesting={isRequesting}/>
                  <Box sx={{mt: 1, mb: 2}}>
                    <TaskDescriptionEdit id={task.id} description={task.description} isRequesting={isRequesting}/>
                  </Box>
                  <Typography className={classes.subHeader} component={'h5'}>Subtasks</Typography>
                  {task['subtasks'].length ?
                    <div>
                      <Box sx={{my: 2}}>
                        {/*<LinearProgress style={{height: '.50rem', borderRadius: '9999rem'}} color="secondary"
                                        variant="determinate"
                                        value={7}/>*/}
                      </Box>
                      {task['subtasks'].map(subtask => (
                        <div key={subtask.id}>
                          <FormControlLabel
                            style={{marginLeft: 0}}
                            control={
                              <Checkbox
                                checked={subtask.complete}
                              />
                            }
                            label={<Typography variant='body2' component='span'>{subtask.name}</Typography>}
                          />
                        </div>
                      ))}
                    </div>
                    : <Typography
                      color={'textSecondary'}
                      variant={"subtitle1"}>No subtasks created yet</Typography>
                  }
                  <Divider/>
                  <Box sx={{my: 1}}>
                    <Typography className={classes.subHeader} component="h5">Comments</Typography>
                    <Box sx={{my: 2}}>
                      <TaskCommentForm handleAddComment={handleAddComment}/>
                    </Box>
                    {task['task_comments'].length ?
                      <TaskComments comments={task['task_comments']}/>
                      : <Typography color={'textSecondary'} variant={'subtitle1'} component={'h2'}>
                        Ooh so empty, there is literally nothing here...
                      </Typography>
                    }
                  </Box>
                </Grid>
                {/*---------------------- aside ----------------------*/}
                <Grid item xs={12} sm={4} className={classes.sideBar}>
                  <Typography className={classes.subHeader} component='h2'>Control Panel</Typography>
                  <Box sx={{my: 1}}>
                    <Button
                      size="small"
                      startIcon={<PersonAdd/>}
                      variant='outlined'
                      disableElevation
                      fullWidth
                      color='secondary'
                      onClick={handleClick}>
                      add members</Button>
                  </Box>
                  <Box sx={{my: 1}}>
                    <Button
                      size="small"
                      startIcon={<PlaylistAddCheck/>}
                      variant='outlined'
                      disableElevation
                      fullWidth
                      color='secondary'>
                      add subtask
                    </Button>
                  </Box>
                  <Box key={1} sx={{my: 1}}>
                    <Button
                      size="small"
                      startIcon={<DateRange/>}
                      variant='outlined'
                      disableElevation
                      fullWidth
                      color='secondary'>
                      add Deadline</Button>
                  </Box>
                  <Box sx={{my: 2}}>
                    <Typography className={classes.subHeader} component='h2'>Members</Typography>
                    <TasksMembers id={task.id} members={task.members} isRequesting={isRequesting}/>
                  </Box>
                  <Typography className={classes.subHeader} component='h2'>Task Feed</Typography>
                  {task['task_feed'].length ?
                    <List>
                      {task['task_feed'].map(feed => (
                        <Tooltip placement={"bottom"} key={feed.id} title={feed.timestamp}>
                          <div>
                            <ListItemText className={classes.feedList}
                                          primary={
                                            <Typography color={'textSecondary'} variant={'caption'}>
                                              {feed.user.username}
                                            </Typography>
                                          }
                                          secondary={
                                            <Typography component='h6' color="textPrimary" variant={"body2"}>
                                              {feed["feed"]}
                                            </Typography>
                                          }/>
                            <Divider/>
                          </div>
                        </Tooltip>
                      ))}
                    </List>
                    : <Typography color={'textSecondary'} component={'small'} variant={"caption"}>
                      Changes made to this task will appear here
                    </Typography>}
                </Grid>
              </Grid>
              <Divider/>
              <Box sx={{my: 2}} className={classes.actionButton}>
                <Button color='primary'
                        disableElevation
                        variant='text'
                        onClick={handleClose}
                        disabled={isRequesting}>close
                </Button>
                <Button onClick={handleTaskDelete}
                        className='deleteButton'
                        disableElevation
                        variant='text'
                        disabled={isRequesting}>Delete Task
                </Button>
              </Box>
            </DialogContent>
            <AddMembers anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>
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