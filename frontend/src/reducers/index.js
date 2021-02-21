import {combineReducers} from "redux";
import auth from "./auth";
import alerts from "./snackAlerts";
import errors from "./errors";
import tasksReducer from "./projects/tasksReducer";
import boardsReducer from "./projects/boardsReducer";
import projectsReducer from "./projects/projectsReducer";

export default combineReducers({
  alerts,
  auth,
  errors,
  tasksState: tasksReducer,
  boardsState: boardsReducer,
  projectsState: projectsReducer
});
