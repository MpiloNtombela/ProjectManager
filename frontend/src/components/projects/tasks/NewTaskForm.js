import React, {memo, useState} from 'react';
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField";
import {CancelButton, SaveButton} from "../../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch} from "react-redux";
import {addTask} from "../../../actions/projects/tasks";
import createSnackAlert from "../../../actions/snackAlerts";

const useStyles = makeStyles({
  root: {
    padding: '.50rem'
  },
  form: {
    marginTop: '1rem'
  },
  flexButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > *': {
      margin: '.50rem .25rem'
    },
    '& button': {
      height: '2rem',
      width: '2rem'
    }
  }
})

// whyDidYouRender(React, {
//   onlyLogs: true,
//   titleColor: 'green',
//   diffNameColor: 'dodgerblue'
// })
//
// SaveButton.whyDidYouRender = true

const NewTaskForm = ({setIsNewTask, boardId}) => {
  const classes = useStyles();
  const [taskName, setTaskName] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = e => {
    e.preventDefault()
    const name = taskName.trim()
    if (name) {
      dispatch(addTask(name, boardId))
      setTaskName('')
    } else {
      dispatch(createSnackAlert('task name is required', 400))
    }
  }
  const handleCancel = e => {
    e.preventDefault()
    setTaskName('')
    setIsNewTask(false)
  }
  const handleChange = e => {
    setTaskName(e.target.value)
  }
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        fullWidth
        variant='standard'
        placeholder='task name'
        aria-label='name of new task'
        size='small'
        required
        value={taskName}
        autoFocus
        onChange={handleChange}/>
      <div className={classes.flexButtons}>
        <CancelButton type={'button'} onClick={handleCancel}/>
        <SaveButton/>
      </div>
    </form>
  );
};

NewTaskForm.propTypes = {
  setIsNewTask: PropTypes.func.isRequired,
  boardId: PropTypes.string.isRequired
};

export default memo(NewTaskForm);