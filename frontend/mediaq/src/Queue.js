import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Search from './Search';
import PlusIcon from 'open-iconic/svg/plus.svg';
import QueueRowEntry from './QueueRowEntry';
import { getEmbededVideoComponent } from './google_utils';

class Queue extends Component {

    // contact server in this component to grab queue
    
    constructor(props) {
        super(props);

        this.socket = props.socket;
        
        this.playing = 1;
        this.paused = 2;
        this.buffering = 3;
        

        this.state = {
            searchBoxText: '',
            addNewSongmodal: false,
            QueueRowEntries: [],
            currentlyPlayingIndex: 0, //0 means no video is playing
            currentlyPlayingYoutubeVideoObject: null,
            playState: this.paused
        };
    }
    
    setYoutubeVideoObjectAPICallback = (event) => {
        this.setState({
            currentlyPlayingYoutubeVideoObject: event.target
        });
    }

    youtubeVideoStateChangedAPICallback = (event) => {
        //youtubeAPI: 0->ended 1->playing   2->paused   3->buffering
        var youtubeState = this.state.currentlyPlayingYoutubeVideoObject.getPlayerState();
        if (youtubeState === 0) { // ended
            this.setState({
                playState: this.paused
            });
            this.setState(prevState => ({
                currentlyPlayingIndex: (((prevState.currentlyPlayingIndex) + 1)%(prevState.QueueRowEntries.length + 1))
            }))
        }
        if (this.state.playState !== this.playing && youtubeState === this.playing) { // playing
            this.setState({
                playState: this.playing
            });
        }
        if (this.state.playState !== this.paused && youtubeState === this.paused) { // paused
            this.setState({
                playState: this.paused
            });
        }
        if (this.state.playState !== this.buffering && youtubeState === this.buffering) { // buffering
            this.setState({
                playState: this.buffering
            });
        }
    }

    searchModalToggle = () => {
        this.setState({
            addNewSongmodal: !this.state.addNewSongmodal
        });
    }

    loadVideoCallback = (rowData) => {
        console.log(rowData);
        this.socket.emit('addToQueue', {data: rowData});
        this.setState({
            addNewSongmodal: false
        });
        //todo remove this once server response is added
        this.setState(prevState => ({
            QueueRowEntries: [...prevState.QueueRowEntries, rowData]
        }))
    }
    
    rowEntryPlayButtonClicked = (entryNumber) => {
        if (entryNumber !== this.state.currentlyPlayingIndex) {
            this.setState({
                currentlyPlayingIndex: entryNumber
            });
        } else {
            if (this.state.playState === this.paused) {
                this.state.currentlyPlayingYoutubeVideoObject.playVideo();
            } else if (this.state.playState === this.playing || this.state.playState === this.buffering) {
                this.state.currentlyPlayingYoutubeVideoObject.pauseVideo()
            }
        }
    }
    
    render() {
        var QueueRowEntries = []
        for(var i = 0; i < this.state.QueueRowEntries.length; i++) {
            QueueRowEntries.push(
                <QueueRowEntry 
                entryNumber={i+1} 
                rowData={this.state.QueueRowEntries[i]}
                playState={this.state.playState}
                currentlyPlayingIndex={this.state.currentlyPlayingIndex}
                rowEntryPlayButtonClicked={this.rowEntryPlayButtonClicked} />
            );
        }
        return (
            <div>
                <Modal size='lg' 
                    isOpen={this.state.addNewSongmodal} 
                    toggle={this.toggle} 
                    className={this.props.className}>
                    <ModalHeader toggle={this.searchModalToggle}>
                        Add a new song
                    </ModalHeader>
                    <ModalBody>
                        <Search loadVideoCallback={this.loadVideoCallback}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.searchModalToggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
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
                                <Button onClick={this.searchModalToggle} color="primary">
                                    <img alt="Add to Queue" src={PlusIcon} />
                                </Button>{' '}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {QueueRowEntries}
                    </tbody>
                </Table>
                {this.state.currentlyPlayingIndex !== 0 && 
                    getEmbededVideoComponent(this.state.QueueRowEntries[this.state.currentlyPlayingIndex-1].id, 
                                            this.setYoutubeVideoObjectAPICallback,
                                            this.youtubeVideoStateChangedAPICallback,
                                            640,
                                            390)}
            </div>
            );
    }

}

export default Queue
