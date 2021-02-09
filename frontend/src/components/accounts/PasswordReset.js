import PropTypes from "prop-types";
import React from 'react';
import TextField from "@material-ui/core/TextField";
import {connect} from "react-redux";
import createSnackAlert from "../../actions/snackAlerts";
import {passwordReset} from "../../actions/auth";
import {validatePasswords} from "../../validators/validators";
import CssBaseline from "@material-ui/core/CssBaseline";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {useHistory} from 'react-router-dom'
import {FormSubmitButton} from "../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useImmer} from "use-immer";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textItems: 'center',
    paddingBottom: theme.spacing(10)
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing(1),
  },
  centered: {
    display: "block",
    textAlign: "center"
  },
}))

const PasswordReset = ({auth, createSnackAlert, passwordReset, match}) => {
    const isLoading = auth.isLoading;
    const isSubmitting = auth.isSubmitting;
    const classes = useStyles();
    const {uid, token} = match.params;
    const history = useHistory()

    const [passwords, setPasswords] = useImmer({
        new_password1: "",
        new_password2: ""
    })
    const handleChange = e => {
        setPasswords((draft) => {
            draft[e.target.name] =  e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (auth.isAuthenticated) {
            createSnackAlert(`Already logged in as ${auth.user.username}`, 1)
            return history.push('/')
        }
        const {new_password1, new_password2} = passwords
        const {valid, message} = validatePasswords(new_password1, new_password2)

        if (!valid) {
            return createSnackAlert(message, 400)
        } else {
            const credentials = {
                new_password1,
                new_password2,
                uid,
                token
            }
            passwordReset(credentials, history)
        }
    }
    return (
        <Container component="main" maxWidth="xs" className={classes.paper}>
            <CssBaseline/>
            <Card>
                <CardContent>
                    <Typography className={classes.centered} component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField margin="normal" required fullWidth id="new_password1" label="new password"
                                   name="new_password1" type="password" autoComplete="new-password" autoFocus
                                   onChange={handleChange} variant="standard" size="small"/>
                        <TextField margin="normal" required fullWidth name="new_password2" label="confirm new password"
                                   type="password" id="password" autoComplete="new-password"
                                   onChange={handleChange} variant="standard" size="small"/>
                        <FormSubmitButton disabled={isLoading || isSubmitting}>
                            {isSubmitting ? "resetting password..." : "reset password"}
                        </FormSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

PasswordReset.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.any,
    isLoading: PropTypes.any,
    isSubmitting: PropTypes.any,
    user: PropTypes.shape({
      username: PropTypes.any
    })
  }),
  createSnackAlert: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      uid: PropTypes.string,
      token: PropTypes.string
    })
  }),
  passwordReset: PropTypes.func
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {createSnackAlert, passwordReset})(PasswordReset)