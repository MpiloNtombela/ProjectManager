import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TaskDetailsSkeleton from "../../skeleton/projects/TaskDetailsSkeleton";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import DateRange from "@material-ui/icons/DateRange";
import PersonAdd from "@material-ui/icons/PersonAdd";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck";
import {useSelector} from "react-redux";

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
  sendBtn: {
    width: '5%',
    marginTop: '-.50rem',
    display: 'flex',
    alignItems: 'flex-end'
  },
  closeBtn: {
    position: "absolute",
    top: '1rem',
    right: '1rem'
  }
}))

const TaskView = ({openTask, setOpenTask, handleTaskDelete}) => {
  const matches = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const classes = useStyles()
  const task = useSelector(state => state.projectState.tasksState.task)
  const isLoading = useSelector(state => state.projectState.tasksState.isTaskLoading)

  const handleClose = () => {
    setOpenTask(false)
  }

  const handleOnClose = (e) => {
    e.preventDefault()
  }

  return (
    <Dialog fullWidth fullScreen={matches} open={openTask}
      /*TransitionComponent={Zoom} */
            scroll='body'
            classes={{paper: classes.paper}}
            aria-labelledby="tasks-details"
            onClose={handleOnClose}>
      {isLoading ?
        <TaskDetailsSkeleton classes={classes}/>
        : task ?
          <>
            <IconButton
              onClick={handleClose}
              size={'small'}
              className={classes.closeBtn}><Close/></IconButton>
            <DialogTitle classes={{root: classes.dialogContentRoot}} id="task-details">{task.name}</DialogTitle>
            <DialogContent classes={{root: classes.dialogContentRoot}}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={9}>
                  <Typography variant={"h6"} component={'h5'}>Assigned To</Typography>
                  {task["assigned"].length ?
                    <div className={classes.flexAvatar}>
                      {task['assigned'].map(user => (
                        <Avatar
                          key={user.id}
                          src={user.avatar}
                          style={{margin: '.25rem'}}
                          component={ButtonBase}
                          alt={user.username}/>
                      ))}
                    </div>
                    : <Typography color={"textSecondary"} variant={'h6'}>
                      No one has been assigned to this task
                    </Typography>
                  }
                  <Box sx={{my: 3}}>
                    <Typography variant={'h6'} component={'h5'}>Mini tasks</Typography>
                    {task['mini_tasks'].length ?
                      <div>
                        <Box sx={{my: 2}}>
                          {/*<LinearProgress style={{height: '.50rem', borderRadius: '9999rem'}} color="secondary"
                                        variant="determinate"
                                        value={7}/>*/}
                        </Box>
                        {task['mini_tasks'].map(mini => (
                          <div key={mini.id}>
                            <FormControlLabel
                              style={{marginLeft: 0}}
                              control={
                                <Checkbox
                                  // icon={<PanoramaFishEye/>}
                                  // checkedIcon={<CheckCircleOutlined/>}
                                  checked={mini.complete}
                                />
                              }
                              label={<Typography variant='body2' component='span'>{mini.name}</Typography>}
                            />
                          </div>
                        ))}
                      </div>
                      : <Typography
                        color={'textSecondary'}
                        variant={"h6"}>No Mini Tasks created yet</Typography>
                    }
                  </Box>
                  <Divider/>
                  <Box sx={{my: 1}}>
                    <Typography variant='h6' component="h5">Comments</Typography>
                    <Box sx={{my: 2}}>
                      <form style={{display: 'flex'}} onSubmit={e => e.preventDefault()}>
                        <div style={{width: '95%'}}>
                          <TextField
                            variant='standard'
                            color='primary'
                            maxRows={4}
                            multiline
                            fullWidth
                            aria-valuemax={249}
                            placeholder="write comment"
                          />
                        </div>
                        <div className={classes.sendBtn}>
                          <IconButton size={'small'}><Send/></IconButton>
                        </div>
                      </form>
                    </Box>
                    {task['task_comments'].length ?
                      <List className={classes.root}>
                        {task['task_comments'].map(comment => {
                          const {commenter} = comment;
                          return (
                            <Box key={comment.id} sx={{my: 2}}>
                              <ListItem variant='outlined' alignItems="flex-start" component={Card}>
                                <ListItemAvatar>
                                  <Avatar alt={commenter.username} src={commenter.avatar}/>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography color='textPrimary' style={{fontSize: '.87rem', fontWeight: '800'}}>
                                      {commenter.username}
                                    </Typography>}
                                  secondary={comment.comment}
                                />
                              </ListItem>
                            </Box>);
                        })}
                      </List> :
                      <Typography color={'textSecondary'} variant={'h5'} component={'h2'}>
                        No comments yet for this task
                      </Typography>
                    }
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>

                  <Typography variant='h6' component='h2'>Control Panel</Typography>
                  <Box sx={{my: 1}}>
                    <Button
                      size="small"
                      startIcon={<PersonAdd/>}
                      variant='contained'
                      disableElevation
                      fullWidth
                      color='secondary'>
                      new assign</Button>
                  </Box>
                  <Box sx={{my: 1}}>
                    <Button
                      size="small"
                      startIcon={<PlaylistAddCheck/>}
                      variant='contained'
                      disableElevation
                      fullWidth
                      color='secondary'>
                      add mini task
                    </Button>
                  </Box>
                  <Box key={1} sx={{my: 1}}>
                    <Button
                      size="small"
                      startIcon={<DateRange/>}
                      variant='contained'
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
                              <Typography style={{fontSize: '.75rem', fontWeight: '800'}}>
                                {feed.user.username}
                              </Typography>}
                            secondary={
                              <Typography component='p' color="textSecondary" style={{fontSize: '.75rem'}}>
                                {feed["feed"]}
                                <Typography component='span' style={{fontSize: '.55rem', display: 'block'}}>
                                  - 17/10/2000
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
                <Button color='primary' disableElevation variant='text' onClick={handleClose}>close</Button>
                <Button onClick={handleTaskDelete} className='deleteButton' disableElevation variant='text'>Delete
                  Task</Button>
              </Box>
            </DialogContent>
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