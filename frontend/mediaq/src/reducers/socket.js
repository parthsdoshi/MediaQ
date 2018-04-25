import * as types from "../constants/action-types";
import { socketCommands } from '../sockets/socketConstants';

const initialState = {
    socket: null,
    loggedIn: false,
    displayName: '',
    qID: '',
    deletionMode: false,
    rowEntriesCheckboxClicked: []
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
                state.socket.emit(socketCommands.LEAVE,
                    {'data': {'displayName': state.displayName}, 'qID': state.qID},
                    state.socket.LEAVEACKNOWLEDGEMENT);
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
                state.socket.emit(socketCommands.LEAVE,
                    {'data': {'displayName': state.displayName}, 'qID': state.qID},
                    state.socket.LEAVEACKNOWLEDGEMENT);
                localStorage.setItem('displayName', state.displayName);
                localStorage.setItem('qID', state.qID);
            }
            return { ...state };
        case types.SET_DELETION_MODE:
            if (!action.payload.newDeletionMode) {
                return { ...state, deletionMode: action.payload.newDeletionMode, rowEntriesCheckboxClicked: []}
            }
            return { ...state, deletionMode: action.payload.newDeletionMode };
        case types.ROW_ENTRY_CHECKBOX_CLICKED:
            let index = state.rowEntriesCheckboxClicked.indexOf(action.payload.rowID);
            if (index > -1) {
                let arr = state.rowEntriesCheckboxClicked.slice(0);
                arr.splice(index, 1);
                return { ...state, rowEntriesCheckboxClicked: arr }
            } else {
                return { ...state, rowEntriesCheckboxClicked: [...state.rowEntriesCheckboxClicked, action.payload.rowID] }
            }
        case types.DELETE_CHECKED_ROWS:
            state.socket.emit(socketCommands.REMOVEMEDIAS,
                { 'data': {'medias': state.rowEntriesCheckboxClicked}, 'qID': state.qID }, 
                state.socket.REMOVEMEDIASACKNOWLEDGEMENT);
            // emit
            return state;
        default:
            return state;
    }
};