import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {Close, Done} from "@material-ui/icons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
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

const SaveButton = ({type, onClick, disabled, size, className}) => {
  const classes = useStyles()
  return (
    <IconButton
      // component={ButtonBase}
      type={type}
      onClick={onClick}
      className={`${className} ${classes.saveButton}`}
      aria-label="save button"
      disabled={disabled}
      size={size ? size : 'small'}>
      <Done/>
    </IconButton>
  )
}
const CancelButton = ({type, onClick, disabled, size, className}) => {
  const classes = useStyles()
  return (
    <IconButton
      type={type}
      onClick={onClick}
      className={`${className} ${classes.cancelButton}`}
      aria-label='cancel button'
      disabled={disabled}
      size={size ? size : 'small'}>
      <Close/>
    </IconButton>
  )
}
FormSubmitButton.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  size: PropTypes.string
};
SaveButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
};

CancelButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
};

export {FormSubmitButton, SaveButton, CancelButton}