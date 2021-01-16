import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {register} from '../../actions/auth';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import createSnackAlert from "../../actions/snackAlerts";
import {useComponentStyles} from "../styles/componentStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {FormSubmitButton} from "../reuse/ReButtons";
import {validatePasswords} from "../../validators/validators";
import useCommonStyles from "../styles/commonStyles";

const Register = ({errors, auth, register, createSnackAlert, history}) => {
    const isAuthenticated = auth.isAuthenticated
    const isLoading = auth.isLoading
    const isSubmitting = auth.isSubmitting
    const classes = useComponentStyles();
    const cls = useCommonStyles();
    const initState = {
        first_name: '',
        last_name : '',
        username  : '',
        email     : '',
        password1 : '',
        password2 : '',
    }
    const [state, setState] = useState(initState);
    const [errs, setErrs] = useState({
        first_name: '',
        last_name : '',
        username  : '',
        email     : '',
        password1 : '',
        password2 : '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const {first_name, last_name, username, email, password1, password2} = state;
        if (!(first_name && last_name && username && email && password1 && password2)) {
            return createSnackAlert("all fields are required", 400);
        }
        const {valid, message} = validatePasswords(password1, password2)
        if (!valid) {
            createSnackAlert(message, 400)
        } else {
            const newUser = {
                first_name, last_name, username, email,
                password1, password2,
            };
            register(newUser, history);
        }
    };

    const handleChange = (e) => {
        setState(prevState => ({
            ...prevState, [e.target.name]: e.target.value
        }))
        if (errors.length) {
            setErrs((prevState => ({
                ...prevState, [e.target.name]: ""
            })))
        }
    };

    useEffect(() => {
        for (const err of errors) {
            setErrs((prevState => ({
                ...prevState, [err.field]: err.error
            })))
        }
    }, [errors])
    const {first_name, last_name, username, email, password1, password2} = state;


    if (isAuthenticated) {
        return <Redirect to="/"/>
    } else {
        return (
            <Container className={classes.paper} component="main" maxWidth="xs">
                <CssBaseline/>
                <Card>
                    <CardContent>
                        <Typography className={cls.centered} component="h1" variant="h5">
                            New Account
                        </Typography>
                        <form className={classes.form} onSubmit={handleSubmit}>
                            {/*name grid*/}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth id="firstName"
                                               label="First Name" name="first_name" value={first_name}
                                               autoComplete="firstName" autoFocus onChange={handleChange}
                                               variant="standard" size="small"
                                               error={!!errs.first_name} helperText={errs.first_name}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth id="lastName"
                                               label="Last Name" name="last_name" value={last_name}
                                               autoComplete="lastName" onChange={handleChange}
                                               variant="standard" size="small"
                                               error={!!errs.last_name} helperText={errs.last_name}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth id="username"
                                               label="Username" name="username" value={username}
                                               autoComplete="username" onChange={handleChange}
                                               variant="standard" size="small"
                                               error={!!errs.username} helperText={errs.username}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required fullWidth id="email"
                                               label="Email Address" name="email" type="email" value={email}
                                               autoComplete="email" onChange={handleChange}
                                               variant="standard" size="small"
                                               error={!!errs.email} helperText={errs.email}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth name="password1"
                                               label="Password" type="password" id="password1" value={password1}
                                               autoComplete="new-password" onChange={handleChange}
                                               variant="standard" size="small"
                                               error={!!errs.password1} helperText={errs.password1}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required fullWidth name="password2"
                                               label="Confirm Password" type="password" id="password2" value={password2}
                                               autoComplete="new-password" onChange={handleChange}
                                               variant="standard" size="small"
                                               error={!!errs.password2} helperText={errs.password2}/>
                                </Grid>
                            </Grid>
                            <FormSubmitButton disabled={isSubmitting || isLoading}>
                                {isSubmitting ? "signing up..." : "Sign Up"}
                            </FormSubmitButton>
                            <Link className={classes.link} to="/login" variant="body2">
                                {"Already have an account? Log In"}
                            </Link>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    auth  : state.auth,
    errors: state.errors.errors
})

export default connect(mapStateToProps, {register, createSnackAlert})(Register)
