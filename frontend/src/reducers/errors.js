import React from 'react';
import {CLEAR_ERRORS, GET_ERRORS} from "../actions/types";


const initialState = {
    errors: [],
    status: null
}

export default function (state = initialState, {type, payload}) {
    switch (type) {
        case GET_ERRORS:
            return {
                errors: payload.errors,
                status: payload.status
            }
        case CLEAR_ERRORS:
            return initialState;
        default:
            return state;
    }
}