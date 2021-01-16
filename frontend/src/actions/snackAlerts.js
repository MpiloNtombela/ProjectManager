import {NEW_ALERT} from "./types";

/*
 creates a new alertMsg. params(alertMsg, statusCode):

 statusCode = 0 ==> info alert:
 statusCode = 1 ==> warning alert:
 statusCode **200 ==> success alert:
 statusCode >=300 ==> error alert:
 */

const createSnackAlert = (alertMsg, statusCode) => {
    let alertType;
    if (statusCode === 0) {
        alertType = "info"
    } else if (statusCode === 1) {
        alertType = "warning"
    } else if (statusCode >= 200 && statusCode < 300) {
        alertType = "success"
    } else {
        alertType = "error"
    }
    if (typeof alertMsg === "object") {
        if (alertMsg['non_field_errors']) {
            alertMsg = `${alertMsg['non_field_errors'].join()}`
        } else {
            alertMsg = Object.entries(alertMsg)[0][1]
        }
    }
    return {
        type   : NEW_ALERT,
        payload: {
            alertType,
            alertMsg,
            statusCode,
        },
    };
};
export default createSnackAlert;

// RETURN ERRORS  **action creator**
