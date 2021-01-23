import * as action from "../actions/types";
import produce from "immer";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  userLoading: true,
  isSubmitting: false,
  emailVerificationFailed: false,
  user: null,
};

const auth = (state = initialState, { type, payload }) => {
  return produce(state, (draft) => {
    switch (type) {
      case action.USER_LOADING:
        draft.isLoading = true;
        draft.userLoading = true;
        break;
      case action.AUTH_REQUEST_SENT:
        draft.isSubmitting = true;
        break;
      case action.AUTH_REQUEST_DONE:
      case action.PASSWORD_CHANGED:
      case action.PASSWORD_CHANGE_FAILED:
        draft.isSubmitting = false;
        draft.isLoading = false;
        break;
      case action.USER_LOADED:
        draft.user = payload;
        draft.isAuthenticated = true;
        draft.isLoading = false;
        draft.userLoading = false;
        break;
      case action.LOGIN_SUCCESS:
        localStorage.setItem("token", payload.key);

        draft.token = payload.key;
        draft.isAuthenticated = true;
        draft.isLoading = false;
        draft.isSubmitting = false;
        draft.emailVerificationFailed = false;
        break;
      case action.EMAIL_VERIFICATION_FAILED:
        draft.isLoading = false;
        draft.isSubmitting = false;
        draft.emailVerificationFailed = true;
        break;
      case action.REGISTER_SUCCESS:
        draft.isLoading = false;
        draft.isSubmitting = false;
        draft.emailVerificationFailed = false;
        break;
      case action.AUTH_ERROR:
      case action.LOGIN_FAIL:
      case action.LOGOUT_SUCCESS:
      case action.REGISTER_FAIL:
      case action.EMAIL_VERIFIED:
      case action.RESET_LINK_SENT_FAILED:
      case action.RESET_LINK_SENT:
      case action.PASSWORD_RESET_SUCCESS:
      case action.PASSWORD_RESET_FAILED:
        localStorage.removeItem("token");
        draft.userLoading = false;
        draft.token = null;
        draft.user = null;
        draft.isAuthenticated = false;
        draft.isLoading = false;
        draft.isSubmitting = false;
        draft.emailVerificationFailed = false;
        break;
      default:
        return state;
    }
  });
};
export default auth;
