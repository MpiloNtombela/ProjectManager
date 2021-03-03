import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import {CancelButton, SaveButton} from "../../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import createSnackAlert from "../../../actions/snackAlerts";
import {createBoard} from "../../../actions/projects/boards";

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

const NewBoardForm = ({setNewBoard}) => {
  const classes = useStyles();
  const [boardName, setBoardName] = useState('')
  const dispatch = useDispatch()
  const {id} = useParams()
  const handleSubmit = e => {
    e.preventDefault()
    const name = boardName.trim()
    if (name) {
      dispatch(createBoard(name, id))
      setNewBoard(false)
    } else {
      dispatch(createSnackAlert('board name is required', 400))
    }
  }
  const handleCancel = () => {
    setBoardName('')
    setNewBoard(false)
  }
  const handleChange = e => {
    setBoardName(e.target.value)
  }
  return (
    <Card classes={{root: classes.root}}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant='standard'
          autoFocus required
          value={boardName} onChange={handleChange}
          placeholder="board name"
          size='small'
          aria-label='name of new board'
          name='boardName'/>
        <div className={classes.flexButtons}>
          <CancelButton type={'button'} onClick={handleCancel}/>
          <SaveButton type={'submit'}/>
        </div>
      </form>
    </Card>
  );
};

NewBoardForm.propTypes = {
  setNewBoard: PropTypes.func.isRequired
};

export default memo(NewBoardForm);