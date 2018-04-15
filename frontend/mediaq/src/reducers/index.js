const initialState = {
    selectedMedia: {
        playState: 2,
        mediaId: ''
    },
    entities: {
        users: {},
        queue: {},
        qID: ''
    },
    visibleQueue: [],
    showSearchModal: false
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_MEDIA_STATE":
      return {...state, selectedMedia: {
          playState: action.payload.playState,
          mediaId: action.payload.mediaId
      }};
    case "INITIATE_SEARCH":
      return {...state, showSearchModal: true};
    case "CLOSE_SEARCH":
      return {...state, showSearchModal: false};
    /* case "CHANGE_PLAY_STATE":
      return { ...state, playState: action.payload.playState };
    case "CHANGE_YOUTUBE_VIDEO_OBJECT":
      return { ...state, youtubeVideoObject: action.payload.youtubeVideoObject }; */
    default:
      return state;
  }
};

export default rootReducer;
