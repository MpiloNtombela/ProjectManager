import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import RePopper from "../../reuse/RePopper";
import { useDispatch } from "react-redux";
import { updateTask } from "../../../actions/projects/tasks";
import MobileDateTimePicker from "@material-ui/lab/MobileDateTimePicker";

const DeadlineForm = ({ setAnchorEl, anchorEl, deadline, taskId, boardId }) => {
  const [value, setValue] = useState(deadline);
  const dispatch = useDispatch();

  const handleAccept = () => {
    const data = { deadline: value };
    dispatch(updateTask({ boardId, taskId, data }));
    setAnchorEl(null);
  };

  return (
    <RePopper setAnchorEl={setAnchorEl} anchorEl={anchorEl}>
      <MobileDateTimePicker
        inputFormat={"dd/MM/yyyy HH:mm"}
        ampm={false}
        disablePast
        renderInput={(props) => (
          <TextField fullWidth value={value} variant={"standard"} {...props} />
        )}
        label="deadline"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        onAccept={handleAccept}
      />
    </RePopper>
  );
};

DeadlineForm.propTypes = {
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.func.isRequired,
  deadline: PropTypes.string,
  boardId: PropTypes.string,
  taskId: PropTypes.string,
};

export default DeadlineForm;
