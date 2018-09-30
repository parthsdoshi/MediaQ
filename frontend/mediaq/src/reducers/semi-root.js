import * as types from "../constants/action-types";
import * as mediaStates from "../constants/media";
import { NO_MEDIA_PLAYING, MAX_VOLUME, MIN_VOLUME, mediaType } from "../constants/queue";
import { getYoutubeVideoVolume, setYoutubeVideoVolume } from "../utils/google_utils";

const initialState = {
    displayName: '',
    qID: '',
    displayQIDPopup: false,
    displayIncorrectQIDPopup: false,
    displaySessionRestoredPopup: false,

    playState: mediaStates.PAUSED,
    buffering: false,
    currentlyPlayingIndex: NO_MEDIA_PLAYING,
    mediaType: mediaType.NONE,
    playingIndexHistory: [],
    volumeLevel: MAX_VOLUME,
    shuffleMode: false,
    repeatMode: false,
    showMediaDetailsModal: false,
    mediaObject: null,
    QueueRowEntries: {},
    visibleQueue: [],

    userList: []
};

function getNextIndexShuffle(current, max) {
    // max is inclusive
    if (current === NO_MEDIA_PLAYING || current > max || current < 0) {//trivial
        return Math.floor(Math.random() * (max + 1));
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
    const random = Math.floor(Math.random() * (max)); // random number from 0 to max-1
    // return conditions splits choices to 0 1 2 3 ... current-2 current-1 current+1 current+2 ... max-1 max
    return random >= current ? random + 1 : random;
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
                return [...state];
            }
            let newPlayingIndexHistory = [...state.playingIndexHistory, state.currentlyPlayingIndex];
            return {
                ...state, currentlyPlayingIndex: newIndex, playingIndexHistory: newPlayingIndexHistory,
                playState: mediaStates.PAUSED, mediaObject: null
            };
        case types.PLAY_NEXT_MEDIA:
            const currentlyPlayingIndex = state.currentlyPlayingIndex;
            const queueLength = state.visibleQueue.length;
            let nextIndex = currentlyPlayingIndex;
            newPlayingIndexHistory = [...state.playingIndexHistory];
            if (queueLength === 0) {
                // empty queue, do nothing
                return { ...state };
            } else if (state.repeatMode) {
                if (state.mediaObject === null && state.currentlyPlayingIndex !== NO_MEDIA_PLAYING) {
                    console.log('inconsistent state, no media object');
                } else if (state.mediaObject !== null) {
                    state.mediaObject.seekTo(0)
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
                newPlayingIndexHistory = [...newPlayingIndexHistory, currentlyPlayingIndex]
            }
            return {
                ...state, currentlyPlayingIndex: nextIndex, playingIndexHistory: newPlayingIndexHistory,
                playState: mediaStates.PAUSED, mediaObject: null
            };
        case types.PLAY_PREV_MEDIA:
            let prevIndex;
            newPlayingIndexHistory = [...state.playingIndexHistory];
            if (state.repeatMode) {
                state.mediaObject.seekTo(0);
                return { ...state };
            } else if (state.playingIndexHistory.length === 0) {
                prevIndex = NO_MEDIA_PLAYING;
            } else {
                prevIndex = newPlayingIndexHistory.pop();
            }
            return {
                ...state, currentlyPlayingIndex: prevIndex, playingIndexHistory: newPlayingIndexHistory,
                playState: mediaStates.PAUSED, mediaObject: null
            };
        case types.CHANGE_PLAY_STATE:
            if (action.payload.playState === mediaStates.BUFFERING) {
                return { ...state, buffering: true }
            }
            return { ...state, playState: action.payload.playState, buffering: false };
        case types.SEEK_SECONDS_AHEAD:
            if (state.mediaObject === null) {
                // media haven't given back the object yet
            } else {
                const current_time = state.mediaObject.getCurrentTime();
                state.mediaObject.seekTo(current_time + action.payload.seconds);
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
            if (state.mediaObject === null) {
                // media haven't given back the object yet
            }
            // } else if (getMediaObjectVolume(state.mediaObject) !== newVolumeLevel) {
            //     setMediaObjectVolume(state.mediaObject, newVolumeLevel);
            // }
            return { ...state, volumeLevel: newVolumeLevel };
        case types.TOGGLE_SHUFFLE:
            return { ...state, shuffleMode: !state.shuffleMode };
        case types.TOGGLE_REPEAT:
            return { ...state, repeatMode: !state.repeatMode };
        case types.TOGGLE_MEDIA_DETAIL_MODAL:
            return { ...state, showMediaDetailsModal: !state.showMediaDetailsModal };
        case types.CHANGE_MEDIA_OBJECT:
            action.payload.mediaObject.seekTo(0)
            return {
                ...state,
                mediaObject: action.payload.mediaObject,
                playState: mediaStates.PLAYING
            };
        case types.CHANGE_MEDIA_TYPE:
            return { ...state, mediaType: action.payload.mediaType };
        case types.ADD_TO_QUEUE:
            let newState = { ...state, QueueRowEntries: { ...state.QueueRowEntries, ...action.payload.medias } };
            newState.visibleQueue = lexicographicalSort(newState.QueueRowEntries);
            return newState;
        case types.REMOVE_FROM_QUEUE:
            let newQueueRowEntries = { ...state.QueueRowEntries };
            let currentlyPlayingHash = "";
            // get hash of currently playing media to update currentlyplayingindex at the end
            if (state.currentlyPlayingIndex !== NO_MEDIA_PLAYING) {
                currentlyPlayingHash = state.visibleQueue[state.currentlyPlayingIndex].timestamp;
            }
            // remove deleted elements
            for (let id of action.payload.medias) {
                if (id in newQueueRowEntries) {
                    delete newQueueRowEntries[id];
                }
            }
            let updatedVisibleQueue = lexicographicalSort(newQueueRowEntries);
            // loop through updatedVisibleQueue and if the currentlyPlayingHash is in there then update CurrentlyPlayingIndex
            let newCurrentlyPlayingIndex = NO_MEDIA_PLAYING;
            for (let i = 0; i < updatedVisibleQueue.length; i++) {
                if (updatedVisibleQueue[i].timestamp === currentlyPlayingHash){
                    newCurrentlyPlayingIndex = i; 
                    break;
                }
            }
            return { ...state, QueueRowEntries: newQueueRowEntries, visibleQueue: updatedVisibleQueue, 
                currentlyPlayingIndex: newCurrentlyPlayingIndex };
        case types.SET_QUEUE:
            let newVisibleQueue = lexicographicalSort(action.payload.newQueue);
            return { ...state, QueueRowEntries: action.payload.newQueue, visibleQueue: newVisibleQueue };
        default:
            return state;
    }
};

//todo move in utils file
const lexicographicalSort = (queue) => {
    let keys = [];
    for (let key in queue) {
        keys.push(key)
    }

    keys.sort();

    let ret = [];
    for (let key of keys) {
        ret.push(queue[key])
    }

    return ret
};