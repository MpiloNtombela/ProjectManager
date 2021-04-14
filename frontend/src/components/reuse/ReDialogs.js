import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";

const ActionDialog = ({open, title, content, onActionClick, onCancelClick, actionText}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancelClick}
      maxWidth="sm"
      fullWidth>
      {title && <DialogTitle id="dialog-title">
        {title}
      </DialogTitle>}
      <DialogContent>
        <DialogContentText component={'div'}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color={'secondary'} onClick={onCancelClick}>
          {"Cancel"}
        </Button>
        <Button color={'secondary'} onClick={onActionClick}>
          {actionText ? actionText : "ok"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ActionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.node,
  content: PropTypes.node.isRequired,
  actionText: PropTypes.string,
  onActionClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,

};

export default ActionDialog;