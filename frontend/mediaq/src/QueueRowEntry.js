import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MediaPlayPauseButton from './MediaPlayPauseButton.js';

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
        
        //this.props.rowID;
        //this.props.rowData;
        //this.props.currentlyPlayingIndex
        //this.props.playState
        //this.props.rowEntryPlayButtonClicked;
    }
    
    playButtonClicked = (buttonID) => {
        //buttonID is the same as this.props.rowID in this case
        this.props.rowEntryPlayButtonClicked(this.props.rowID);
    }

    render() {
        // if video is not currently selected video then show play icon because video is paused.
        var buttonState = this.props.currentlyPlayingIndex !== this.props.rowID ? 2 : this.props.playState;
        return (
            <tr>
                <th scope="row">{this.props.rowID + ':'}</th>
                <td>
                    <MediaPlayPauseButton buttonClickedCallback={this.playButtonClicked}
                                            buttonID={this.props.rowID}
                                            playState={buttonState}/>
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
