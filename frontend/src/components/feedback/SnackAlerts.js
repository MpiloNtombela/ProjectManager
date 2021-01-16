import React, {useState, useEffect} from 'react';
import {connect} from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/core/Alert";


const SnackAlerts = ({alerts}) => {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [type, setType] = useState("");

    const handleClose = () => {
        setOpen(false);
        setMsg("");
    };
    useEffect(() => {
        if (alerts.statusCode) {
            setMsg(alerts.alertMsg)
            setType(`${alerts.alertType}`)
            setOpen(true);
        }
    }, [alerts])

    return (
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open}
                  autoHideDuration={7000} onClose={handleClose} >
            <Alert onClose={handleClose} severity={type ? type : "info"} variant="filled" elevation={2}>
                {msg}
            </Alert>
        </Snackbar>
    );
};

const mapStateToProps = state => ({
    alerts: state.alerts,
})

export default connect(mapStateToProps)(SnackAlerts);