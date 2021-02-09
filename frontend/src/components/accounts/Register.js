import React, {useEffect} from "react";
import {Link, Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {FormSubmitButton} from "../reuse/ReButtons";
import {validatePasswords} from "../../validators/validators";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useImmer} from "use-immer";
import createSnackAlert from "../../actions/snackAlerts"
import {register} from "../../actions/auth";

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
    marginTop: theme.spacing(1)
  },
  centered: {
    display: "block",
    textAlign: "center"
  },
  link: {
    marginTop: theme.spacing(2),
    fontSize: "small",
    fontWeight: 600,
    display: "inline-block",
    color: theme.palette.secondary.main,
    textDecoration: "none"
  }
}))

const Register = ({history}) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const isLoading = useSelector(state => state.auth.isLoading)
  const isSubmitting = useSelector(state => state.auth.isSubmitting)
  const errors = useSelector(state => state.errors.errors)
  const dispatch = useDispatch()
  const classes = useStyles();

  const initState = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password1: "",
    password2: ""
  };
  const [state, setState] = useImmer(initState);
  const [errs, setErrs] = useImmer({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password1: "",
    password2: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      first_name,
      last_name,
      username,
      email,
      password1,
      password2
    } = state;
    if (
      !(first_name && last_name && username && email && password1 && password2)
    ) {
      return dispatch(createSnackAlert("all fields are required", 400));
    }
    const {valid, message} = validatePasswords(password1, password2);
    if (!valid) {
      dispatch(createSnackAlert(message, 400));
    } else {
      const newUser = {
        first_name,
        last_name,
        username,
        email,
        password1,
        password2
      };
      dispatch(register(newUser, history));
    }
  };

  const handleChange = (e) => {
    setState((draft) => {
      draft[e.target.name] = e.target.value
    });
    if (errors.length) {
      setErrs((draft) => {
        draft[e.target.name] = ""
      });
    }
  };

  useEffect(() => {
    for (const err of errors) {
      setErrs((draft) => {
        draft[err.field] = err.error
      });
    }
  }, [errors, setErrs]);
  const {
    first_name,
    last_name,
    username,
    email,
    password1,
    password2
  } = state;

  if (isAuthenticated) {
    return <Redirect to="/"/>;
  } else {
    return (
      <Container className={classes.paper} component="main" maxWidth="xs">
        <CssBaseline/>
        <Card>
          <CardContent>
            <Typography className={classes.centered} component="h1" variant="h5">
              New Account
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              {/*name grid*/}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="first_name"
                    value={first_name}
                    autoComplete="firstName"
                    autoFocus
                    onChange={handleChange}
                    variant="standard"
                    size="small"
                    error={!!errs.first_name}
                    helperText={errs.first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="last_name"
                    value={last_name}
                    autoComplete="lastName"
                    onChange={handleChange}
                    variant="standard"
                    size="small"
                    error={!!errs.last_name}
                    helperText={errs.last_name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    autoComplete="username"
                    onChange={handleChange}
                    variant="standard"
                    size="small"
                    error={!!errs.username}
                    helperText={errs.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={handleChange}
                    variant="standard"
                    size="small"
                    error={!!errs.email}
                    helperText={errs.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password1"
                    label="Password"
                    type="password"
                    id="password1"
                    value={password1}
                    autoComplete="new-password"
                    onChange={handleChange}
                    variant="standard"
                    size="small"
                    error={!!errs.password1}
                    helperText={errs.password1}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password2"
                    label="Confirm Password"
                    type="password"
                    id="password2"
                    value={password2}
                    autoComplete="new-password"
                    onChange={handleChange}
                    variant="standard"
                    size="small"
                    error={!!errs.password2}
                    helperText={errs.password2}
                  />
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
};
export default Register
