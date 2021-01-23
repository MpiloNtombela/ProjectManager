import React, {lazy, Suspense, useEffect} from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {loadUser} from '../actions/auth';
import Home from "./Home";
import SnackAlerts from "./feedback/SnackAlerts";
import ThemeProvider from "@material-ui/core/styles/ThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Paper from "@material-ui/core/Paper";
import PrivateRoute from "./common/PrivateRoute";
import Navbar from "./layout/Navbar";
import BottomNavbar from "./layout/BottomNavbar";
import Hidden from "@material-ui/core/Hidden/Hidden";
import FormSkeleton from "./skeleton/FormSkeleton";

const Login = lazy(() => import('./accounts/login/Login'))
const Register = lazy(() => import('./accounts/Register'))
const PasswordChange = lazy(() => import('./accounts/passwordChange'))
const PasswordReset = lazy(() => import('./accounts/passwordReset'))
const ConfirmEmail = lazy(() => import('./accounts/ConfirmEmail'))
const SetupPreviewPage = lazy(() => import('./projects/setup/SetupPreviewPage'))
// const Error404 = lazy(() => import('./feedback/Error404'))

const App = () => {

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadUser())
    }, [])

    const theme = createMuiTheme({
        palette   : {
            mode   : 'dark',
            primary: {
                main: '#1E90FF'
            },
            secondary:{
                main: '#c10c6a'
            }
        },
        shape     : {
            // borderRadius: 12
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 9999
                    }
                }
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <Paper square style={{minHeight: "100vh", paddingBottom: "3rem"}} elevation={0}>
                <BrowserRouter>
                    <Navbar/>
                    <Switch>
                        <PrivateRoute exact path="/" component={Home}/>
                        <Suspense fallback={<FormSkeleton/>}>
                            <PrivateRoute path="/profile" component={PasswordChange}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/test" component={SetupPreviewPage}/>
                            <Route path="/register" component={Register}/>
                            <Route path="/api/auth/registration/account-confirm-email/:key/" component={ConfirmEmail}/>
                            <Route path="/api/auth/password/reset/confirm/:uid/:token/" component={PasswordReset}/>
                        </Suspense>
                        {/*<Route path="*" component={Error404}/>*/}
                    </Switch>
                    {/*<Suspense fallback={<div>Lading</div>}>*/}
                    <SnackAlerts/>
                    {/*</Suspense>*/}
                    <Hidden smUp>
                        <BottomNavbar/>
                    </Hidden>
                </BrowserRouter>
            </Paper>
        </ThemeProvider>
    )
}

export default App;
