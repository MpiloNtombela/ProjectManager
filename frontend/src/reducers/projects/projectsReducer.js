import produce from "immer";
import * as action from "../../actions/projectTypes";

const initialState = {
  projects: null,
  project: null,
  isLoading: false
};


const projectsReducer = (state = initialState, {type, payload}) => produce(state, (draft) => {
  switch (type) {
    case action.GET_USER_PROJECTS:
    case action.GET_PROJECT:
      draft.isLoading = true
      break

    // request success
    case action.PROJECTS_LOADED:
      draft.projects = payload
      draft.isLoading = false
      break;
    case action.PROJECT_LOADED:
      draft.project = payload
      draft.isLoading = false
      break

    case action.RESET_INVITE_LINK:
      draft.project.invitation.url = payload
      break

    // request failed
    case action.PROJECTS_REQUEST_FAILED:
    case action.PROJECT_REQUEST_FAILED:
      draft.isLoading = false
      break

    // clear
    case action.CLEAR_PROJECT_STATE:
      return initialState
    default:
      return state;
  }
});

export default projectsReducer
