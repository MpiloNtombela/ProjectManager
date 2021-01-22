import React from "react";
import TextField from "@material-ui/core/TextField";
import produce from "immer";

const ProjectSetupForm = ({ project, setProject }) => {
  const handleChange = (e) => {
    setProject((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <form>
      <TextField
        margin="normal"
        required
        fullWidth
        id="projectName"
        label="Project Name"
        name="projectName"
        type="text"
        autoFocus
        onChange={handleChange}
        variant="standard"
        size="small"
        value={project.projectName}
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
        value={project.description}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="deadline"
        label="Project Deadline"
        name="deadline"
        type="datetime"
        onChange={handleChange}
        variant="standard"
        size="small"
      />
    </form>
  );
};

export default ProjectSetupForm;
