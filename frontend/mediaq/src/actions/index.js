import * as types from "../constants/action-types";

export const setSocket = socket => {
    return {
        type: types.SET_SOCKET,
        payload: {socket: socket}
    };
};

export const login = () => {
    return {
        type: types.LOGIN
    };
};

export const setDisplayName = displayName => {
    localStorage.setItem('displayName', displayName);
    return {
        type: types.SET_DISPLAY_NAME,
        payload: {displayName: displayName}
    };
};

export const setQID = qID => {
    localStorage.setItem('qID', qID);
    return {
        type: types.SET_QID,
        payload: {qID: qID}
    };
};

export const setQIDPopupDisplayStatus = newDisplayStatus => {
    return {
        type: types.SET_QID_POPUP_DISPLAY_STATUS,
        payload: {newDisplayStatus: newDisplayStatus}
    };
};

export const setIncorrectQIDPopupDisplayStatus = newDisplayStatus => {
    return {
        type: types.SET_INCORRECT_QID_POPUP_DISPLAY_STATUS,
        payload: {newDisplayStatus: newDisplayStatus}
    };
};

export const logout = () => {
    localStorage.removeItem("qID");
    localStorage.removeItem("displayName");
    localStorage.removeItem('QueueRows');
    return {
        type: types.LOGOUT
    };
};

export const setCurrentlyPlayingIndex = newIndex => {
    return {
        type: types.SET_CURRENTLY_PLAYING_INDEX,
        payload: {newIndex: newIndex}
    };
};

export const incrementCurrentlyPlayingIndex = () => {
    return {
        type: types.INCREMENT_CURRENTLY_PLAYING_INDEX
    };
};

export const changePlayStateAction = playState => {
    return {
        type: types.CHANGE_PLAY_STATE,
        payload: {playState: playState}
    };
};

export const changeYoutubeVideoObjectAction = youtubeVideoObject => {
    return {
        type: types.CHANGE_YOUTUBE_VIDEO_OBJECT,
        payload: {youtubeVideoObject: youtubeVideoObject}
    };
};


export const addToQueue = rowData => {
    return {
        type: types.ADD_TO_QUEUE,
        payload: {rowData: rowData}
    };
};

export const setQueue = newQueue => {
    return {
        type: types.SET_QUEUE,
        payload: {newQueue: newQueue}
    };
};
