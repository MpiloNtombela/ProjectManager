import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TaskViewSkeleton from "../../skeletons/projects/TaskViewSkeleton";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
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
import Chip from "@material-ui/core/Chip";
import {Add} from "@material-ui/icons";
import TasksMembers from "./TasksMembers";

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: '820px'
  },

  dialogContentRoot: {
    padding: theme.spacing(2)
  },

  flexAvatar: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: '.25rem'
    }
  },
  actionButton: {
    display: 'flex',
    justifyContent: 'flex-end',

    '& .deleteButton': {
      color: theme.palette.error.main,
      fontWeight: '600'
    }
  },
  closeBtn: {
    position: "absolute",
    top: '1rem',
    right: '.7rem'
  }
}))


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
      dispatch(createSnackAlert('write some comment first', 400))
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
            {isRequesting && <LinearProgress variant={'indeterminate'}/>}
            <IconButton
              onClick={handleClose}
              size={'small'}
              className={classes.closeBtn}
              disabled={isRequesting}>
              <Close/>
            </IconButton>
            <DialogTitle classes={{root: classes.dialogContentRoot}} id="task-details">{task.name}</DialogTitle>
            <DialogContent classes={{root: classes.dialogContentRoot}}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography variant={"h6"} component={'h5'}>Task Members</Typography>
                  <div className={classes.flexAvatar}>
                    <TasksMembers id={task.id} members={task.members} isRequesting={isRequesting}/>
                    <Chip avatar={<Avatar color={'secondary'}><Add/></Avatar>}
                          label={'add member'}
                          variant={"outlined"}
                          onClick={handleClick}
                          color={'secondary'}/>
                  </div>
                  <Box sx={{my: 3}}>
                    <Typography variant={'h6'} component={'h5'}>subtask tasks</Typography>
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
                                  // icon={<PanoramaFishEye/>}
                                  // checkedIcon={<CheckCircleOutlined/>}
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
                  </Box>
                  <Divider/>
                  <Box sx={{my: 1}}>
                    <Typography variant='h6' component="h5">Comments</Typography>
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
                <Grid item xs={12} sm={4}>
                  <Typography variant='h6' component='h2'>Control Panel</Typography>
                  <Box sx={{my: 1}}>
                    <Button
                      size="small"
                      startIcon={<PersonAdd/>}
                      variant='outlined'
                      disableElevation
                      fullWidth
                      color='secondary'>
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
                  <Box sx={{mb: 3}}/>
                  <Typography variant='h6' component='h2'>Task Feed</Typography>
                  <Divider/>
                  {task['task_feed'].length ?
                    <List>
                      {task['task_feed'].map(feed => (
                        <div key={feed.id}>
                          <ListItemText
                            primary={
                              <Typography color={'textSecondary'} variant={'caption'}>
                                {feed.user.username}
                              </Typography>}
                            secondary={
                              <Typography component='h6' color="textPrimary" variant={"body2"}>
                                {feed["feed"]}
                                <Typography component='p' variant={'caption'} color={'textSecondary'}>
                                  {feed.timestamp}
                                </Typography>
                              </Typography>}
                          />
                          <Divider/>
                        </div>
                      ))}
                    </List>
                    : <Typography color={'textSecondary'} component={'h2'} variant={"subtitle1"}>
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