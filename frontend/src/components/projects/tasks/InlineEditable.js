import React, {useState} from "react";
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {SaveButton} from "../../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Edit from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import {useDispatch} from "react-redux";
import {updateTask} from "../../../actions/projects/tasks";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";

const useStyles = makeStyles({
  form: {
    width: '500px',
    maxWidth: '100%',
    display: 'flex'
  },
  textField: {
    '& input': {
      fontSize: '1.25rem'
    }
  },
  iconSmall: {
    height: '1rem',
    width: '1rem'
  }
})

const InlineForm = ({id, setOpenEdit, field, fieldValue, multi, max}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [value, setValue] = useState(fieldValue)
  const [error, setError] = useState('')

  const handleClose = () => {
    setOpenEdit(false)
  }

  const handleChange = (e) => {
    if (error)
      setError('')
    setValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      setError(`task ${field} is required!`)
    } else {
      if (value.trim() !== fieldValue) {
        const data = {}
        data[field] = value.trim()
        dispatch(updateTask(id, data))
      }
      setOpenEdit(false)
    }
  }
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          aria-label={`add task ${field}`}
          className={classes.textField}
          value={value}
          onChange={handleChange}
          variant={'standard'}
          placeholder={`Add Task ${field}`}
          inputProps={{maxLength: max, "aria-valuemax": max}}
          autoFocus={!multi}
          error={!!error}
          helperText={error}
          multiline={multi}
          maxRows={3}
          fullWidth required/>
        <div><SaveButton/></div>
      </form>
    </ClickAwayListener>
  )
}

export const TaskNameEdit = ({id, name, isRequesting}) => {
  const [openEdit, setOpenEdit] = useState(false)

  const handleOpen = () => {
    if (isRequesting)
      return
    setOpenEdit(true)
  }

  return (
    <>
      {openEdit ?
        <InlineForm id={id}
                    field={'name'}
                    fieldValue={name}
                    setOpenEdit={setOpenEdit}
                    max={100}/>
        : <Typography color={'primary'} onClick={handleOpen} variant={'h5'} component={'p'}>
          {name} <IconButton size={'small'}><Edit/></IconButton>
        </Typography>
      }
    </>
  )
}

export const TaskDescriptionEdit = ({id, isRequesting, description}) => {
  const [openEdit, setOpenEdit] = useState(false)
  const classes = useStyles()
  const handleOpen = () => {
    if (isRequesting)
      return
    setOpenEdit(true)
  }
  return (
    <>
      {openEdit ?
        <InlineForm id={id}
                    field={'description'}
                    fieldValue={description}
                    setOpenEdit={setOpenEdit}
                    max={700}
                    multi/>
        : description ? <Typography color={'textSecondary'} variant={'caption'} component={'p'}>
          {description}
          <IconButton size={'small'} onClick={handleOpen}>
            <Edit classes={{root: classes.iconSmall}}/>
          </IconButton>
        </Typography> : <Button startIcon={<Add/>} onClick={handleOpen}>add description</Button>
      }
    </>)
}

InlineForm.propTypes = {
  id: PropTypes.string.isRequired,
  setOpenEdit: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  fieldValue: PropTypes.string.isRequired,
  max: PropTypes.number,
  multi: PropTypes.bool
}

TaskNameEdit.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequesting: PropTypes.bool
}

TaskDescriptionEdit.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  isRequesting: PropTypes.bool
}