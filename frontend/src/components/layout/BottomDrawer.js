import makeStyles from "@material-ui/core/styles/makeStyles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Box from "@material-ui/core/Box";
import React from "react";
import PropTypes from "prop-types";
import grey from "@material-ui/core/colors/grey";

const drawerBleeding = 20;

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.spacing(3, 3, 0, 0),
    boxShadow: '0 -.25rem .75rem 0 rgba(0, 0, 0, .3)',
    paddingBottom: theme.spacing(2)
  },
  puller: {
    
    width: 50,
    height: 6,
    backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
    borderRadius: 3,
  },
}));
const BottomDrawer = ({ open, setOpen, children }) => {
  const classes = useStyles();
  const toggleDrawer = (open) => (e) => {
    if (e && e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }

    setOpen(open);
  };
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      swipeAreaWidth={drawerBleeding}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      classes={{ paper: classes.root }}>
      <Box
        sx={{
          py: 2,
          // bgcolor: "background.paper",
          display: "flex",
          justifyContent: "center",
        }}>
        <Box className={classes.puller} />
      </Box>
      {children}
    </SwipeableDrawer>
  );
};

BottomDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default BottomDrawer;
