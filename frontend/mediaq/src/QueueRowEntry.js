import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PauseIcon from 'open-iconic/svg/media-pause.svg';
import PlayIcon from 'open-iconic/svg/media-play.svg';
import BufferIcon from 'open-iconic/svg/aperture.svg';


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
        var img_alt = '';
        var src = null;
        var color = '';
        if (this.props.currentlyPlayingIndex !== this.props.entryNumber) { //not current video
            img_alt = 'play';
            src = PlayIcon;
            color = 'primary';
        } else {
            if (this.props.playState === 1) { //playing -> show pause icon
                img_alt = 'pause';
                src = PauseIcon;
                color = 'warning';
            } else if (this.props.playState === 2) { //paused -> show play icon
                img_alt = 'play';
                src = PlayIcon;
                color = 'primary';
            } else if (this.props.playState === 3) { //buffering
                img_alt = 'buffer';
                src = BufferIcon;
                color = 'danger';
            } else { //-1 unstarted || 0 ended || 5 video cued ??? just show buffer
                img_alt = 'buffer';
                src = BufferIcon;
                color = 'danger';
            }
        }
        return (
            <tr>
                <th scope="row">{this.props.entryNumber + ':'}</th>
                <td>
                    <Button onClick={this.playButtonClicked} color={color}>
                        <img alt={img_alt} 
                            src={src} />
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
