import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  barLoader: {
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "50px",
    width: "50px",
    margin: "-25px 0 0 -25px",
    transform: 'translate(-50%, -50%)',
    "& span": {
      position: "absolute",
      display: "block",
      bottom: "10px",
      width: "9px",
      height: "5px",
      background: `${theme.palette.secondary.light}`,
      WebkitAnimation: "$barLoader 1.5s  infinite ease-in-out",
      animation: "$barLoader 1.5s  infinite ease-in-out",
      "&:nth-child(1)": {
        left: "11px",
        WebkitAnimationDelay: "0.2s",
        animationDelay: "0.2s",
      },
      "&:nth-child(2)": {
        left: "22px",
        WebkitAnimationDelay: "0.4s",
        animationDelay: "0.4s",
      },
      "&:nth-child(3)": {
        left: "33px",
        WebkitAnimationDelay: "0.6s",
        animationDelay: "0.6s",
      },
      "&:nth-child(4)": {
        left: "44px",
        WebkitAnimationDelay: "0.8s",
        animationDelay: "0.8s",
      },
      "&:nth-child(5)": {
        left: "55px",
        WebkitAnimationDelay: "1s",
        animationDelay: "1s",
      },
    },
  },
  "@keyframes barLoader": {
    "0%": {
      height: "5px",
      WebkitTransform: "translateY(0px)",
      transform: "translateY(0px)",
      background: `${theme.palette.secondary.light}`,
    },
    "25%": {
      height: "30px",
      WebkitTransform: "translateY(15px)",
      transform: "translateY(15px)",
      background: `${theme.palette.secondary.main}`,
    },
    "50%": {
      height: "5px",
      WebkitTransform: "translateY(0px)",
      transform: "translateY(0px)",
      background: `${theme.palette.secondary.light}`,
    },
    "100%": {
      height: "5px",
      WebkitTransform: "translateY(0px)",
      transform: "translateY(0px)",
      background: `${theme.palette.secondary.light}`,
    },
  },
}));

function BarLoader() {
  const classes = useStyles();
  return (
    <div className={classes.barLoader}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

export default BarLoader;
