import { combineReducers } from 'redux';
import auth from './auth';
import alerts from "./snackAlerts";
import errors from "./errors";

export default combineReducers({
  alerts,
  auth,
  errors
});
