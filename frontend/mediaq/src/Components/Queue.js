import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import {connect} from 'react-redux';
import PlusIcon from 'open-iconic/svg/plus.svg';

import QueueRowEntry from './QueueRowEntry';
import { getEmbededVideoComponent } from '../utils/google_utils';
import AddNewMediaModal from './AddNewMediaModal.js';
import {changePlayStateAction,
    changeYoutubeVideoObjectAction,
    addToQueue,
    setQueue} from "../actions/index";

class Queue extends Component {

    // contact server in this component to grab queue
    
    constructor(props) {
        super(props);
        this.socket = props.socket;
        
        this.playing = 1;
        this.paused = 2;
        this.buffering = 3;

        this.state = {
            showAddNewMediaModal: false,
            currentlyPlayingIndex: 0, //0 means no video is playing
        };
    }
    
    componentDidMount() {
        this.loadQueueRowEntriesFromServer();
    }
    
    loadQueueRowEntriesFromServer = () => {
        let QueueRowsInLocalstorage = localStorage.getItem('QueueRows');
        if (QueueRowsInLocalstorage !== null) {
            this.props.setQueue(JSON.parse(QueueRowsInLocalstorage));
        }
    };
        
    setYoutubeVideoObjectAPICallback = (event) => {
        // this.setState({
        //     currentlyPlayingYoutubeVideoObject: event.target
        // });
        this.props.changeYoutubeVideoObject(event.target);
    };

    youtubeVideoStateChangedAPICallback = (event) => {
        //youtubeAPI: 0->ended 1->playing   2->paused   3->buffering
        let youtubeState = this.props.currentlyPlayingYoutubeVideoObject.getPlayerState();
        if (youtubeState === 0) { // ended
            this.props.changePlayState(this.paused);
            this.setState(prevState => ({
                currentlyPlayingIndex: (((prevState.currentlyPlayingIndex) + 1)%(this.props.QueueRowEntries.length + 1))
            }))
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
        //todo remove this once server response is added
        this.props.addToQueue(rowData);
    };
    
    toggleAddNewMediaModal = () => {
        this.setState({
            showAddNewMediaModal: !this.state.showAddNewMediaModal
        });
    };

    
    rowEntryPlayButtonClicked = (entryNumber) => {
        console.log(this.props.playState);
        if (entryNumber !== this.state.currentlyPlayingIndex) {
            this.setState({
                currentlyPlayingIndex: entryNumber
            });
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
    }
    
    render() {
        var QueueRowEntries = []
        for(var i = 0; i < this.props.QueueRowEntries.length; i++) {
            QueueRowEntries.push(
                <QueueRowEntry 
                    key={i}
                    rowID={i+1} 
                    rowData={this.props.QueueRowEntries[i]}
                    playState={this.props.playState}
                    currentlyPlayingIndex={this.state.currentlyPlayingIndex}
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
                {this.state.currentlyPlayingIndex !== 0 && 
                    getEmbededVideoComponent(this.props.QueueRowEntries[this.state.currentlyPlayingIndex-1].id,
                                            this.setYoutubeVideoObjectAPICallback,
                                            this.youtubeVideoStateChangedAPICallback,
                                            64*3,
                                            39*3)}
            </div>
            );
    }

}

const mapStateToProps = state => {
    return {
        playState : state.playState,
        currentlyPlayingYoutubeVideoObject: state.youtubeVideoObject,
        QueueRowEntries: state.QueueRowEntries
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePlayState : playState => dispatch(changePlayStateAction(playState)),
        changeYoutubeVideoObject: youtubeVideoObject => dispatch(changeYoutubeVideoObjectAction(youtubeVideoObject)),
        addToQueue: rowData => dispatch(addToQueue(rowData)),
        setQueue: newQueue => dispatch(setQueue(newQueue))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Queue)
