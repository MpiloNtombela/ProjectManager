import React, {lazy, Suspense, useEffect} from 'react';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {loadUser} from '../actions/auth';
import Home from "./Home";
import SnackAlerts from "./feedback/SnackAlerts";
import ThemeProvider from "@material-ui/core/styles/ThemeProvider";
import PrivateRoute from "./common/PrivateRoute";
import Navbar from "./layout/Navbar";
import FormSkeleton from "./skeletons/FormSkeleton";
import theme from "./styles/theme";
import ProjectTemplate from "./projects/ProjectTemplate";
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider'

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
  }, [dispatch])


  return (
    <StyledEngineProvider injectFirst={true}>
      <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Navbar/>
            <Switch>
              <PrivateRoute exact path="/" component={Home}/>
              <PrivateRoute path="/project/:id/" component={ProjectTemplate}/>
              <Suspense fallback={<FormSkeleton/>}>
                <PrivateRoute path="/profile" component={PasswordChange}/>
                <Route path="/login" component={Login}/>
                <Route path="/test" component={SetupPreviewPage}/>
                <Route path="/register" component={Register}/>
                <Route path="/api/auth/registration/account-confirm-email/:key/" component={ConfirmEmail}/>
                <Route path="/api/auth/password/reset/confirm/:uid/:token/" component={PasswordReset}/>
              </Suspense>
            </Switch>
            <SnackAlerts/>
          </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App;
