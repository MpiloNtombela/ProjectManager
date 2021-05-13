import React from "react";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Close, Done } from "@material-ui/icons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  cancelButton: {
    background: "transparent",
    border: `2px solid ${theme.palette.error.main}`,
    margin: ".25rem",
    color: theme.palette.error.main,
  },
  saveButton: {
    background: "transparent",
    border: `2px solid ${theme.palette.primary.main}`,
    margin: ".25rem",
    color: theme.palette.primary.main,
  },
  avatarButton: ({ color }) => ({
    color:
      color && color !== "transparent"
        ? color === "primary" ||
          color === "secondary" ||
          color === "error" ||
          color === "warning"
          ? theme.palette.getContrastText(theme.palette[color].main)
          : theme.palette.getContrastText(color)
        : "inherit",
    background: color
      ? color === "primary" ||
        color === "secondary" ||
        color === "error" ||
        color === "warning"
        ? theme.palette[color].main
        : color
      : "inherit",
  }),
}));
// eslint-disable-next-line react/display-name
export const FormSubmitButton = React.memo(({ children, disabled, size }) => (
  <Box sx={{ my: 2 }}>
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

export const SaveButton = ({ type, onClick, disabled, size, className }) => {
  const classes = useStyles();
  return (
    <IconButton
      type={type ? type : "submit"}
      onClick={onClick}
      className={`${className} ${classes.saveButton}`}
      aria-label="save button"
      disabled={disabled}
      size={size ? size : "small"}>
      <Done />
    </IconButton>
  );
};
export const CancelButton = ({ type, onClick, disabled, size, className }) => {
  const classes = useStyles();
  return (
    <IconButton
      type={type}
      onClick={onClick}
      className={`${className} ${classes.cancelButton}`}
      aria-label="cancel button"
      disabled={disabled}
      size={size ? size : "small"}>
      <Close />
    </IconButton>
  );
};

export const AvatarIconButton = ({ icon, onClick, disabled, color, size, text }) => {
  const classes = useStyles({ color });
  return (
    <Tooltip title={text} placement={"top"}>
      <IconButton onClick={onClick} disabled={disabled} size={size}>
        <Avatar
          component={Paper}
          elevation={4}
          className={classes.avatarButton}>
          {icon}
        </Avatar>
      </IconButton>
    </Tooltip>
  );
};

FormSubmitButton.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  size: PropTypes.string,
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

AvatarIconButton.propTypes = {
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
  text: PropTypes.string,
};
