import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";

const ConfirmDialog = ({open, title, message, onConfirmClick, onCancelClick}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancelClick}
      maxWidth="sm"
      fullWidth
      aria-label={message}>
      {title && <DialogTitle id="forgot-password-form">
        {title}
      </DialogTitle>}
      <DialogContent>
        <DialogContentText component={'div'}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={onCancelClick}>
          {"Cancel"}
        </Button>
        <Button color={'primary'} onClick={onConfirmClick}>
          {"Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.node,
  message: PropTypes.node.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired
};

export default ConfirmDialog;