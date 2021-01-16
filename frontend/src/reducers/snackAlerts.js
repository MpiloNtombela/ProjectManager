import {NEW_ALERT, CLEAR_ALERTS} from "../actions/types";

const initialState = {
    alertType : "",
    alertMsg  : "",
    statusCode: null,
}

export default function (state = initialState, {type, payload}) {
    switch (type) {
        case NEW_ALERT:
            return {
                ...state, alertType: payload.alertType, alertMsg: payload.alertMsg, statusCode: payload.statusCode
            }
        case CLEAR_ALERTS:
            return initialState;
        default:
            return state;
    }
}