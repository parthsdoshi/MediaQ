import Queue from './Queue';
import { changeMediaStateAction, initiateSearchAction } from "../actions/index";
import { connect } from 'react-redux';

const getVisibleQueue = (queue, visibleQueue) => {
    let ret = [];
    for (item of visibleQueue) {
        let itemObj = {};
        itemObj.rowData = queue[item];
        itemObj.mediaId = item;

        // paused?
        itemObj.playState = 2;
        if (itemObj.rowData.mediaId == selectedMedia.mediaId) {
            itemObj.playState = selectedMedia.playState;
        }

        ret.push(queue[item]);
    }

    return ret;
}

const mapStateToProps = state => {
    return {
        selectedMedia : state.selectedMedia,
        queue: getVisibleQueue(state.entities.queue, state.visibleQueue, state.selectedMedia)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeMediaState: (mediaId, playState) => dispatch(changeMediaStateAction(mediaId, playState)),
        initiateSearch: () => dispatch(initiateSearchAction())
    }
}

const VisibleQueue = connect(
    mapStateToProps,
    mapDispatchToProps
)(Queue)

export default VisibleQueue;
