import * as types from "../constants/action-types";

const initialState = {
    socket: null
};

export default function socket(state = initialState, action) {
    switch (action.type) {
        case types.SET_SOCKET:
            localStorage.setItem('socket', action.payload.socket);
            return { ...state, socket: action.payload.socket};
        default:
            return state;
    }
};