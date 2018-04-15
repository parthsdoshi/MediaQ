import { CHANGE_PLAY_STATE,
    CHANGE_YOUTUBE_VIDEO_OBJECT,
    ADD_TO_QUEUE,
    SET_QUEUE} from "../constants/action-types";

const initialState = {
  playState: 2,
  youtubeVideoObject: {},
  QueueRowEntries: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PLAY_STATE:
      return { ...state, playState: action.payload.playState };
    case CHANGE_YOUTUBE_VIDEO_OBJECT:
      return { ...state, youtubeVideoObject: action.payload.youtubeVideoObject };
      case ADD_TO_QUEUE:
          localStorage.setItem('QueueRows', JSON.stringify([...state.QueueRowEntries, action.payload.rowData]));
          return { ...state, QueueRowEntries: [...state.QueueRowEntries, action.payload.rowData] };
      case SET_QUEUE:
          localStorage.setItem('QueueRows', JSON.stringify(action.payload.newQueue));
          return { ...state, QueueRowEntries: action.payload.newQueue };
    default:
      return state;
  }
};

export default rootReducer;
