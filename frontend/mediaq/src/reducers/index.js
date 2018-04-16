import * as types from "../constants/action-types";

const initialState = {
    socket: null,
    loggedIn: false,
    displayName: '',
    qID: '',
    displayQIDPopup: false,
    displayIncorrectQIDPopup: false,
    playState: 2,
    currentlyPlayingIndex: 0, //0 means no video is playing
    youtubeVideoObject: null,
    QueueRowEntries: []
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_SOCKET:
            return { ...state, socket: action.payload.socket};
        case types.LOGIN:
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
            return { ...initialState, socket: state.socket };
        case types.SET_CURRENTLY_PLAYING_INDEX:
            return { ...state, currentlyPlayingIndex: action.payload.newIndex };
        case types.INCREMENT_CURRENTLY_PLAYING_INDEX:
            let newIndex = (state.currentlyPlayingIndex + 1) % (state.QueueRowEntries.length + 1);
            return { ...state, currentlyPlayingIndex: newIndex };
        case types.CHANGE_PLAY_STATE:
            return { ...state, playState: action.payload.playState };
        case types.CHANGE_YOUTUBE_VIDEO_OBJECT:
            return { ...state, youtubeVideoObject: action.payload.youtubeVideoObject };
        case types.ADD_TO_QUEUE:
            localStorage.setItem('QueueRows', JSON.stringify([...state.QueueRowEntries, action.payload.rowData]));
            return { ...state, QueueRowEntries: [...state.QueueRowEntries, action.payload.rowData] };
        case types.SET_QUEUE:
            localStorage.setItem('QueueRows', JSON.stringify(action.payload.newQueue));
            return { ...state, QueueRowEntries: action.payload.newQueue };
        default:
            return state;
    }
};

export default rootReducer;
