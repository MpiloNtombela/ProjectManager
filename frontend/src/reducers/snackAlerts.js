import produce from "immer";
import { NEW_ALERT, CLEAR_ALERTS } from "../actions/types";

const initialState = {
  alertType: "",
  alertMsg: "",
  statusCode: null,
};

export default function (state = initialState, { type, payload }) {
  return produce(state, (draft) => {
    switch (type) {
      case NEW_ALERT:
        draft.alertType = payload.alertType;
        draft.alertMsg = payload.alertMsg;
        draft.statusCode = payload.statusCode;
        break;
      case CLEAR_ALERTS:
        return initialState;
      default:
        return state;
    }
  });
}
