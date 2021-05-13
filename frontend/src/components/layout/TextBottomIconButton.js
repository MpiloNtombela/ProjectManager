import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.grey[700],
    width: "100%",
    background: "transparent",
    border: 0,
    "&:hover": {
      cursor: "pointer",
    },
  },
  text: ({ textSize }) => ({
    color: "inherit",
    fontSize:
      textSize == "small" ? ".65rem" : textSize == "large" ? "1rem" : ".75rem",
  }),
}));

const TextBottomIconButton = ({ icon, text, textSize, onClick }) => {
  const classes = useStyles({ textSize });
  return (
    <button className={classes.container} onClick={onClick}>
      {icon}
      <span className={classes.text}>{text}</span>
    </button>
  );
};

TextBottomIconButton.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  textSize: PropTypes.oneOf(["small", "medium", "large"]),
  onClick: PropTypes.func,
};

export default TextBottomIconButton;
