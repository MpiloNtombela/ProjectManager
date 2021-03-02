import React from 'react';
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Popper from '@material-ui/core/Popper';
import MembersForm from "./MembersForm";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 10001
  },
  paper: {
    margin: '.25rem .5rem',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    boxShadow: '0 0 5px 3px rgba(0, 0, 0, .25)',
    borderRadius: theme.shape.borderRadius
  }
}));

const AddMember = ({anchorEl, setAnchorEl}) => {
  const classes = useStyles();

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl);
  const id = open ? 'add-member-form' : undefined;

  return (
    <Popper id={id} open={open} anchorEl={anchorEl} className={classes.root}>
      <ClickAwayListener onClickAway={handleClose}>
        <div className={classes.paper}>
          <MembersForm/>
        </div>
      </ClickAwayListener>
    </Popper>
  );
};
AddMember.propTypes = {
  anchorEl: PropTypes.object,
  setAnchorEl: PropTypes.func.isRequired
}
export default AddMember