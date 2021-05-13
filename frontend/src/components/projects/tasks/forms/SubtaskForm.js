import React, { useState } from "react";
import PropTypes from "prop-types";
import RePopper from "../../../reuse/RePopper";
import TextField from "@material-ui/core/TextField";
import { CancelButton, SaveButton } from "../../../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch } from "react-redux";
import { addSubtask } from "../../../../actions/projects/tasks";
import createSnackAlert from "../../../../actions/snackAlerts";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import PlaylistAddCheck from "@material-ui/icons/PlaylistAddCheck";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  form: {
    width: "500px",
    maxWidth: "100%",
    display: "flex",
  },
});

const SubtaskForm = ({ id }) => {
  const classes = useStyles();
  const [subtaskName, setSubtaskName] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = subtaskName.trim();
    if (name) {
      dispatch(addSubtask(name, id));
      setSubtaskName("");
    } else {
      dispatch(createSnackAlert("subtask name is required", 400));
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    setSubtaskName(e.target.value);
  };
  return (
    <>
      {open ? (
        <ClickAwayListener onClickAway={handleClose}>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              aria-label={"subtask name"}
              className={classes.textField}
              value={subtaskName}
              onChange={handleChange}
              variant={"standard"}
              placeholder={`subtask name`}
              inputProps={{ maxLength: 100, "aria-valuemax": 100 }}
              autoFocus
              fullWidth
              required
            />
            <div>
              <SaveButton />
            </div>
          </form>
        </ClickAwayListener>
      ) : (
        <Button
          size="small"
          startIcon={<PlaylistAddCheck />}
          disableElevation
          disableRipple
          color="primary"
          onClick={handleOpen}>
          add subtask
        </Button>
      )}
    </>
  );
};

SubtaskForm.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SubtaskForm;
