import axios from "axios";
import * as action from "./types";
import createSnackAlert from "./snackAlerts";
import returnErrors from "./errors";
import {batch} from "react-redux";
import {config, tokenConfig} from "../components/common/axiosConfig";


// CHECK AUTHENTICATED USER TOKEN & LOAD THAT USER
export const loadUser = () => (dispatch, getState) => {
  // User Loading
  dispatch({type: action.USER_LOADING});

  axios
    .get("/api/auth/user/", tokenConfig(getState().auth.token))
    .then((res) => {
      dispatch({
        type: action.USER_LOADED,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: action.AUTH_ERROR,
      });
    });
};

// LOGIN USER
export const login = (credentials) => (dispatch) => {
  dispatch({
    type: action.AUTH_REQUEST_SENT,
  });
  // Request Body
  const body = JSON.stringify(credentials);
  axios
    .post("/api/auth/login/", body, config)
    .then((res) => {
      dispatch({
        type: action.LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
      dispatch(createSnackAlert("logged in successfully", 200));
      dispatch({type: action.CLEAR_ALERTS});
      dispatch({type: action.CLEAR_ERRORS});
    })
    .catch((err) => {
      dispatch({
        type: action.LOGIN_FAIL,
      });
      if (err.response.data["non_field_errors"]) {
        dispatch(createSnackAlert(err.response.data, err.response.status));
      } else {
        dispatch(returnErrors(err.response.data, err.response.status));
      }
    });
};

// REGISTER USER
export const register = (newUser, history) => (dispatch) => {
  dispatch({
    type: action.AUTH_REQUEST_SENT,
  });

  // Request Body
  const body = JSON.stringify(newUser);

  axios
    .post("/api/auth/registration/", body, config)
    .then((res) => {
      dispatch({type: action.REGISTER_SUCCESS});
      dispatch({type: action.CLEAR_ALERTS});
      dispatch({type: action.CLEAR_ERRORS});
      dispatch(createSnackAlert(res.data, res.status));
      history.push("/login");
    })
    .catch((err) => {
      dispatch({type: action.REGISTER_FAIL});
      if (err.response.data["non_field_errors"]) {
        dispatch(createSnackAlert(err.response.data, err.response.status));
      } else {
        dispatch(returnErrors(err.response.data, err.response.status));
      }
    });
};

// CONFIRM EMAIL
export const confirmEmail = (key, history) => (dispatch) => {
  dispatch({type: action.AUTH_REQUEST_SENT});
  const body = JSON.stringify({key: key});

  axios
    .post("/api/auth/account-confirm-email/", body, config)
    .then(() => {
      dispatch({type: action.EMAIL_VERIFIED});
      dispatch(createSnackAlert("Email verified successfully", 200));
      dispatch({type: action.CLEAR_ALERTS});
      history.push("/login");
    })
    .catch((err) => {
      batch(() => {
        dispatch({type: action.EMAIL_VERIFICATION_FAILED});
        dispatch(
          createSnackAlert(
            "Verification failed. Either link is corrupt or expired",
            err.response.status
          )
        );
      });
    });
};
export const resendConfirmEmail = (email, history) => (dispatch) => {
  dispatch({type: action.AUTH_REQUEST_SENT});
  const body = JSON.stringify({email});

  axios
    .post("/api/auth/resend-account-confirmation-email/", body, config)
    .then((res) => {
      batch(() => {
        dispatch({type: action.RESET_LINK_SENT});
        dispatch({type: action.CLEAR_ALERTS});
      });
      dispatch(createSnackAlert(res.data, res.status));
      history.push("/login");
    })
    .catch((err) => {
      batch(() => {
        dispatch({type: action.EMAIL_VERIFICATION_FAILED});
        dispatch(createSnackAlert(err.response.data, err.response.status));
      });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  dispatch({
    type: action.AUTH_REQUEST_SENT,
  });
  axios
    .post("/api/auth/logout/", null, tokenConfig(getState().auth.token))
    .then((res) => {
      dispatch({
        type: action.LOGOUT_SUCCESS,
      });
      dispatch(createSnackAlert(res.data, res.status));
      dispatch({type: action.CLEAR_ALERTS});
      dispatch({type: action.CLEAR_ERRORS});
    })
    .catch((err) => {
      dispatch(createSnackAlert(err.response.data, err.response.status));
    });
};

// FORGOT PASSWORD
export const forgotPassword = (email) => (dispatch) => {
  dispatch({
    type: action.AUTH_REQUEST_SENT,
  });
  const body = JSON.stringify({email: email});
  axios
    .post("/api/auth/password/reset/", body, config)
    .then((res) => {
      dispatch({
        type: action.RESET_LINK_SENT,
      });
      dispatch(createSnackAlert(res.data, res.status));
      dispatch({type: action.CLEAR_ALERTS});
      dispatch({type: action.CLEAR_ERRORS});
    })
    .catch((err) => {
      dispatch({type: action.RESET_LINK_SENT_FAILED});
      dispatch(createSnackAlert(err.response.data, err.response.status));
    });
};

// PASSWORD RESET
export const passwordReset = (credentials, history) => (dispatch) => {
  dispatch({
    type: action.AUTH_REQUEST_SENT,
  });
  // Request Body
  const body = JSON.stringify(credentials);
  axios
    .post("/api/auth/password/reset/confirm/", body, config)
    .then((res) => {
      dispatch({
        type: action.PASSWORD_RESET_SUCCESS,
      });
      dispatch(createSnackAlert(res.data, res.status));
      dispatch({type: action.CLEAR_ALERTS});
      history.push("/login");
    })
    .catch((err) => {
      dispatch({
        type: action.PASSWORD_RESET_FAILED,
      });
      dispatch(createSnackAlert(err.response.data, err.response.status));
    });
};

// PASSWORD RESET
export const passwordChange = (credentials, history) => (dispatch, getState) => {
  dispatch({
    type: action.AUTH_REQUEST_SENT,
  });
  // Request Body
  const body = JSON.stringify(credentials);
  axios
    .post("/api/auth/password/change/", body, tokenConfig(getState().auth.token))
    .then((res) => {
      dispatch({
        type: action.PASSWORD_CHANGED,
      });
      dispatch(createSnackAlert(res.data, res.status));
      dispatch({type: action.CLEAR_ALERTS});
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: action.PASSWORD_CHANGE_FAILED,
      });
      dispatch(createSnackAlert(err.response.data, err.response.status));
    });
};

// Setup config with token - helper function
