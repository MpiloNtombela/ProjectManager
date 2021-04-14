import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import TextField from "@material-ui/core/TextField";
import RePopper from "../../../reuse/RePopper";
import {useDispatch} from "react-redux";
import {updateTask} from "../../../../actions/projects/tasks";
import MobileTimePicker from "@material-ui/lab/MobileTimePicker";
import {MobileDateTimePicker} from "@material-ui/lab";
import {getTimezoneValue} from "../../../../utils";

const DeadlineForm = ({setAnchorEl, anchorEl, deadline, id}) => {
  const [value, setValue] = useState(deadline);
  const dispatch = useDispatch()
  
  const handleAccept = () => {
    const data = {deadline: value}
    dispatch(updateTask(id, data))
    setAnchorEl(null)
  }
  
  return (
    <RePopper setAnchorEl={setAnchorEl} anchorEl={anchorEl}>
      <MobileDateTimePicker
        inputFormat={'dd/MM/yyyy HH:mm'}
        ampm={false}
        disablePast
        renderInput={(props) => <TextField value={value} variant={'standard'} {...props} />}
        label="deadline"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        onAccept={handleAccept}
        showTodayButton={true}
      />
    </RePopper>
  );
}

DeadlineForm.propTypes = {
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.func.isRequired,
  deadline: PropTypes.string,
};

export default DeadlineForm;