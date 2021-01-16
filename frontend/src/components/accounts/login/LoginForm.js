import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {connect} from "react-redux";
import {useComponentStyles} from "../../styles/componentStyles";
import createSnackAlert from "../../../actions/snackAlerts";
import ForgotPasswordForm from "../ForgotPasswordForm";
import {forgotPassword} from "../../../actions/auth";
import {FormSubmitButton} from "../../reuse/ReButtons";
import Typography from "@material-ui/core/Typography";

const LoginForm = ({auth, errors, handleSubmit, fieldType, setCredentials, createSnackAlert, forgotPassword}) => {
    const isLoading = auth.isLoading;
    const isSubmitting = auth.isSubmitting;
    const classes = useComponentStyles();
    const [open, setOpen] = useState(false)


    const [errs, setErrs] = useState({
        email   : '',
        username: '',
        password: '',
    })

    const handleChange = e => {
        setCredentials(prevState => ({
            ...prevState, [e.target.name]: e.target.value
        }))
        if (errors.length) {
            setErrs((prevState => ({
                ...prevState, [e.target.name]: ""
            })))
        }
    }
    useEffect(() => {
        for (const err of errors) {
            setErrs((prevState => ({
                ...prevState, [err.field]: err.error
            })))
        }
    }, [errors])
    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (auth.isAuthenticated) {
            return createSnackAlert(`Already logged in as ${auth.user.username}`, 0)
        }
        handleSubmit(e)
    }
    return (
        <>
            <form className={classes.form} onSubmit={handleFormSubmit}>
                <TextField margin="normal" required fullWidth id={fieldType}
                           label={fieldType} name={fieldType} type={fieldType === "email" ? fieldType : "text"}
                           autoComplete={fieldType} autoFocus onChange={handleChange} variant="standard" size="small"
                           error={!!errs[fieldType]} helperText={errs[fieldType]}/>
                <TextField margin="normal" required fullWidth name="password" label="Password"
                           type="password" id="password" autoComplete="current-password"
                           onChange={handleChange} variant="standard" size="small"
                           error={!!errs.password} helperText={errs.password}/>
                <FormSubmitButton disabled={isLoading || isSubmitting}>
                    {isSubmitting ? "Logging In..." : "Log In"}
                </FormSubmitButton>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Link onClick={(() => setOpen(true))} className={classes.link} to="#">
                            {"Forgot password?"}
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Link className={classes.link} to="/register">
                            {"No account yet? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </form>
            <Typography variant="body2">
                {"No account yet? Sign Up"}
            </Typography>
            <Button component={Link} variant="contained" fullWidth color="secondary" to="/register">create account</Button>
            <ForgotPasswordForm
                auth={auth}
                createSnackAlert={createSnackAlert}
                forgotPassword={forgotPassword}
                open={open} setOpen={setOpen}
            />
        </>
    )
}

const mapStateToProps = state => ({
    errors: state.errors.errors,
    auth  : state.auth
})

export default connect(mapStateToProps, {createSnackAlert, forgotPassword})(LoginForm)