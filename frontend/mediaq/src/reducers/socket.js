import * as types from "../constants/action-types";
import { socketCommands, socketErrors, VERBOSE_SOCKET_LISTEN } from '../sockets/socketConstants';

const initialState = {
    socket: null,
    loggedIn: false,
    displayName: '',
    qID: ''
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
        case types.SOCKET_LOGOUT:
            if (state.loggedIn) {
                state.socket.emit(socketCommands.LEAVE, {'displayName': state.displayName, 'qID': state.qID});
                localStorage.removeItem("qID");
                localStorage.removeItem("displayName");
            }
            return { ...initialState, socket: state.socket };
        case types.SOCKET_CLEAR_STATE:
            if (state.loggedIn) {
                localStorage.removeItem("qID");
                localStorage.removeItem("displayName");
            }
            return { ...initialState, socket: state.socket };
        case types.RESOLVE_BROWSER_CLOSE:
            if (state.loggedIn) {
                // we should probably put these in a saga
                state.socket.emit(socketCommands.LEAVE, {'displayName': state.displayName, 'qID': state.qID});
                localStorage.setItem('displayName', state.displayName);
                localStorage.setItem('qID', state.qID);
            }
            return { ...state };
        default:
            return state;
    }
};