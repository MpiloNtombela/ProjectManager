import {combineReducers} from "redux";
import auth from "./auth";
import alerts from "./snackAlerts";
import errors from "./errors";
import projects from "./projects";

export default combineReducers({
  alerts,
  auth,
  errors,
  projectState: projects
});
