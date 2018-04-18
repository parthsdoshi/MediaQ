import * as types from "../constants/action-types";

const initialState = {
    socket: null,

    loggedIn: false,
    displayName: '',
    qID: '',
    displayQIDPopup: false,
    displayIncorrectQIDPopup: false,

    //todo dont hardcode 2
    playState: 2,
    currentlyPlayingIndex: 0, //0 means no video is playing
    volumeLevel: 100,
    youtubeVideoObject: null,
    QueueRowEntries: [],

    userList: []
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_SOCKET:
            localStorage.setItem('socket', action.payload.socket);
            return { ...state, socket: action.payload.socket};
        case types.LOGIN:
            localStorage.setItem('displayName', state.displayName);
            localStorage.setItem('qID', state.qID);
            return { ...state, loggedIn: true };
        case types.SET_DISPLAY_NAME:
            return { ...state, displayName: action.payload.displayName };
        case types.SET_QID:
            return { ...state, qID: action.payload.qID };
        case types.SET_QID_POPUP_DISPLAY_STATUS:
            return { ...state, displayQIDPopup: action.payload.newDisplayStatus };
        case types.SET_INCORRECT_QID_POPUP_DISPLAY_STATUS:
            return { ...state, displayIncorrectQIDPopup: action.payload.newDisplayStatus };
        case types.LOGOUT:
            localStorage.removeItem("qID");
            localStorage.removeItem("displayName");
            state.socket.emit('leave', {'displayName': state.displayName, 'qID': state.qID});
            return { ...initialState, socket: state.socket };
        case types.RESOLVE_BROWSER_CLOSE:
            if (state.loggedIn) {
                localStorage.setItem('displayName', state.displayName);
                localStorage.setItem('qID', state.qID);
                state.socket.emit('leave', {'displayName': state.displayName, 'qID': state.qID});
            }
            return { ...state };
        case types.ADD_NEW_USER:
            return { ...state, userList: [...state.userList, action.payload.newUser] };
        case types.REMOVE_USER:
            let newUserList = state.userList.slice(0); //clone array
            for (let i = newUserList.length - 1; i >= 0; i--) {
                if (newUserList[i].displayName === action.payload.userToRemove) {
                    newUserList.splice(i, 1);
                    break;
                }
            }
            return { ...state, userList: newUserList };
        case types.SET_USER_LIST:
            return { ...state, userList: action.payload.userList };
        case types.SET_CURRENTLY_PLAYING_INDEX:
            return { ...state, currentlyPlayingIndex: action.payload.newIndex, playState: 2, youtubeVideoObject: null };
        case types.DECREMENT_CURRENTLY_PLAYING_INDEX:
            let prevIndex = state.currentlyPlayingIndex - 1;
            //todo dont hardcode 2
            return { ...state, currentlyPlayingIndex: prevIndex, playState: 2, youtubeVideoObject: null };
        case types.INCREMENT_CURRENTLY_PLAYING_INDEX:
            let nextIndex = state.currentlyPlayingIndex + 1;
            if (nextIndex === state.QueueRowEntries.length + 1) {
                nextIndex = 0;
            }
            //todo dont hardcode 2
            return { ...state, currentlyPlayingIndex: nextIndex, playState: 2, youtubeVideoObject: null };
        case types.CHANGE_PLAY_STATE:
            return { ...state, playState: action.payload.playState };
        case types.SEEK_SECONDS_AHEAD:
            if (state.youtubeVideoObject === null) {
                // youtube haven't given back the object yet
            } else {
                const current_time = state.youtubeVideoObject.getCurrentTime();
                const allow_seek_ahead = true;
                state.youtubeVideoObject.seekTo(current_time + action.payload.seconds, allow_seek_ahead);
            }
            return { ...state };
        case types.SET_VOLUME:
            if (state.youtubeVideoObject === null) {
                // youtube haven't given back the object yet
            } else if (state.youtubeVideoObject.getVolume() !== action.payload.newVolumeLevel) {
                state.youtubeVideoObject.setVolume(action.payload.newVolumeLevel);
            }
            return { ...state, volumeLevel: action.payload.newVolumeLevel };
        case types.CHANGE_YOUTUBE_VIDEO_OBJECT:
            return { ...state, youtubeVideoObject: action.payload.youtubeVideoObject };
        case types.ADD_TO_QUEUE:
            return { ...state, QueueRowEntries: [...state.QueueRowEntries, action.payload.rowData] };
        case types.SET_QUEUE:
            return { ...state, QueueRowEntries: action.payload.newQueue };
        default:
            return state;
    }
};

export default rootReducer;
