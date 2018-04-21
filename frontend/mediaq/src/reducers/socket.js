import * as types from "../constants/action-types";

const initialState = {
    socket: null,
    loggedIn: false,
};

export default function socket(state = initialState, action) {
    switch (action.type) {
        case types.SET_DISPLAY_NAME:
            return { ...state, displayName: action.payload.displayName };
        case types.SET_QID:
            return { ...state, qID: action.payload.qID };
        case types.SET_SOCKET:
            localStorage.setItem('socket', action.payload.socket);
            return { ...state, socket: action.payload.socket};
        case types.LOGIN:
            localStorage.setItem('displayName', state.displayName);
            localStorage.setItem('qID', state.qID);
            return { ...state, loggedIn: true };
        case types.LOGOUT:
            if (state.loggedIn) {
                state.socket.emit('leave', {'displayName': state.displayName, 'qID': state.qID});
                localStorage.removeItem("qID");
                localStorage.removeItem("displayName");
            }
            return { ...state, loggedIn: false };
        case types.RESOLVE_BROWSER_CLOSE:
            if (state.loggedIn) {
                state.socket.emit('leave', {'displayName': state.displayName, 'qID': state.qID});
                localStorage.setItem('displayName', state.displayName);
                localStorage.setItem('qID', state.qID);
            }
            return { ...state };
        default:
            return state;
    }
};