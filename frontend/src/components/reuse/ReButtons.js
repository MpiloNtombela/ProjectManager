import React, {memo} from "react";
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
  ButtonContainer: {
    '& .cancelButton': {
      background: theme.palette.error.main,
      margin: '.25rem',
      color: 'inherit'
    },
    '& .saveButton': {
      background: theme.palette.primary.main,
      margin: '.25rem',
      color: 'inherit'
    }
  }
}))
// eslint-disable-next-line react/display-name
const FormSubmitButton = memo(({children, disabled, size}) => (
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

const SaveCancelButtons = ({containerClass, saveButtonType, cancelButtonType, onClickSave, onClickCancel}) => {
  const classes = useStyles()
  return (
    <Box sx={{mt: 1}} className={`${containerClass ? containerClass : classes.flexButtons} ${classes.ButtonContainer}`}>
      <Avatar
        component={ButtonBase}
        type={cancelButtonType}
        onClick={onClickCancel}
        className={'cancelButton'}
        aria-label='cancel button'>
        <Close/>
      </Avatar>
      <Avatar
        component={ButtonBase}
        type={saveButtonType}
        onClick={onClickSave}
        className={'saveButton'}
        aria-label="save button">
        <Done/>
      </Avatar>
    </Box>
  )
}
FormSubmitButton.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  size: PropTypes.string,
};
SaveCancelButtons.propTypes = {
  containerClass: PropTypes.any,
  saveButtonType: PropTypes.string,
  cancelButtonType: PropTypes.string,
  onClickSave: PropTypes.func,
  onClickCancel: PropTypes.func
};

export default memo(SaveCancelButtons)
export {FormSubmitButton}