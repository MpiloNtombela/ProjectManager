import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/core/Alert";
import {CLEAR_ALERTS} from "../../actions/types";

const SnackAlerts = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");
  const dispatch = useDispatch ()
  const alerts = useSelector(state => state.alerts)

  const handleClose = () => {
    setOpen(false);
    setMsg("");
    dispatch({type: CLEAR_ALERTS})
  };
  useEffect(() => {
    if (alerts.statusCode) {
      setMsg(alerts.alertMsg);
      setType(`${alerts.alertType}`);
      setOpen(true);
    }
  }, [alerts]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={7000}
      onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={type ? type : "info"}
        variant="filled"
        elevation={2}>
        {msg}
      </Alert>
    </Snackbar>
  );
};

SnackAlerts.propTypes = {
  alerts: PropTypes.shape({
    alertMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    alertType: PropTypes.string,
    statusCode: PropTypes.number,
  }),
};

export default SnackAlerts;
