import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Table, Button } from 'reactstrap';

import PlusIcon from 'open-iconic/svg/plus.svg';

import { connect } from 'react-redux';
import * as youtubeStates from "../constants/youtube";
import { changePlayState,
    changeYoutubeVideoObject,
    addToQueue,
    setCurrentlyPlayingIndex,
    incrementCurrentlyPlayingIndex,
    setVolume } from "../actions";

import AddNewMediaModal from './AddNewMediaModal';
import QueueRowEntry from './QueueRowEntry';
import { getEmbededVideoComponent } from '../utils/google_utils';

class Queue extends Component {

    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.state = {
            showAddNewMediaModal: false,
        };
    }

    //scroll if video position changes
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.currentlyPlayingIndex !== this.props.currentlyPlayingIndex) {
            this.scrollToEmbeddedVideo();
        }
    };

    scrollToEmbeddedVideo = () => {
        const tesNode = ReactDOM.findDOMNode(this.refs.embeddedVideo);
        window.scrollTo(0, tesNode.offsetTop);
    };

    setYoutubeVideoObjectAPICallback = (event) => {
        console.log('youtube video called on ready callback');
        this.props.changeYoutubeVideoObject(event.target);
        this.props.setVolume(this.props.volumeLevel);
    };

    youtubeVideoStateChangedAPICallback = (event) => {
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
        const volumeLevel = this.props.currentlyPlayingYoutubeVideoObject.getVolume();
        if (volumeLevel !== this.props.volumeLevel) {
            this.props.setVolume(volumeLevel);
        }
    };

    loadVideoCallback = (rowData) => {
        this.socket.emit('addToQueue', {
            'rowData': rowData,
            'qID': this.props.qID
        });
        this.setState({
            showAddNewMediaModal: false
        });
        //todo make an optimistic server response and add it to queue immediately, then when server responds ignore it
        //this.props.addToQueue(rowData);
    };

    loadPlaylistCallback = (rowDatas) => {
        this.setState({
            showAddNewMediaModal: false
        });
        for (let i = 0; i < rowDatas.length; i++) {
            this.socket.emit('addToQueue', {
                'rowData': rowDatas[i],
                'qID': this.props.qID
            });
        }
        //todo make an optimistic server response and add it to queue immediately, then when server responds ignore it
        //this.props.addToQueue(rowData);
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

    render() {
        let QueueRowEntries = [];
        for(let i = 0; i < this.props.QueueRowEntries.length; i++) {
            QueueRowEntries.push(
                <QueueRowEntry
                    key={i}
                    rowID={i+1}
                    rowData={this.props.QueueRowEntries[i]}
                    playState={this.props.playState}
                    currentlyPlayingIndex={this.props.currentlyPlayingIndex}
                    rowEntryPlayButtonClicked={this.rowEntryPlayButtonClicked} />
                );
            if (this.props.currentlyPlayingIndex === i + 1) {
                QueueRowEntries.push(
                    <tr ref="embeddedVideo">
                        <td></td>
                        <td></td>
                        <td>
                            {getEmbededVideoComponent(this.props.QueueRowEntries[this.props.currentlyPlayingIndex-1].id,
                                this.setYoutubeVideoObjectAPICallback,
                                this.youtubeVideoStateChangedAPICallback,
                                64*9,
                                39*9)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </ tr>
                );
            }
        }
        return (
            <div>
                {this.state.showAddNewMediaModal &&
                    <AddNewMediaModal loadVideoCallback={this.loadVideoCallback}
                                      hideMe={this.toggleAddNewMediaModal}
                                      loadPlaylistCallback={this.loadPlaylistCallback}/>}
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <Table hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Title</th>
                            <th>Author/Artist</th>
                            <th>Album</th>
                            <th>Source</th>
                            <th>
                                <Button onClick={this.toggleAddNewMediaModal} color="primary"  className="rounded-circle">
                                    <img alt="Add to Queue" src={PlusIcon} />
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
                        {/*{getEmbededVideoComponent(this.props.QueueRowEntries[this.props.currentlyPlayingIndex-1].id,*/}
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

const mapStateToProps = state => {
    return {
        socket: state.socket,
        qID: state.qID,
        playState : state.playState,
        currentlyPlayingYoutubeVideoObject: state.youtubeVideoObject,
        QueueRowEntries: state.QueueRowEntries,
        currentlyPlayingIndex: state.currentlyPlayingIndex,
        volumeLevel: state.volumeLevel
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePlayState : playState => dispatch(changePlayState(playState)),
        changeYoutubeVideoObject: youtubeVideoObject => dispatch(changeYoutubeVideoObject(youtubeVideoObject)),
//        addToQueue: rowData => dispatch(addToQueue(rowData)),
        setCurrentlyPlayingIndex: newIndex => dispatch(setCurrentlyPlayingIndex(newIndex)),
        incrementCurrentlyPlayingIndex: () => dispatch(incrementCurrentlyPlayingIndex()),
        setVolume: newVolumeLevel => dispatch(setVolume(newVolumeLevel))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Queue)
