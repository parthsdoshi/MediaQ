import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Search from './Search';
import PauseIcon from 'open-iconic/svg/media-pause.svg';
import PlayIcon from 'open-iconic/svg/media-play.svg';
import PlusIcon from 'open-iconic/svg/plus.svg';
import QueueRowEntry, { RowData } from './QueueRowEntry';
import { getEmbededVideoComponent } from './google_utils';

class Queue extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props);

        this.socket = props.socket;

        this.state = {
            searchBoxText: '',
            addNewSongmodal: false,
            QueueRowEntries: [],
            currentlyPlayingIndex: 0, //0 means no video is playing
            video: ''
        };
    }

    searchModalToggle = () => {
        this.setState({
            addNewSongmodal: !this.state.addNewSongmodal
        });
    }

    
    insertTableEntry = (tableEntry) => {
        this.state.QueueRowEntries.push(tableEntry);
    }

    loadVideoCallback = (rowData) => {
        console.log(rowData);
        this.socket.emit('addToQueue', {data: rowData});
        this.setState({
            addNewSongmodal: false
        });
        //todo remove this once server response is added
        this.insertTableEntry(rowData);
    }
    
    rowEntryPlayButtonClicked = (entryNumber) => {
        this.setState({
            currentlyPlayingIndex: entryNumber
        });
    }

    render() {
        var QueueRowEntries = []
        for(var i = 0; i < this.state.QueueRowEntries.length; i++) {
            QueueRowEntries.push(
                <QueueRowEntry 
                entryNumber={i+1} 
                rowData={this.state.QueueRowEntries[i]}
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
                            <th>#</th>
                            <th>Play/Pause</th>
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
                    getEmbededVideoComponent(this.state.QueueRowEntries[this.state.currentlyPlayingIndex-1].id)}
            </div>
            );
    }

}

export default Queue
