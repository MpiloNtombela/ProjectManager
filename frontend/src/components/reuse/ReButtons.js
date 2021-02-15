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
  primary: {
    color: theme.palette.primary.main,
    '&:focus': {
      background: theme.palette.background.paper,
      boxShadow: `0 0 4px 1px ${theme.palette.secondary.main}`
    }
  },
  secondary: {
    color: theme.palette.secondary.main,
    '&:focus': {
      boxShadow: `0 0 4px 1px ${theme.palette.secondary.main}`
    }
  },
  error: {
    margin: '.25rem',
    color: theme.palette.error.main,
    boxShadow: `0 0 5px 1px ${theme.palette.error.main}`
  },
  glowHover: {
    background: theme.palette.background.paper,
    boxShadow: `0 0 5px 1px rgba(0, 0, 0, .3)`,
    '&:hover': {
      background: theme.palette.background.paper,
      color: 'inherit',
      boxShadow: '0 0 5px 2px initial'
    },
    '&:focus': {
      background: theme.palette.background.paper
    }
  }
}))
// eslint-disable-next-line react/display-name
const FormSubmitButton = React.memo(({children, disabled, size}) => (
  <Box sx={{my: 2}}>
    <Button color="primary"
            disableElevation
            type="submit"
            fullWidth
            variant="contained"
            disabled={disabled}
            size={size}>
      {children}
    </Button>
  </Box>
));

FormSubmitButton.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  size: PropTypes.string
};

const SaveCancelButtons = ({containerClass, saveButtonType, cancelButtonType, onClickSave, onClickCancel}) => {
  const classes = useStyles()
  return (
    <Box sx={{mt: 1}} className={`${containerClass ? containerClass : classes.flexButtons}`}>
      <Avatar component={ButtonBase}
              type={cancelButtonType}
              onClick={onClickCancel}
              className={`${classes.error} ${classes.glowHover}`}
              aria-label='cancel button'>
        <Close/>
      </Avatar>
      <Avatar component={ButtonBase}
              type={saveButtonType}
              onClick={onClickSave}
              className={`${classes.primary} ${classes.glowHover}`}
              aria-label="save button">
        <Done/>
      </Avatar>
    </Box>
  )
}

SaveCancelButtons.propTypes = {
  containerClass: PropTypes.any,
  saveButtonType: PropTypes.string,
  cancelButtonType: PropTypes.string,
  onClickSave: PropTypes.func,
  onClickCancel: PropTypes.func
};

const GlowButton = ({color, size, type, disabled, fullWidth, disableElevation, onClick, startIcon, endIcon, children}) => {
  const classes = useStyles()
  return (
    <Button size={size}
            color={'secondary'}
            disableElevation={disableElevation}
            type={type}
            fullWidth={fullWidth}
            variant="contained"
            disabled={disabled}
            onClick={onClick}
            startIcon={startIcon}
            endIcon={endIcon}
            className={`${classes[color]} ${classes.glowHover}`}>
      {children}
    </Button>
  )
}

GlowButton.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'error']).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['submit', 'button', 'reset']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disableElevation: PropTypes.bool,
  onClick: PropTypes.func,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  children: PropTypes.any
}

export default React.memo(SaveCancelButtons)
export {FormSubmitButton}
export {GlowButton}