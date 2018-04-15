import { CHANGE_PLAY_STATE,
    CHANGE_YOUTUBE_VIDEO_OBJECT,
    ADD_TO_QUEUE,
    SET_QUEUE} from "../constants/action-types";

export const changePlayStateAction = playState => ({
    type: CHANGE_PLAY_STATE,
    payload: {playState: playState}
});

export const changeYoutubeVideoObjectAction = youtubeVideoObject => ({
    type: CHANGE_YOUTUBE_VIDEO_OBJECT,
    payload: {youtubeVideoObject: youtubeVideoObject}
});

export const addToQueue = rowData => ({
    type: ADD_TO_QUEUE,
    payload: {rowData: rowData}
});

export const setQueue = newQueue => ({
    type: SET_QUEUE,
    payload: {newQueue: newQueue}
});
