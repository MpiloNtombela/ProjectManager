import React from 'react';
import PropTypes from 'prop-types';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Close from "@material-ui/icons/Close";
import Delete from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  appBar: {
    background: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.paper)
  },
  grow: {
    flexGrow: 1
  },
  toolbarRoot: {
    padding : '0 .75rem',
    minHeight: '2.5rem',
    maxHeight: '2.5rem'
  },
  avatar: {
    height: '1.5rem',
    width: '1.5rem',
    marginRight: '.5rem'
  },
  actionIcons: {
    margin: '0 .75rem'
  }
}))

const TaskViewBar = ({avatar, handleClose, handleDelete}) => {
  const classes = useStyles()
  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar variant={'dense'} className={classes.toolbarRoot}>
        <Avatar alt={'alt'} src={avatar} className={classes.avatar}/>
        <Typography component={'h5'} variant="subtitle1" noWrap>
          TaskView
        </Typography>
        <div className={classes.grow}/>
        <div>
          <IconButton className={classes.actionIcons} onClick={handleDelete} aria-label="delete task" size={'small'}>
              <Delete/>
          </IconButton>
          <IconButton aria-label={'close'} edge="end" onClick={handleClose} size={'small'}>
            <Close/>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

TaskViewBar.propTypes = {
  avatar: PropTypes.string,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default TaskViewBar;