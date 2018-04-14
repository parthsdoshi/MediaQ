const initialState = {
  playState: 2,
  youtubeVideoObject: {}
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_PLAY_STATE":
      return { ...state, playState: action.payload.playState };
    case "CHANGE_YOUTUBE_VIDEO_OBJECT":
      return { ...state, youtubeVideoObject: action.payload.youtubeVideoObject };
    default:
      return state;
  }
};

export default rootReducer;
