import * as types from "../constants/action-types";
import * as youtubeStates from "../constants/youtube";
import { NO_MEDIA_PLAYING, MAX_VOLUME, MIN_VOLUME } from "../constants/queue";
import { getYoutubeVideoVolume, setYoutubeVideoVolume, replayVideo } from "../utils/google_utils";

const initialState = {
    displayName: '',
    qID: '',
    displayQIDPopup: false,
    displayIncorrectQIDPopup: false,
    displaySessionRestoredPopup: false,

    playState: youtubeStates.PAUSED,
    currentlyPlayingIndex: NO_MEDIA_PLAYING,
    playingIndexHistory: [],
    volumeLevel: MAX_VOLUME,
    shuffleMode: false,
    repeatMode: false,
    showMediaDetailsModal: false,
    youtubeVideoObject: null,
    QueueRowEntries: {},
    visibleQueue: [],

    userList: []
};

function getNextIndexShuffle(current, max) {
    // max is inclusive
    if (current === NO_MEDIA_PLAYING || current > max || current < 0) {//trivial
        return Math.floor(Math.random() * max);
    }
    if (current === 0 && max === 0) {
        // only one media and its currently playing
        return current;
    }
    if (max < 0) {
        // can't be done
        console.log('getRandomNumNotCurrent error, returning.');
        return;
    }
    const random = Math.floor(Math.random() * (max - 1)); // random number from 0 to max-2
    // return conditions splits choices to 0 1 2 3 ... current-2 current-1 current+1 current+2 ... max-1
    return random >= current ? random+1 : random;
}

function getNextIndex(current, queueLength) {
    if (current === NO_MEDIA_PLAYING || current < 0) {
        return 0;
    } else if (current + 1 >= queueLength) {
        // end of queue
        return NO_MEDIA_PLAYING;
    } else {
        return current + 1;
    }
}

export default function semiRoot(state = initialState, action) {
    switch (action.type) {
        case types.SET_DISPLAY_NAME:
            return { ...state, displayName: action.payload.displayName };
        case types.SET_QID:
            return { ...state, qID: action.payload.qID };
        case types.SET_QID_POPUP_DISPLAY_STATUS:
            return { ...state, displayQIDPopup: action.payload.newDisplayStatus };
        case types.SET_INCORRECT_QID_POPUP_DISPLAY_STATUS:
            return { ...state, displayIncorrectQIDPopup: action.payload.newDisplayStatus };
        case types.SET_SESSION_RESTORED_POPUP_DISPLAY_STATUS:
            return { ...state, displaySessionRestoredPopup: action.payload.newDisplayStatus };
        case types.LOGOUT:
            return { ...initialState };
        case types.ADD_NEW_USER:
            return { ...state, userList: [...state.userList, action.payload.newUser] };
        case types.REMOVE_USER:
            let newUserList = state.userList.slice(0); //clone array
            let index = newUserList.indexOf(action.payload.userToRemove);
            if (index > -1) {
                newUserList.splice(index, 1)
            }
            return { ...state, userList: newUserList };
        case types.SET_USER_LIST:
            return { ...state, userList: action.payload.userList };
        case types.SET_CURRENTLY_PLAYING_MEDIA:
            let newIndex = action.payload.newIndex;
            if (state.currentlyPlayingIndex === newIndex) {
                return [ ...state ];
            }
            let newPlayingIndexHistory = [ ...state.playingIndexHistory, state.currentlyPlayingIndex ];
            return { ...state, currentlyPlayingIndex: newIndex, playingIndexHistory: newPlayingIndexHistory,
                playState: youtubeStates.PAUSED, youtubeVideoObject: null };
        case types.PLAY_NEXT_MEDIA:
            const currentlyPlayingIndex = state.currentlyPlayingIndex;
            const queueLength = Object.keys(state.QueueRowEntries).length;
            let nextIndex = currentlyPlayingIndex;
            newPlayingIndexHistory = [ ...state.playingIndexHistory ];
            if (queueLength === 0) {
                // empty queue, do nothing
                return { ...state };
            }
            if (state.repeatMode) {
                if (state.youtubeVideoObject === null && state.currentlyPlayingIndex !== NO_MEDIA_PLAYING) {
                    console.log('inconsistent state, no youtube video object');
                }
                if (state.youtubeVideoObject !== null) {
                    replayVideo(state.youtubeVideoObject);
                    return { ...state };
                } else {
                    nextIndex = getNextIndex(currentlyPlayingIndex, queueLength);
                }
            } else if (state.shuffleMode) {
                const max = queueLength - 1;
                nextIndex = getNextIndexShuffle(currentlyPlayingIndex, max);
            } else {
                nextIndex = getNextIndex(currentlyPlayingIndex, queueLength);
            }

            if (nextIndex !== currentlyPlayingIndex && currentlyPlayingIndex !== NO_MEDIA_PLAYING) {
                newPlayingIndexHistory = [ ...newPlayingIndexHistory, currentlyPlayingIndex ]
            }
            return { ...state, currentlyPlayingIndex: nextIndex, playingIndexHistory: newPlayingIndexHistory,
                playState: youtubeStates.PAUSED, youtubeVideoObject: null };
        case types.PLAY_PREV_MEDIA:
            let prevIndex;
            newPlayingIndexHistory = [ ...state.playingIndexHistory ];
            if (state.playingIndexHistory.length === 0) {
                prevIndex = NO_MEDIA_PLAYING;
            } else {
                prevIndex = newPlayingIndexHistory.pop();
            }
            return { ...state, currentlyPlayingIndex: prevIndex, playingIndexHistory: newPlayingIndexHistory,
                playState: youtubeStates.PAUSED, youtubeVideoObject: null };
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
            let newVolumeLevel = action.payload.newVolumeLevel;
            if (newVolumeLevel < MIN_VOLUME) {
                newVolumeLevel = MIN_VOLUME;
            }
            if (newVolumeLevel > MAX_VOLUME) {
                newVolumeLevel = MAX_VOLUME;
            }
            if (state.youtubeVideoObject === null) {
                // youtube haven't given back the object yet
            } else if (getYoutubeVideoVolume(state.youtubeVideoObject) !== newVolumeLevel) {
                setYoutubeVideoVolume(state.youtubeVideoObject, newVolumeLevel);
            }
            return { ...state, volumeLevel: newVolumeLevel };
        case types.TOGGLE_SHUFFLE:
            return { ...state, shuffleMode: !state.shuffleMode };
        case types.TOGGLE_REPEAT:
            return { ...state, repeatMode: !state.repeatMode };
        case types.TOGGLE_MEDIA_DETAIL_MODAL:
            return { ...state, showMediaDetailsModal: !state.showMediaDetailsModal };
        case types.CHANGE_YOUTUBE_VIDEO_OBJECT:
            return { ...state, youtubeVideoObject: action.payload.youtubeVideoObject };
        case types.ADD_TO_QUEUE:
            return { ...state, QueueRowEntries: {...state.QueueRowEntries, ...action.payload.medias} };
        case types.REMOVE_FROM_QUEUE:
            let newQueueRowEntries = {...state.QueueRowEntries};
            for (let id of action.payload.medias) {
                console.log(id)
                if (id in newQueueRowEntries) {
                    delete newQueueRowEntries[id]
                }
            }

            return { ...state, QueueRowEntries: newQueueRowEntries };
        case types.SET_QUEUE:
            return { ...state, QueueRowEntries: action.payload.newQueue };
        default:
            return state;
    }
};