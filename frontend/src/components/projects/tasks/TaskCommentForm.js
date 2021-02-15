import React, {useState} from 'react';
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Send from "@material-ui/icons/Send";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";

const useStyles = makeStyles({
  sendBtn: {
    width: '5%',
    marginTop: '-.50rem',
    display: 'flex',
    alignItems: 'flex-end'
  },
  form: {
    display: 'flex'
  }
})

const TaskCommentForm = ({handleAddComment}) => {
  const classes = useStyles()
  const [comment, setComment] = useState('')
  const isCommenting = useSelector(state => state.projectState.tasksState.isRequesting)
  const handleChange = (e) => {
    setComment(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddComment(comment)
    setComment('')
  }
  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div style={{width: '95%'}}>
          <TextField
            disabled={isCommenting}
            variant='standard'
            color='primary'
            maxRows={4}
            multiline
            fullWidth
            aria-valuemax={249}
            placeholder="write comment"
            onChange={handleChange}
            value={comment}
            required
          />
        </div>
        <div className={classes.sendBtn}>
          <IconButton disabled={isCommenting} type={'submit'} size={'small'}><Send/></IconButton>
        </div>
      </form>
    </>
  );
};

TaskCommentForm.propTypes = {
  handleAddComment: PropTypes.func.isRequired
}

export default TaskCommentForm;