import React from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 1300,
    width: '250px',
    maxWidth: '95vw',
  },
  paper: {
    margin: '.25rem .5rem',
    padding: theme.spacing(1),
    minHeight: 100
  }
}));

const RePopper = ({anchorEl, setAnchorEl, children}) => {
  const classes = useStyles()
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const open = Boolean(anchorEl);
  
  return (
    <Popper open={open} anchorEl={anchorEl} className={classes.root}>
      <ClickAwayListener onClickAway={handleClose}>
        <Paper className={classes.paper} elevation={4}>
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

RePopper.propTypes = {
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.func.isRequired,
  children: PropTypes.node,
};
export default RePopper;