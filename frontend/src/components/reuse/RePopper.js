import React from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 1300,
    width: '250px',
    maxWidth: '95vw'
  },
  paper: {
    margin: '.25rem .5rem',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    boxShadow: '0 0 5px 3px rgba(0, 0, 0, .25)',
    borderRadius: theme.shape.borderRadius
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
        <div className={classes.paper}>
          {children}
        </div>
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