import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import {confirmEmail, resendConfirmEmail} from "../../actions/auth";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {connect} from "react-redux";
import createSnackAlert from "../../actions/snackAlerts";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import Dialog from "@material-ui/core/Dialog";
import {Redirect, useParams} from 'react-router-dom'
import TextField from "@material-ui/core/TextField";


const ConfirmEmail = ({auth, history, createSnackAlert, confirmEmail, resendConfirmEmail}) => {

    const isAuthenticated = auth.isAuthenticated
    const emailVerificationFailed = auth.emailVerificationFailed
    const isLoading = auth.isLoading
    const isSubmitting = auth.isSubmitting
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('')


    const {key} = useParams()

    useEffect(() => {
        setOpen(true)
    }, [])

    const handleClose = () => {
        setOpen(true)
    }

    const handleClick = () => {
        if (isAuthenticated) {
            createSnackAlert(`Already login as ${auth.user.username}`, 0)
            return history.push('/')
        } else {
            confirmEmail(key, history)
        }
    }

    const handleResendLink = () => {
        if (isAuthenticated) {
            createSnackAlert(`Already login as ${auth.user.username}`, 0)
            return history.push('/')
        } else {
            resendConfirmEmail(email, history)
        }
    }

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    if (isAuthenticated) {
        return <Redirect to="/"/>
    } else {

        return (
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}
                    aria-labelledby="forgot-password-form" TransitionComponent={Zoom}>
                <DialogTitle id="forgot-password-form">{isSubmitting ? "confirming email..." : "Confirm Email"}</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle2">
                        {"Click 'Confirm Email' to confirm the email you registered with"}
                    </Typography>
                    {emailVerificationFailed &&
                    <TextField onChange={handleChange}
                               margin="dense"
                               id="resendEmailConfirmation"
                               placeholder="Email Address"
                               type="email"
                               fullWidth
                               variant="standard"
                               required
                               value={email}
                               helperText="please enter your registered email to get new link."
                    />}
                </DialogContent>
                <DialogActions>
                    {emailVerificationFailed &&
                    <Button onClick={handleResendLink} disabled={isSubmitting || isLoading}>
                        {"Resend Link"}
                    </Button>
                    }
                    <Button onClick={handleClick} disabled={isSubmitting || isLoading}>
                        {"Confirm Email"}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {confirmEmail, resendConfirmEmail, createSnackAlert})(ConfirmEmail);