import PropTypes from "prop-types";
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import createSnackAlert from "../../../actions/snackAlerts";
import ForgotPasswordForm from "../ForgotPasswordForm";
import {forgotPassword} from "../../../actions/auth";
import {FormSubmitButton} from "../../reuse/ReButtons";
import Typography from "@material-ui/core/Typography";
import useCommonStyles from "../../styles/commonStyles";
import {useComponentStyles} from "../../styles/componentStyles";
import Box from "@material-ui/core/Box";

const LoginForm = ({auth, errors, handleSubmit, fieldType, setCredentials, createSnackAlert, forgotPassword}) => {
    const isLoading = auth.isLoading;
    const isSubmitting = auth.isSubmitting;
    const cls = useCommonStyles()
    const classes = useComponentStyles();
    const [open, setOpen] = useState(false)


    const [errs, setErrs] = useState({
        email: '',
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
                           <Link onClick={(() => setOpen(true))} className={classes.link} to="#">
                        {"Forgot password?"}</Link>
                <FormSubmitButton disabled={isLoading || isSubmitting}>
                    {isSubmitting ? "Logging In..." : "Log In"}
                </FormSubmitButton>
            </form>
            <Box sx={{my: 1}}>
                <Typography style={{fontSize: 'x-small'}} variant="body1" className={cls.centered} component='small'>
                    {"No account yet? create new one"}
                </Typography>
            </Box>
            <Button component={Link}
                    disableElevation
                    variant="contained"
                    fullWidth
                    color="secondary"
                    disabled={isLoading || isSubmitting}
                    to="/register">create account</Button>
            <ForgotPasswordForm
                auth={auth}
                createSnackAlert={createSnackAlert}
                forgotPassword={forgotPassword}
                open={open} setOpen={setOpen}
            />
        </>
    )
}

LoginForm.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    user: PropTypes.shape({
      username: PropTypes.string
    })
  }),
  createSnackAlert: PropTypes.func,
  errors: PropTypes.array,
  fieldType: PropTypes.string,
  forgotPassword: PropTypes.func,
  handleSubmit: PropTypes.func,
  setCredentials: PropTypes.func
}

const mapStateToProps = state => ({
    errors: state.errors.errors,
    auth: state.auth
})

export default connect(mapStateToProps, {createSnackAlert, forgotPassword})(LoginForm)