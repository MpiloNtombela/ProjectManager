import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import produce from "immer";

const BoardsDetailsForm = ({ projectState, setProjectState }) => {
  const handleChange = (e) => {
    setProjectState(
      produce(projectState, (draft) => {
        draft.boards[e.target.name] = e.target.value;
      })
    );
  };
  return (
    <form>
      <TextField
        margin="normal"
        required
        fullWidth
        id="boardName1"
        label="First Board"
        name="name1"
        type="text"
        autoFocus
        onChange={handleChange}
        variant="standard"
        size="small"
        value={projectState.boards.name1}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="boardName2"
        label="Second Board"
        name="name2"
        type="text"
        onChange={handleChange}
        variant="standard"
        size="small"
        value={projectState.boards.name2}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="boardName3"
        label="Third Board"
        name="name3"
        type="text"
        onChange={handleChange}
        variant="standard"
        value={projectState.boards.name3}
        helperText="you can create more boards later"
      />
    </form>
  );
};

BoardsDetailsForm.propTypes = {
  projectState: PropTypes.shape({
    boards: PropTypes.shape({
      name1: PropTypes.any,
      name2: PropTypes.any,
      name3: PropTypes.any
    })
  }),
  setProjectState: PropTypes.func
}

export default BoardsDetailsForm;
