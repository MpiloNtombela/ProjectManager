import React, {memo, useState} from 'react';
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField";
import SaveCancelButtons from "../../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  root: {
    padding: '.50rem'
  },
  form: {
    marginTop: '1rem'
  }
})
const NewTaskForm = ({setIsNewTask, handleAddNewTask}) => {
  const classes = useStyles();
  const [taskName, setTaskName] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    handleAddNewTask(taskName)
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
      <SaveCancelButtons
        cancelButtonType='button'
        onClickCancel={handleCancel}/>
    </form>
  );
};

NewTaskForm.propTypes = {
  setIsNewTask: PropTypes.func.isRequired,
  handleAddNewTask: PropTypes.func.isRequired
};

export default memo(NewTaskForm);