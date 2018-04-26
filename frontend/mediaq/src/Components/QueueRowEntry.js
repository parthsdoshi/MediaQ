import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';

import MediaPlayPauseButton from './MediaPlayPauseButton';
import * as youtubeStates from '../constants/youtube';
import youTubeLogo from '../youtube.png'

class QueueRowEntry extends Component {

    playButtonClicked = (buttonID) => {
        //buttonID is the same as this.props.rowID in this case
        this.props.rowEntryPlayButtonClicked(this.props.rowID);
    };

    render() {
        // if video is not currently selected video then show play icon because video is paused.
        let buttonState = this.props.currentlyPlayingIndex !== this.props.rowID ?
            youtubeStates.PAUSED : this.props.playState;
        return (
            <tr>
                <th scope="row">{this.props.rowID + 1 + ':'}</th>
                <td>
                    <MediaPlayPauseButton buttonClickedCallback={this.playButtonClicked}
                        buttonID={this.props.rowID}
                        playState={buttonState} />
                </td>
                <td>{this.props.rowData.title}</td>
                <td>{this.props.rowData.author}</td>
                <td>{this.props.rowData.album}</td>
                <td>
                    <a href={this.props.rowData.link}
                        target="_blank" style={{ display: "table-cell" }}>
                        <img src={youTubeLogo} style={{ width: 34, height: 38 }}
                            alt="youtube logo" />
                    </a>
                </td>
                <td />
                {this.props.deletionMode && <td>
                    <Input type="checkbox" onClick={() => this.props.rowEntryCheckboxClicked(this.props.rowData.timestamp)} />
                </td>}
                {!this.props.deletionMode && <td />}
            </tr>
        );
    }

}

export default QueueRowEntry
