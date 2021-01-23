import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import produce from 'immer'



const ProjectDetailsForm = ({ projectState, setProjectState }) => {
  const handleChange = (e) => {
    setProjectState(
      produce(projectState, (draft) => {
        draft.project[e.target.name] = e.target.value;
      })
    );
  };
  return (
    <form>
      <TextField
        margin="normal"
        required
        fullWidth
        id="projectName"
        label="Project Name"
        name="name"
        type="text"
        autoFocus
        onChange={handleChange}
        variant="standard"
        size="small"
        value={projectState.project.name}
      />
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Description"
        name="description"
        type="text"
        multiline={true}
        onChange={handleChange}
        variant="standard"
        size="small"
        value={projectState.project.description}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="deadline"
        label="Project Deadline"
        type="datetime-local"
        name="deadline"
        onChange={handleChange}
        variant="standard"
        size="small"
        value={projectState.project.deadline}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
};

ProjectDetailsForm.propTypes = {
  projectState: PropTypes.shape({
    project: PropTypes.shape({
      deadline: PropTypes.string,
      description: PropTypes.string,
      name: PropTypes.string,
    })
  }),
  setProjectState: PropTypes.func
}


export default ProjectDetailsForm;
