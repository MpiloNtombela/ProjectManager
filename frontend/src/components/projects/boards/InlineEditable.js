import React, {useState} from "react";
import PropTypes from 'prop-types'
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {SaveButton} from "../../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch} from "react-redux";
import {updateBoard} from "../../../actions/projects/boards";

const useStyles = makeStyles({
  form: {
    width: '100%',
    display: 'flex'
  },
  textField: {
    '& input': {
      fontSize: '1.25rem'
    }
  },
  title: {
    fontSize: 'medium',
    fontWeight: 'bold'
  },
  iconSmall: {
    height: '1rem',
    width: '1rem'
  },
  saveBtn: {
    height: '1.7rem',
    width: '1.7rem'
  }
})

const InlineForm = ({id, setOpenEdit, field, fieldValue, multi, max, className, btnSize, btnClass}) => {
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
      setError(`board ${field} is required!`)
    } else {
      const data = {}
      data[field] = value
      if (value !== name)
        dispatch(updateBoard(id, data))
      setOpenEdit(false)
    }
  }
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          aria-label={`add board ${field}`}
          className={className}
          value={value}
          onChange={handleChange}
          variant={'standard'}
          placeholder={`Add board ${field}`}
          inputProps={{maxLength: max, "aria-valuemax": max}}
          autoFocus={!multi}
          error={!!error}
          helperText={error}
          multiline={multi}
          maxRows={3}
          fullWidth required/>
        <SaveButton size={btnSize} className={btnClass}/>
      </form>
    </ClickAwayListener>
  )
}

export const BoardNameEdit = ({id, name, openEdit, setOpenEdit}) => {
  const classes = useStyles()
  return (
    <>
      {openEdit ?
        <InlineForm id={id}
                    field={'name'}
                    fieldValue={name}
                    setOpenEdit={setOpenEdit}
                    max={100}
                    className={classes.title}
                    btnSize={'small'}
                    btnClass={classes.saveBtn}/>
        : <Typography className={classes.title} variant={'title'}>{name}</Typography>
      }
    </>
  )
}

InlineForm.propTypes = {
  id: PropTypes.string.isRequired,
  setOpenEdit: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  fieldValue: PropTypes.string.isRequired,
  max: PropTypes.number,
  multi: PropTypes.bool,
  className: PropTypes.any,
  btnSize: PropTypes.string,
  btnClass: PropTypes.string
}

BoardNameEdit.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  openEdit: PropTypes.bool,
  setOpenEdit: PropTypes.func
}