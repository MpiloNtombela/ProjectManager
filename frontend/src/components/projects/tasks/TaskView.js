import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TaskViewSkeleton from "../../skeletons/projects/TaskViewSkeleton";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
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
import {Add, ExpandMore} from "@material-ui/icons";
import TasksMembers from "./TaskMembers";
import {TaskDescriptionEdit, TaskNameEdit} from "./InlineEditable";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: '820px'
  },

  dialogContentRoot: {
    padding: theme.spacing(2, 2, 0, 2)
  },
  appBar: {
    background: theme.palette.glass.dark
  },
  appBarTitle: {
    flexGrow: 1
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
  addMemberIcon: {
    '& .add-icon': {
      background: 'transparent',
      border: `2px solid ${theme.palette.secondary.main}`,
      color: theme.palette.secondary.main
    }
  },
  description: {
    padding: '0',
    margin: '.75rem 0',
    borderBottom: '.075rem solid rgba(0, 0, 0, .3)',
  },
  descriptionSummary: {
    padding: 0,
    margin: 0,
    minHeight: '2rem'
  },
  feedList: {
    margin: 0
  },
  subHeader: {
    fontSize: 'medium'
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
            <AppBar position="sticky" elevation={0} color={'primary'} className={smMatches ? '' : classes.appBar}>
              <Toolbar variant="dense">
                <Typography variant="h6" className={classes.appBarTitle}>
                  Task View
                </Typography>
                <IconButton
                  onClick={handleClose}
                  size={'small'}
                  disabled={isRequesting}>
                  <Close/>
                </IconButton>
              </Toolbar>
              {isRequesting && <LinearProgress variant={'indeterminate'} color={'secondary'}/>}
            </AppBar>
            <DialogContent classes={{root: classes.dialogContentRoot}}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TaskNameEdit id={task.id} name={task.name} isRequesting={isRequesting}/>
                  <Accordion elevation={0} className={classes.description}>
                    <AccordionSummary
                      className={classes.descriptionSummary}
                      classes={{content: classes.descriptionSummary}}
                      expandIcon={<ExpandMore/>}
                      aria-controls="task-description"
                      id="task-description">
                      <Typography className={classes.subHeader} component={'h5'}>Description</Typography>
                    </AccordionSummary>
                    <AccordionDetails color={'textSecondary'}>
                      <TaskDescriptionEdit id={task.id} description={task.description} isRequesting={isRequesting}/>
                    </AccordionDetails>
                  </Accordion>
                  <Typography className={classes.subHeader} component={'h5'}>Task Members</Typography>
                  <div className={classes.flexAvatar}>
                    <TasksMembers id={task.id} members={task.members} isRequesting={isRequesting}/>
                    <Chip avatar={<Avatar className={'add-icon'}><Add/></Avatar>}
                          className={classes.addMemberIcon}
                          label={'add member'}
                          variant={"outlined"}
                          onClick={handleClick}
                          color={'secondary'}/>
                  </div>
                  <Box sx={{my: 3}}>
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
                <Grid item xs={12} sm={4}>
                  <Typography className={classes.subHeader} component='h2'>Control Panel</Typography>
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
                  <Typography className={classes.subHeader} component='h2'>Task Feed</Typography>
                  <Divider/>
                  {task['task_feed'].length ?
                    <List>
                      {task['task_feed'].map(feed => (
                        <Tooltip placement={'top'} key={feed.id} title={feed.timestamp} arrow>
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