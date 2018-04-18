import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import PlusIcon from 'open-iconic/svg/plus.svg';
import { connect } from 'react-redux';

import QueueRowEntry from './QueueRowEntry';
import { getEmbededVideoComponent } from '../utils/google_utils';
import AddNewMediaModal from './AddNewMediaModal.js';

import {changePlayStateAction,
    changeYoutubeVideoObjectAction,
    addToQueue,
    setCurrentlyPlayingIndex,
    incrementCurrentlyPlayingIndex} from "../actions/index";
import {setVolume} from "../actions";

class Queue extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props);
        this.socket = props.socket;

        this.ended = 0;
        this.playing = 1;
        this.paused = 2;
        this.buffering = 3;

        this.state = {
            showAddNewMediaModal: false,
        };
    }

    setYoutubeVideoObjectAPICallback = (event) => {
        console.log('youtube video called on ready callback');
        this.props.changeYoutubeVideoObject(event.target);
        this.props.setVolume(this.props.volumeLevel);
    };

    youtubeVideoStateChangedAPICallback = (event) => {
        //youtubeAPI: 0->ended 1->playing   2->paused   3->buffering
        if (this.props.currentlyPlayingYoutubeVideoObject === null) {
            //this might happen when we set the currentobject to null because of a media change
            //but when switching from one youtube video to another, youtube doesnt call onReady callback
            //it calls this, thus set the video object to the current object then handle similarly to normal calls.
            this.props.changeYoutubeVideoObject(event.target);
            this.props.setVolume(this.props.volumeLevel);
        }
        const youtubeState = this.props.currentlyPlayingYoutubeVideoObject.getPlayerState();
        if (youtubeState === this.ended) { // ended
            this.props.changePlayState(this.paused);
            this.props.incrementCurrentlyPlayingIndex();
        }
        if (this.props.playState !== this.playing && youtubeState === this.playing) { // playing
            this.props.changePlayState(this.playing);
        }
        if (this.props.playState !== this.paused && youtubeState === this.paused) { // paused
            this.props.changePlayState(this.paused);
        }
        if (this.props.playState !== this.buffering && youtubeState === this.buffering) { // buffering
            this.props.changePlayState(this.buffering);
        }

        //volume
        const volumeLevel = this.props.currentlyPlayingYoutubeVideoObject.getVolume();
        if (volumeLevel !== this.props.volumeLevel) {
            this.props.setVolume(volumeLevel);
        }
    };

    loadVideoCallback = (rowData) => {
        console.log(rowData);
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

    toggleAddNewMediaModal = () => {
        this.setState({
            showAddNewMediaModal: !this.state.showAddNewMediaModal
        });
    };


    rowEntryPlayButtonClicked = (entryNumber) => {
        if (entryNumber !== this.props.currentlyPlayingIndex) {
            this.props.setCurrentlyPlayingIndex(entryNumber);
            this.props.changePlayState(this.buffering);
        } else if (this.props.currentlyPlayingYoutubeVideoObject === null) {
            // youtube haven't given back the object yet
        } else {
            if (this.props.playState === this.paused || this.props.playState === this.buffering) {
                this.props.currentlyPlayingYoutubeVideoObject.playVideo();
            } else if (this.props.playState === this.playing) {
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
        }
        return (
            <div>
                {this.state.showAddNewMediaModal &&
                    <AddNewMediaModal loadVideoCallback={this.loadVideoCallback} hideMe={this.toggleAddNewMediaModal} />}
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
                                <Button onClick={this.toggleAddNewMediaModal} color="primary">
                                    <img alt="Add to Queue" src={PlusIcon} />
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {QueueRowEntries}
                    </tbody>
                </Table>
                {this.props.currentlyPlayingIndex !== 0 &&
                    <div className="text-center"> 
                        {getEmbededVideoComponent(this.props.QueueRowEntries[this.props.currentlyPlayingIndex-1].id,
                                            this.setYoutubeVideoObjectAPICallback,
                                            this.youtubeVideoStateChangedAPICallback,
                                            64*9,
                                            39*9)}
                     </ div>
                }
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
        changePlayState : playState => dispatch(changePlayStateAction(playState)),
        changeYoutubeVideoObject: youtubeVideoObject => dispatch(changeYoutubeVideoObjectAction(youtubeVideoObject)),
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
