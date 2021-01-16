import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {connect} from "react-redux";
import {useComponentStyles} from "../styles/componentStyles";
import createSnackAlert from "../../actions/snackAlerts";
import {passwordChange} from "../../actions/auth";
import CssBaseline from "@material-ui/core/CssBaseline";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {useHistory} from 'react-router-dom'
import {FormSubmitButton} from "../reuse/ReButtons";
import {validatePasswords} from "../../validators/validators";
import useCommonStyles from "../styles/commonStyles";

const PasswordChange = ({auth, createSnackAlert, passwordChange}) => {
    const isLoading = auth.isLoading;
    const isSubmitting = auth.isSubmitting;
    const classes = useComponentStyles();
    const cls = useCommonStyles()
    const history = useHistory()

    const [passwords, setPasswords] = useState({
        old_password : "",
        new_password1: "",
        new_password2: "",
    })
    const handleChange = e => {
        setPasswords(prevState => ({
            ...prevState, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        const {old_password, new_password1, new_password2} = passwords
        const {valid, message} = validatePasswords(new_password1, new_password2)

        if (!valid) {
            return createSnackAlert(message, 400)
        } else {
            const credentials = {
                old_password,
                new_password1,
                new_password2,
            }
            passwordChange(credentials, history)
        }
    }
    return (
        <Container component="main" maxWidth="xs" className={classes.paper}>
            <CssBaseline/>
            <Card>
                <CardContent>
                    <Typography className={cls.centered} component="h1" variant="h5">
                        Change Password
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField margin="normal" required fullWidth id="old_password" label="old password"
                                   name="old_password" type="password" autoComplete="current-password" autoFocus
                                   onChange={handleChange} variant="standard" size="small"/>
                        <TextField margin="normal" required fullWidth id="new_password1" label="new password"
                                   name="new_password1" type="password" autoComplete="new-password"
                                   onChange={handleChange} variant="standard" size="small"/>

                        <TextField margin="normal" required fullWidth name="new_password2" label="confirm new password"
                                   type="password" id="password" autoComplete="new-password"
                                   onChange={handleChange} variant="standard" size="small"/>
                        <FormSubmitButton disabled={isSubmitting || isLoading}>
                            {isSubmitting ? "changing password..." : "change password"}
                        </FormSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {createSnackAlert, passwordChange})(PasswordChange)