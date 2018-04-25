import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Table, Button } from 'reactstrap';
import PlusIcon from 'open-iconic/svg/plus.svg';
import MinusIcon from 'open-iconic/svg/minus.svg';

import { connect } from 'react-redux';

import * as youtubeStates from "../constants/youtube";
import {
    changePlayState,
    changeYoutubeVideoObject,
    setCurrentlyPlayingIndex,
    incrementCurrentlyPlayingIndex,
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
import { getEmbeddedVideoComponent, getYoutubeVideoVolume } from '../utils/google_utils';
import { CHECK_VOLUME_INTERVAL_MS } from '../constants/youtube';
import { socketCommands } from '../sockets/socketConstants';
import PopupModal from "./PopupModal";

class Queue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showAddNewMediaModal: false,
        };
    }

    componentDidMount() {
        this.youtubeVolumeListener = setInterval(() => {
            if (this.props.currentlyPlayingYoutubeVideoObject === null) {
                return;
            }
            let volumeLevel = getYoutubeVideoVolume(this.props.currentlyPlayingYoutubeVideoObject);
            if (volumeLevel !== this.props.volumeLevel) {
                this.props.setVolume(volumeLevel);
                console.log('interval dispatched' + volumeLevel)
            }
        }, CHECK_VOLUME_INTERVAL_MS);
    };

    componentWillUnmount() {
        //queue should never reload as of now, but if it ever does make sure this works
        clearInterval(this.youtubeVolumeListener);
    };

    //scroll if video position changes
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.currentlyPlayingIndex !== this.props.currentlyPlayingIndex &&
            this.props.currentlyPlayingIndex !== 0) {
            this.scrollToEmbeddedVideo();
        }
    };

    scrollToEmbeddedVideo = () => {
        const tesNode = ReactDOM.findDOMNode(this.refs.embeddedVideo);
        if (tesNode != null) { //!= null: not null or undefined
            window.scrollTo(0, tesNode.offsetTop);
        }
    };

    setYoutubeVideoObjectAPICallback = (event) => {
        console.log('youtube video called on ready callback: ');
        this.props.changeYoutubeVideoObject(event.target);
    };

    youtubeVideoStateChangedAPICallback = (event) => {
        console.log(event.target)
        if (this.props.currentlyPlayingYoutubeVideoObject === null) {
            //this might happen when we set the currentobject to null because of a media change
            //but when switching from one youtube video to another, youtube doesnt call onReady callback
            //it calls this, thus set the video object to the current object then handle similarly to normal calls.
            this.props.changeYoutubeVideoObject(event.target);
            this.props.setVolume(this.props.volumeLevel);
        }
        const youtubeState = this.props.currentlyPlayingYoutubeVideoObject.getPlayerState();
        if (youtubeState === youtubeStates.ENDED) { // ended
            this.props.changePlayState(youtubeStates.PAUSED);
            this.props.incrementCurrentlyPlayingIndex();
        }
        if (this.props.playState !== youtubeStates.PLAYING && youtubeState === youtubeStates.PLAYING) {
            this.props.changePlayState(youtubeStates.PLAYING);
        }
        if (this.props.playState !== youtubeStates.PAUSED && youtubeState === youtubeStates.PAUSED) {
            this.props.changePlayState(youtubeStates.PAUSED);
        }
        if (this.props.playState !== youtubeStates.BUFFERING && youtubeState === youtubeStates.BUFFERING) {
            this.props.changePlayState(youtubeStates.BUFFERING);
        }

        //volume
        let volumeLevel = this.props.currentlyPlayingYoutubeVideoObject.getVolume();
        const isMuted = this.props.currentlyPlayingYoutubeVideoObject.isMuted();
        if (isMuted) {
            volumeLevel = 0;
        }
        if (volumeLevel !== this.props.volumeLevel) {
            this.props.setVolume(volumeLevel);
            console.log(volumeLevel)
        }
    };

    loadVideosCallback = (medias) => {
        console.log(medias);
        this.props.addToQueue(medias);
        this.props.socket.emit(socketCommands.ADDMEDIAS,
            { 'data': {'medias':  medias}, 'qID': this.props.qID },
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
            this.props.setCurrentlyPlayingIndex(entryNumber);
            this.props.changePlayState(youtubeStates.BUFFERING);
        } else if (this.props.currentlyPlayingYoutubeVideoObject === null) {
            // youtube haven't given back the object yet
        } else {
            if (this.props.playState === youtubeStates.PAUSED || this.props.playState === youtubeStates.BUFFERING) {
                this.props.currentlyPlayingYoutubeVideoObject.playVideo();
            } else if (this.props.playState === youtubeStates.PLAYING) {
                this.props.currentlyPlayingYoutubeVideoObject.pauseVideo()
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
                <a href={rowData.link} target="_blank" style={{display: "table-cell"}}>
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
                    key={i}
                    rowID={i + 1}
                    rowData={this.props.QueueRowEntries[i]}
                    playState={this.props.playState}
                    currentlyPlayingIndex={this.props.currentlyPlayingIndex}
                    rowEntryPlayButtonClicked={this.rowEntryPlayButtonClicked}
                    rowEntryCheckboxClicked={this.props.rowEntryCheckboxClicked} 
                    deletionMode={this.props.deletionMode} />
            );
            if (this.props.currentlyPlayingIndex === i + 1) {
                //todo use better keys?
                QueueRowEntries.push(
                    <tr ref="embeddedVideo" key={this.props.QueueRowEntries[i].timestamp}>
                        <td />
                        <td />
                        <td>
                            {getEmbeddedVideoComponent(this.props.QueueRowEntries[i].id,
                                this.setYoutubeVideoObjectAPICallback,
                                this.youtubeVideoStateChangedAPICallback,
                                64 * 9,
                                39 * 9)}
                        </td>
                        <td />
                        <td />
                        <td />
                    </ tr>
                );
            }
        }
        return (
            <div>
                {this.state.showAddNewMediaModal &&
                    <AddNewMediaModal hideMe={this.toggleAddNewMediaModal}
                        header={'Add new media'}>
                        <Search loadVideoCallback={this.loadVideoCallback}
                            loadPlaylistCallback={this.loadPlaylistCallback} />
                    </AddNewMediaModal>
                }
                {this.props.showMediaDetailsModal &&
                    <div>
                        {this.props.currentlyPlayingIndex === 0 &&
                        <PopupModal modelWantsToCloseCallback={() => this.props.toggleMediaDetailModal()}
                                    title={'Please Select Media'}
                                    body={<p><b>Please select a media before attempting to view more details</b></p>} />
                        }
                        {this.props.currentlyPlayingIndex !== 0 &&
                            <PopupModal modelWantsToCloseCallback={() => this.props.toggleMediaDetailModal()}
                            title={'Media Details'}
                            body={this.getRowDataMoreDetails(
                            this.props.QueueRowEntries[this.props.currentlyPlayingIndex - 1])} />
                        }
                    </div>
                }
                {this.props.displaySessionRestoredPopup &&
                    <PopupModal modelWantsToCloseCallback={() => this.props.setSessionRestoredPopupDisplayStatus(false)}
                                title={'Session Restored'}
                                body={<p><b>Your session has been restored</b></p>} />
                }

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
                        {QueueRowEntries}
                    </tbody>
                </Table>
                {/*{this.props.currentlyPlayingIndex !== 0 &&*/}
                {/*<div className="text-center">*/}
                        {/*{getEmbeddedVideoComponent(this.props.QueueRowEntries[this.props.currentlyPlayingIndex-1].id,*/}
                                            {/*this.setYoutubeVideoObjectAPICallback,*/}
                                            {/*this.youtubeVideoStateChangedAPICallback,*/}
                                            {/*64*9,*/}
                                            {/*39*9)}*/}
                     {/*</ div>*/}
                {/*}*/}
            </div>
            );
    }

}

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

const mapStateToProps = state => {
    return {
        socket: state.socket.socket,
        qID: state.semiRoot.qID,
        playState : state.semiRoot.playState,
        currentlyPlayingYoutubeVideoObject: state.semiRoot.youtubeVideoObject,
        QueueRowEntries: lexicographicalSort(state.semiRoot.QueueRowEntries),
        currentlyPlayingIndex: state.semiRoot.currentlyPlayingIndex,
        volumeLevel: state.semiRoot.volumeLevel,
        showMediaDetailsModal: state.semiRoot.showMediaDetailsModal,
        displaySessionRestoredPopup: state.semiRoot.displaySessionRestoredPopup,
        deletionMode: state.socket.deletionMode
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePlayState : playState => dispatch(changePlayState(playState)),
        changeYoutubeVideoObject: youtubeVideoObject => dispatch(changeYoutubeVideoObject(youtubeVideoObject)),
        addToQueue: medias => dispatch(addToQueue(medias)),
        setCurrentlyPlayingIndex: newIndex => dispatch(setCurrentlyPlayingIndex(newIndex)),
        incrementCurrentlyPlayingIndex: () => dispatch(incrementCurrentlyPlayingIndex()),
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
