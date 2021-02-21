import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import {Close, Done} from "@material-ui/icons";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  flexButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > *': {
      margin: '.25rem'
    },
    '& button': {
      height: '2rem',
      width: '2rem'
    }
  },
  cancelButton: {
    background: 'transparent',
    border: `2px solid ${theme.palette.error.main}`,
    margin: '.25rem',
    color: theme.palette.error.main
  },
  saveButton: {
    background: 'transparent',
    border: `2px solid ${theme.palette.primary.main}`,
    margin: '.25rem',
    color: theme.palette.primary.main
  }
}))
// eslint-disable-next-line react/display-name
const FormSubmitButton = React.memo(({children, disabled, size}) => (
  <Box sx={{my: 2}}>
    <Button
      disableElevation
      type="submit"
      fullWidth
      color="primary"
      variant="contained"
      disabled={disabled}
      size={size}>
      {children}
    </Button>
  </Box>
));

const SaveCancelButtons = ({containerClass, saveButtonType, cancelButtonType, onClickSave, onClickCancel, disabled}) => {
  const classes = useStyles()
  return (
    <Box sx={{mt: 1}} className={`${containerClass ? containerClass : classes.flexButtons}`}>
      <Avatar
        component={ButtonBase}
        type={cancelButtonType}
        onClick={onClickCancel}
        className={classes.cancelButton}
        aria-label='cancel button'
        disabled={disabled}>
        <Close/>
      </Avatar>
      <Avatar
        component={ButtonBase}
        type={saveButtonType}
        onClick={onClickSave}
        className={classes.saveButton}
        aria-label="save button"
        disabled={disabled}>
        <Done/>
      </Avatar>
    </Box>
  )
}
FormSubmitButton.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  size: PropTypes.string
};
SaveCancelButtons.propTypes = {
  containerClass: PropTypes.any,
  saveButtonType: PropTypes.string,
  cancelButtonType: PropTypes.string,
  onClickSave: PropTypes.func,
  onClickCancel: PropTypes.func,
  disabled: PropTypes.bool
};

export default React.memo(SaveCancelButtons)
export {FormSubmitButton}