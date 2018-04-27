import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Table, Button } from 'reactstrap';
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

        this.on = {play: this.playerOnPlay, pause: this.playerOnPause, buffering: this.playerOnBuffering}
    }

    // componentDidMount() {
    //     this.youtubeVolumeListener = setInterval(() => {
    //         if (this.props.currentlyPlayingYoutubeVideoObject === null) {
    //             return;
    //         }
    //         let volumeLevel = getYoutubeVideoVolume(this.props.currentlyPlayingYoutubeVideoObject);
    //         if (volumeLevel !== this.props.volumeLevel) {
    //             this.props.setVolume(volumeLevel);
    //         }
    //     }, CHECK_YOUTUBE_VOLUME_INTERVAL_MS);
    // };

    componentWillUnmount() {
        //queue should never reload as of now, but if it ever does make sure this works
        clearInterval(this.youtubeVolumeListener);
    };

    //scroll if video position changes
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.currentlyPlayingIndex !== this.props.currentlyPlayingIndex &&
            this.props.currentlyPlayingIndex !== NO_MEDIA_PLAYING) {
            this.scrollToEmbeddedVideo();
        }
    };

    scrollToEmbeddedVideo = () => {
        const tesNode = ReactDOM.findDOMNode(this.refs.embeddedVideo);
        if (tesNode != null) { //!= null: not null or undefined
            window.scrollTo(0, tesNode.offsetTop);
        }
    };

    onReady = (ref) => {
        console.log('media called on ready callback: ');
        this.props.changeMediaObject(ref);
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
        if (youtubeState === mediaStates.ENDED) { // ended
            this.props.changePlayState(mediaStates.PAUSED);
            this.props.playNextMedia();
        }
        if (this.props.playState !== mediaStates.PLAYING && youtubeState === mediaStates.PLAYING) {
            this.props.changePlayState(mediaStates.PLAYING);
        }
        if (this.props.playState !== mediaStates.PAUSED && youtubeState === mediaStates.PAUSED) {
            this.props.changePlayState(mediaStates.PAUSED);
        }
        if (this.props.playState !== mediaStates.BUFFERING && youtubeState === mediaStates.BUFFERING) {
            this.props.changePlayState(mediaStates.BUFFERING);
        }

        //volume
        let volumeLevel = this.props.currentlyPlayingYoutubeVideoObject.getVolume();
        const isMuted = this.props.currentlyPlayingYoutubeVideoObject.isMuted();
        if (isMuted) {
            volumeLevel = MIN_VOLUME;
        }
        if (volumeLevel !== this.props.volumeLevel) {
            this.props.setVolume(volumeLevel);
            console.log(volumeLevel)
        }
    };

    playerOnPause = () => {
        this.props.changePlayState(mediaStates.PAUSED)
    }
    playerOnPlay = () => {
        this.props.changePlayState(mediaStates.PLAYING)
    }
    playerOnBuffering = () => {
        this.props.changePlayState(mediaStates.BUFFERING)
    }

    loadVideosCallback = (medias) => {
        console.log(medias);
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
                    key={i}
                    rowID={i}
                    rowData={this.props.QueueRowEntries[i]}
                    playState={this.props.playState}
                    currentlyPlayingIndex={this.props.currentlyPlayingIndex}
                    rowEntryPlayButtonClicked={this.rowEntryPlayButtonClicked}
                    rowEntryCheckboxClicked={this.props.rowEntryCheckboxClicked}
                    deletionMode={this.props.deletionMode} />
            );
            if (this.props.currentlyPlayingIndex === i) {
                QueueRowEntries.push(
                    <tr ref="embeddedVideo" key={this.props.QueueRowEntries[i].timestamp}>
                        <td />
                        <td />
                        <td />
                        <td style={{height: 300}}>
                            {getEmbeddedVideoComponent(this.props.QueueRowEntries[i].link,
                                this.onReady,
                                this.on,
                                this.props.playState,
                                this.props.repeatMode,
                                this.props.volumeLevel,
                                '140%',
                                '100%')}
                        </td>
                        <td />
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

function getEmbeddedVideoComponent(url, onReady, on, playState, repeatMode, volume, width = '100%', height = '100%') {
    const youtubeVars = { //https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        rel: 0,
        enablejsapi: 1,
        controls: 1,
        showinfo: 0,
    };
    // const youtubeEvents = {
    //     onReady: onReady,
    //     onStateChange: onStateChange
    // };

    let playing = false;
    if (playState === mediaStates.PLAYING) {
        playing = true
    }

    let reactRef;
    return (<ReactPlayer url={url}
        width={width}
        height={height}
        config={{
            youtube: {
                preload: true,
                playerVars: youtubeVars
            }
        }}
        ref={(ref) => {reactRef = ref}}
        playing={playing}
        volume={volume/100}
        loop={repeatMode}
        onReady={() => {onReady(reactRef)}}
        onStart={() => {console.log('onStart')}}
        onPlay={on.play}
        onProgress={(data) => {/* console.log('onProgress'); console.log(data); */}}
        onDuration={(data) => {console.log('onDuration'); console.log(data)}}
        onPause={on.pause}
        onBuffer={on.buffer}
        onSeek={(data) => {console.log('onSeek'); console.log(data);}}
        onEnded={() => {console.log('onEnded')}}
        onError={(data) => {console.log('onError'); console.log(data);}} />);
}

const mapStateToProps = state => {
    return {
        socket: state.socket.socket,
        qID: state.semiRoot.qID,
        playState: state.semiRoot.playState,
        currentlyPlayingYoutubeVideoObject: state.semiRoot.youtubeVideoObject,
        QueueRowEntries: lexicographicalSort(state.semiRoot.QueueRowEntries),
        currentlyPlayingIndex: state.semiRoot.currentlyPlayingIndex,
        volumeLevel: state.semiRoot.volumeLevel,
        showMediaDetailsModal: state.semiRoot.showMediaDetailsModal,
        displaySessionRestoredPopup: state.semiRoot.displaySessionRestoredPopup,
        deletionMode: state.socket.deletionMode,
        repeatMode: state.semiRoot.repeatMode
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
