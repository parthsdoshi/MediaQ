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
    return {
        type: types.SET_DISPLAY_NAME,
        payload: {displayName: displayName}
    };
};

export const setQID = qID => {
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
    return {
        type: types.LOGOUT
    };
};

export const resolveBrowserClose = () => {
    return {
        type: types.RESOLVE_BROWSER_CLOSE
    };
};

export const addNewUser = newUser => {
    return {
        type: types.ADD_NEW_USER,
        payload: {newUser: newUser}
    };
};

export const removeUser = userToRemove => {
    return {
        type: types.REMOVE_USER,
        payload: {userToRemove: userToRemove}
    };
};

export const setUserList = userList => {
    return {
        type: types.SET_USER_LIST,
        payload: {userList: userList}
    };
};

export const setCurrentlyPlayingIndex = newIndex => {
    return {
        type: types.SET_CURRENTLY_PLAYING_INDEX,
        payload: {newIndex: newIndex}
    };
};

export const decrementCurrentlyPlayingIndex = () => {
    return {
        type: types.DECREMENT_CURRENTLY_PLAYING_INDEX
    };
};

export const incrementCurrentlyPlayingIndex = () => {
    return {
        type: types.INCREMENT_CURRENTLY_PLAYING_INDEX
    };
};

export const changePlayState = playState => {
    return {
        type: types.CHANGE_PLAY_STATE,
        payload: {playState: playState}
    };
};

export const seekSecondsAhead = seconds => {
    return {
        type: types.SEEK_SECONDS_AHEAD,
        payload: {seconds: seconds}
    };
};

export const setVolume = newVolumeLevel => {
    return {
        type: types.SET_VOLUME,
        payload: {newVolumeLevel: newVolumeLevel}
    };
};

export const toggleShuffle = () => {
    return {
        type: types.TOGGLE_SHUFFLE
    };
};

export const changeYoutubeVideoObject = youtubeVideoObject => {
    return {
        type: types.CHANGE_YOUTUBE_VIDEO_OBJECT,
        payload: {youtubeVideoObject: youtubeVideoObject}
    };
};


export const addToQueue = medias => {
    return {
        type: types.ADD_TO_QUEUE,
        payload: { medias: medias }
    };
};

export const setQueue = newQueue => {
    return {
        type: types.SET_QUEUE,
        payload: {newQueue: newQueue}
    };
};
