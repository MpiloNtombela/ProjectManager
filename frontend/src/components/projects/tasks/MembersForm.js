import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch, useSelector} from "react-redux";
import addableTaskMembers from "../../../selectors/addableTaskMembers";
import {addRemoveMember} from "../../../actions/projects/tasks";

const useStyles = makeStyles({
  paper: {
    padding: '.25rem 0'
  },
  container: {
    width: 220,
    maxWidth: '95vw'
  },
  listbox: {
    fontSize: 'small'
    // scrollbarWidth: 'thin',
    // // '&::-webkit-scrollbar': {
    // //   width: '.25rem'
    // // }
  },
  searchArea: {
    '& input': {
      fontSize: 'small'
    }
  }
})

const MembersForm = () => {
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
        {...params}/>
    )
  }
  useEffect(() => {
    if (value) {
      if (value.id) {
        dispatch(addRemoveMember(task.id, value.id, 'add'))
        setValue(null)
      }
    }
  }, [value])

  return (
    <div className={classes.container}>
      <Autocomplete
        value={value}
        onChange={handleChange}
        disablePortal
        id="combo-box-demo"
        options={members}
        getOptionLabel={members => members.username}
        size={'small'}
        renderInput={handleRender}
        disabled={isRequesting}
        classes={{paper: classes.paper, listbox: classes.listbox}}
      />
    </div>
  );
};
export default MembersForm