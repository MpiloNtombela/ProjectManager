import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import produce from "immer";

const TaskDetailsForm = ({ projectState, setProjectState }) => {
  const handleChange = (e) => {
    setProjectState(
      produce(projectState, (draft) => {
        draft.tasks[e.target.name] = e.target.value;
      })
    );
  };
  return (
    <form>
      <TextField
        margin="normal"
        required
        fullWidth
        id="taskName1"
        label="First Task"
        name="name1"
        type="text"
        autoFocus
        onChange={handleChange}
        variant="standard"
        size="small"
        value={projectState.tasks.name1}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="taskName2"
        label="Second Task"
        name="name2"
        type="text"
        onChange={handleChange}
        variant="standard"
        size="small"
        value={projectState.tasks.name2}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="taskName3"
        label="Third Task"
        name="name3"
        type="text"
        onChange={handleChange}
        variant="standard"
        value={projectState.tasks.name3}
        helperText="you can add more tasks later"
      />
    </form>
  );
};

TaskDetailsForm.propTypes = {
  projectState: PropTypes.shape({
    tasks: PropTypes.shape({
      name1: PropTypes.string,
      name2: PropTypes.string,
      name3: PropTypes.string
    })
  }),
  setProjectState: PropTypes.func
}

export default TaskDetailsForm;
