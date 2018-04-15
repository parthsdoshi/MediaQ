// probably refactor strings into its own thing in utils
// and then use deconstructors to access them

export const changePlayStateAction = playState => ({
    type: "CHANGE_PLAY_STATE",
    payload: {playState: playState}
});

export const changeYoutubeVideoObjectAction = youtubeVideoObject => ({
    type: "CHANGE_YOUTUBE_VIDEO_OBJECT",
    payload: {youtubeVideoObject: youtubeVideoObject}
});

export const changeMediaStateAction = (mediaId, playState) => ({
    type: "CHANGE_SELECTED_MEDIA",
    payload: {
        mediaId: mediaId,
        playState: playState
    }
});

export const initiateSearchAction = () => ({
    type: "INITIATE_SEARCH",
    payload: {
        
    }
});
