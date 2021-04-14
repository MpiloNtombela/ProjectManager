import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/core/Alert";
import {CLEAR_ALERTS} from "../../actions/types";

const SnackAlerts = () => {
  const dispatch = useDispatch ()
  const {alertType, alertMsg} = useSelector(state => state.alerts)

  const handleClose = () => {
    dispatch({type: CLEAR_ALERTS})
  };
  
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={Boolean(alertMsg && alertType)}
      autoHideDuration={7000}
      onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={alertType ? alertType : "info"}
        variant="filled"
        elevation={2}>
        {alertMsg}
      </Alert>
    </Snackbar>
  );
};

export default SnackAlerts;
