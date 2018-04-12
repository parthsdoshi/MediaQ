import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PauseIcon from 'open-iconic/svg/media-pause.svg';
import PlayIcon from 'open-iconic/svg/media-play.svg';

import Search from './Search'

export function RowData(id, title, author, album, source, thumbnail) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.album = album;
    this.source = source;
    this.thumbnail = thumbnail;
}

class QueueRowEntry extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props);
        
        //this.props.entryNumber;
        //this.props.rowData;
        //this.props.currentlyPlayingIndex
        //this.props.playState
        //this.props.rowEntryPlayButtonClicked;
    }
    
    playButtonClicked = () => {
        this.props.rowEntryPlayButtonClicked(this.props.entryNumber);
    }

    render() {
        return (
            <tr>
                <th scope="row">{this.props.entryNumber + ':'}</th>
                <td>
                    <Button onClick={this.playButtonClicked} color="primary">
                        <img alt={this.props.currentlyPlayingIndex == this.props.entryNumber && this.props.playState === 1 ? 'pause' : 'play'} 
                            src={this.props.currentlyPlayingIndex == this.props.entryNumber && this.props.playState === 1 ? PauseIcon : PlayIcon} />
                    </Button>
                </td>
                <td>{this.props.rowData.title}</td>
                <td>{this.props.rowData.author}</td>
                <td>{this.props.rowData.album}</td>
                <td>{this.props.rowData.source}</td>
            </tr>
        );
    }

}

export default QueueRowEntry
