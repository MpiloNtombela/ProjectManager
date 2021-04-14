import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {Close} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import {deleteSubtask, updateSubtask} from "../../../actions/projects/tasks";
import {useDispatch} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles(theme => ({
    root: {
      margin: '.25rem',
      background: 'transparent'
    },
    iconSmall: {
      height: '1rem',
      width: '1rem'
    },
    itemIcon: {
      minWidth: 0,
      marginRight: '.75rem'
    },
    check: {
      padding: 0
    },
    
    completeProgress: {
      height: '.5rem',
      borderRadius: theme.shape.borderRadius
    }
  })
)
const Subtask = ({subtask}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  
  const handleToggle = () => {
    const data = {complete: !subtask.complete}
    dispatch(updateSubtask(subtask.id, data))
  };
  
  const handleDelete = () => {
    dispatch(deleteSubtask(subtask.id))
  }
  
  return (
    <ListItem
      elevation={0}
      key={subtask.id}
      role={undefined}
      dense
      component={Card}
      className={classes.root}>
      <ListItemIcon className={classes.itemIcon}>
        <Checkbox
          className={classes.check}
          edge="start"
          checked={subtask.complete}
          tabIndex={-1}
          disableRipple
          onChange={handleToggle}
          inputProps={{"aria-labelledby": subtask.id}}
        />
      </ListItemIcon>
      <ListItemText id={subtask.id} primary={subtask.name}/>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="remove subtask" size={'small'} onClick={handleDelete}>
          <Close className={classes.iconSmall}/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}


const Subtasks = ({subtasks}) => {
  const classes = useStyles()
  const [numCompleted, setNumCompleted] = useState(0)
  
  useEffect(() => {
    const len = subtasks.length;
    const complete = subtasks.filter(subtask => subtask.complete).length
    setNumCompleted(Math.round((complete / len) * 100))
  }, [subtasks])
  
  return (
    <List dense>
      <LinearProgress variant={'determinate'} value={numCompleted} className={classes.completeProgress}/>
      {subtasks.map(subtask => <Subtask key={subtask.id} subtask={subtask}/>)}
    </List>
  );
};

Subtask.propTypes = {
  subtask: PropTypes.object.isRequired
}

Subtasks.propTypes = {
  subtasks: PropTypes.array,
};

export default Subtasks;