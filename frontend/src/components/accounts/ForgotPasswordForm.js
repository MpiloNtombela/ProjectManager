import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Zoom from "@material-ui/core/Zoom";

const ForgotPasswordForm = ({auth, createSnackAlert, forgotPassword, open, setOpen}) => {
    const isLoading = auth.isLoading;
    const isSubmitting = auth.isSubmitting;

    const [email, setEmail] = useState('')

    const handleChange = e => {
        setEmail(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (auth.isAuthenticated) {
            return createSnackAlert(`Already logged in as ${auth.user.username}`, 0)
        }
        if (email.trim() !== "") {
            forgotPassword(email)
            setEmail("")
        } else {
            return createSnackAlert("Enter valid email address", 400)
        }
    }
    const handleClose = () => {
        setEmail("")
        setOpen(false)
    }
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}
                aria-labelledby="forgot-password-form" TransitionComponent={Zoom}>
            <form onSubmit={handleSubmit}>
                <DialogTitle id="forgot-password-form">{isSubmitting ? "submitting email..." :"Forgot Password"}</DialogTitle>
                <DialogContent>
                    <TextField onChange={handleChange}
                               autoFocus
                               margin="dense"
                               id="forgotPassword"
                               label="Email Address"
                               type="email"
                               fullWidth
                               variant="standard"
                               required
                               value={email}
                               helperText="please enter your registered email."
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={handleClose}>{"close"}</Button>
                    <Button type="submit" disabled={isSubmitting || isLoading}>
                        {"Submit"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ForgotPasswordForm