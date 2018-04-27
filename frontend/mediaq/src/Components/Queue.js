import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Table, Button, Container, ListGroup } from 'reactstrap';
import PlusIcon from 'open-iconic/svg/plus.svg';
import MinusIcon from 'open-iconic/svg/minus.svg';

import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import * as mediaStates from "../constants/media";
import {
    changePlayState,
    changeMediaObject,
    setCurrentlyPlayingMedia,
    playNextMedia,
    setVolume,
    toggleMediaDetailModal,
    addToQueue,
    setSessionRestoredPopupDisplayStatus,
    setDeletionMode,
    rowEntryCheckboxClicked
} from "../actions";

import * as keyUtils from 'firebase-key'
import AddNewMediaModal from './AddNewMediaModal';
import QueueRowEntry from './QueueRowEntry';
import Search from './Search';
import { getYoutubeVideoVolume } from '../utils/google_utils';
import { CHECK_YOUTUBE_VOLUME_INTERVAL_MS } from '../constants/media';
import { socketCommands } from '../sockets/socketConstants';
import PopupModal from "./PopupModal";
import { NO_MEDIA_PLAYING, MIN_VOLUME } from '../constants/queue';

class Queue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showAddNewMediaModal: false,
        };
    }

    loadVideosCallback = (medias) => {
        this.props.addToQueue(medias);
        this.props.socket.emit(socketCommands.ADDMEDIAS,
            { 'data': { 'medias': medias }, 'qID': this.props.qID },
            this.props.socket.ADDMEDIASACKNOWLEDGEMENT);
        this.setState({
            showAddNewMediaModal: false
        });
    };

    loadVideoCallback = (mediaId, rowData) => {
        let obj = {};
        obj[mediaId] = rowData;
        this.loadVideosCallback(obj)
    };

    loadPlaylistCallback = (medias) => {
        this.setState({
            showAddNewMediaModal: false
        });
        this.loadVideosCallback(medias)
    };


    toggleAddNewMediaModal = () => {
        this.setState({
            showAddNewMediaModal: !this.state.showAddNewMediaModal
        });
    };

    rowEntryPlayButtonClicked = (entryNumber) => {
        if (entryNumber !== this.props.currentlyPlayingIndex) {
            this.props.setCurrentlyPlayingMedia(entryNumber);
            this.props.changePlayState(mediaStates.BUFFERING);
        } else if (this.props.mediaObject === null) {
            // youtube haven't given back the object yet
        } else {
            if (this.props.playState === mediaStates.PAUSED || this.props.playState === mediaStates.BUFFERING) {
                // this.props.currentlyPlayingYoutubeVideoObject.playVideo();
                this.props.changePlayState(mediaStates.PLAYING)
            } else if (this.props.playState === mediaStates.PLAYING) {
                this.props.changePlayState(mediaStates.PAUSED)
                // this.props.currentlyPlayingYoutubeVideoObject.pauseVideo()
            }
        }
    };

    getRowDataMoreDetails = (rowData) => {
        return (
            <div>
                <img src={rowData.thumbnail} alt="Video Thumbnail" className="img-thumbnail" />
                <p><b>Title:</b> {rowData.title}</p>
                <p><b>Description:</b></p>
                <p>{rowData.description}</p>
                <p><b>Author:</b> {rowData.author}</p>
                <a href={rowData.link} target="_blank" style={{ display: "table-cell" }}>
                    <p><b>Source:</b> {rowData.source}</p>
                </a>
                <p><b>Added on:</b> {keyUtils.date(rowData.timestamp).toString()}</p>
                <p><b>Added by:</b> {rowData.displayName}</p>
                <p><b>Hash:</b> {rowData.timestamp}</p>
            </div>
        )
    };

    render() {
        let QueueRowEntries = [];
        for (let i = 0; i < this.props.QueueRowEntries.length; i++) {
            QueueRowEntries.push(
                <QueueRowEntry
                    buffering={this.props.buffering}
                    key={i}
                    rowID={i}
                    rowData={this.props.QueueRowEntries[i]}
                    playState={this.props.playState}
                    currentlyPlayingIndex={this.props.currentlyPlayingIndex}
                    rowEntryPlayButtonClicked={this.rowEntryPlayButtonClicked}
                    rowEntryCheckboxClicked={this.props.rowEntryCheckboxClicked}
                    deletionMode={this.props.deletionMode} />
            );
        }
        return (
            <div>
                {this.state.showAddNewMediaModal &&
                    <AddNewMediaModal
                        hideMe={this.toggleAddNewMediaModal}
                        header={'Add new media'}>
                        <Search
                            loadVideoCallback={this.loadVideoCallback}
                            loadPlaylistCallback={this.loadPlaylistCallback}
                            closeSearch={this.toggleAddNewMediaModal} />
                    </AddNewMediaModal>
                }
                {this.props.showMediaDetailsModal &&
                    <div>
                        {this.props.currentlyPlayingIndex === NO_MEDIA_PLAYING &&
                            <PopupModal modelWantsToCloseCallback={() => this.props.toggleMediaDetailModal()}
                                buttonColor="warning"
                                title={'Please Select Media'}
                                body={<p><b>Please select a media before attempting to view more details</b></p>} />
                        }
                        {this.props.currentlyPlayingIndex !== NO_MEDIA_PLAYING &&
                            <PopupModal modelWantsToCloseCallback={() => this.props.toggleMediaDetailModal()}
                                title={'Media Details'}
                                buttonColor="primary"
                                body={this.getRowDataMoreDetails(
                                    this.props.QueueRowEntries[this.props.currentlyPlayingIndex])} />
                        }
                    </div>
                }
                {this.props.displaySessionRestoredPopup &&
                    <PopupModal modelWantsToCloseCallback={() => this.props.setSessionRestoredPopupDisplayStatus(false)}
                        title={'Session Restored'}
                        buttonColor="primary"
                        body={<p><b>Your session has been restored</b></p>} />
                }
                {true &&
                    <Table hover>
                        <thead>
                            <tr>
                                <th />
                                <th />
                                <th>Title</th>
                                <th>Author/Artist</th>
                                <th>Album</th>
                                <th>Source</th>
                                <th>
                                    <Button onClick={this.toggleAddNewMediaModal} color="primary" className="rounded-circle">
                                        <img alt="Add to Queue" src={PlusIcon} />
                                    </Button>
                                </th>
                                <th>
                                    <Button onClick={() => this.props.setDeletionMode(!this.props.deletionMode)}
                                        color="danger"
                                        className="rounded-circle">
                                        <img alt="Remove from Queue" src={MinusIcon} />
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                }
                <ListGroup style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch', overflowScrolling: 'touch', maxHeight: '70vh' }}>
                    {QueueRowEntries}
                </ListGroup>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        socket: state.socket.socket,
        qID: state.semiRoot.qID,
        playState: state.semiRoot.playState,
        mediaObject: state.semiRoot.mediaObject,
        QueueRowEntries: state.semiRoot.visibleQueue,
        currentlyPlayingIndex: state.semiRoot.currentlyPlayingIndex,
        volumeLevel: state.semiRoot.volumeLevel,
        showMediaDetailsModal: state.semiRoot.showMediaDetailsModal,
        displaySessionRestoredPopup: state.semiRoot.displaySessionRestoredPopup,
        deletionMode: state.socket.deletionMode,
        repeatMode: state.semiRoot.repeatMode,
        buffering: state.semiRoot.buffering
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePlayState: playState => dispatch(changePlayState(playState)),
        changeMediaObject: youtubeVideoObject => dispatch(changeMediaObject(youtubeVideoObject)),
        addToQueue: medias => dispatch(addToQueue(medias)),
        setCurrentlyPlayingMedia: newIndex => dispatch(setCurrentlyPlayingMedia(newIndex)),
        playNextMedia: () => dispatch(playNextMedia()),
        setVolume: newVolumeLevel => dispatch(setVolume(newVolumeLevel)),
        toggleMediaDetailModal: () => dispatch(toggleMediaDetailModal()),
        setSessionRestoredPopupDisplayStatus: (newStatus) => dispatch(setSessionRestoredPopupDisplayStatus(newStatus)),
        rowEntryCheckboxClicked: (rowID) => dispatch(rowEntryCheckboxClicked(rowID)),
        setDeletionMode: (newMode) => dispatch(setDeletionMode(newMode))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Queue)
