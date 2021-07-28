import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch, useSelector} from "react-redux";
import addableTaskMembers from "../../../selectors/addableTaskMembers";
import {addRemoveMember} from "../../../actions/projects/tasks";
import Avatar from "@material-ui/core/Avatar";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";


const useStyles = makeStyles({
  paper: {
    padding: '.25rem 0'
  },
  container: {
    width: 220,
    maxWidth: '95vw'
  },
  listbox: {
    fontSize: 'small',
    padding: 0
  },
  searchArea: {
    '& input': {
      fontSize: 'small'
    }
  },
  avatar: {
    width: '1.25rem',
    height: '1.25rem',
    fontSize: 'small',
    marginRight: '.25rem'
  },
  options: {
    padding: '.25rem .5rem'
  }
})


const MembersForm = ({open, onClose}) => {
  const classes = useStyles()
  const members = useSelector(state => addableTaskMembers(state))
  const {task, isRequesting} = useSelector(state => state.tasksState)
  const dispatch = useDispatch()
  const [value, setValue] = useState(null)
  
  const handleChange = (e, newValue) => {
    setValue(newValue)
  }
  
  const handleRender = (params) => {
    return (
      <TextField
        label="select member"
        size={'small'}
        variant={'standard'}
        className={classes.searchArea}
        helperText={`choose from project members`}
        {...params}/>
    )
  }
  useEffect(() => {
    if (value && value.id) {
      dispatch(addRemoveMember(task.board.id, task.id, value.id, 'add'))
      setValue(null)
    }
  }, [value])
  
  return (
    <>
      {open ?
        <ClickAwayListener onClickAway={onClose}>
          <div>
            <Autocomplete
              value={value}
              onChange={handleChange}
              disablePortal
              id="task-members"
              options={members}
              open
              getOptionLabel={members => members.username}
              renderOption={(props, member) => (
                <li {...props} style={{padding: '.25rem .5rem'}}>
                  <Avatar className={classes.avatar} alt={member.username} src={member.avatar}/>
                  {member.username}
                </li>
              )}
              size={'small'}
              renderInput={handleRender}
              disabled={isRequesting}
              classes={{paper: classes.paper, listbox: classes.listbox}}
            />
          </div>
        </ClickAwayListener> :""}
    </>
  );
};

MembersForm.propTypes = {
  open : PropTypes.bool.isRequired,
  onClose: PropTypes.func
}
export default MembersForm