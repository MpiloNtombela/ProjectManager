import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import {MoreVert} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CardContent from "@material-ui/core/CardContent";
import TaskCard from "../tasks/TaskCard";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {addTask, deleteBoard} from "../../../actions/projects";
import {useDispatch} from "react-redux";
import ConfirmDialog from "../../reuse/ReDialogs";
import createSnackAlert from "../../../actions/snackAlerts";

const useStyles = makeStyles((theme) => ({
  cardPadding: {
    padding: '.55rem'
  },

  title: {
    fontWeight: "700",
    fontSize: 'medium'
  },
  menu: {
    "& li": {
      padding: theme.spacing(.75, 2),
      display: "block"
    }
  },
  menuText: {
    fontSize: 'small'
  }
}));

const Board = ({board, idx}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setAnchorEl(null);
    dispatch(deleteBoard(board.id, idx))
  }

  const handleAddNewTask = (taskName) => {
    setAnchorEl(null);
     const name = taskName.trim()
    if (name) {
      dispatch(addTask(name, board.id, idx))
    } else {
      dispatch(createSnackAlert('task name is required', 400))
    }
  }

  const handleDeleteWarning = () => {
    setAnchorEl(null);
    setOpen(true)
  }

  const handleCancel = () => {
    setAnchorEl(null);
    setOpen(false)
  };

  return (
    <>
      <Card>
        <CardHeader classes={{root: classes.cardPadding}}
                    title={<Typography className={classes.title} variant='title'>{board.name}</Typography>}
                    action={
                      <IconButton size="small" aria-label="board controls"
                                  onClick={handleClick}>
                        <MoreVert/>
                      </IconButton>}/>
        <Menu id="navbar-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              elevation={2}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }} classes={{paper: classes.menu}}>
          <MenuItem className={classes.menuText} color={'error'}
                    onClick={handleDeleteWarning}>Delete</MenuItem>
        </Menu>
        <CardContent classes={{root: classes.cardPadding}}>
          {board['board_tasks'] && <TaskCard tasks={board['board_tasks']} handleAddNewTask={handleAddNewTask}/>}
        </CardContent>
      </Card>
      <ConfirmDialog
        message={
          <Typography
            variant={'subtitle1'}
            component={'header'}>
            Delete <strong>{board.name}</strong> <p>* note all tasks in this board will also deleted *</p>
          </Typography>}
        onCancelClick={handleCancel}
        onConfirmClick={handleDelete}
        open={open}/>
    </>
  );
};

Board.propTypes = {
  board: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired
};

export default memo(Board);