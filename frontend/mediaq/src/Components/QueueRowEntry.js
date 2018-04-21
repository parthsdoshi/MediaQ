import React, { Component } from 'react';
import { Button } from 'reactstrap';

import MinusIcon from 'open-iconic/svg/minus.svg';

import MediaPlayPauseButton from './MediaPlayPauseButton';
import * as youtubeStates from '../constants/youtube';

class QueueRowEntry extends Component {

    playButtonClicked = (buttonID) => {
        //buttonID is the same as this.props.rowID in this case
        this.props.rowEntryPlayButtonClicked(this.props.rowID);
    };

    render() {
        // if video is not currently selected video then show play icon because video is paused.
        let buttonState = this.props.currentlyPlayingIndex !== this.props.rowID ?
            youtubeStates.PAUSED: this.props.playState;
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
                {/*<td>*/}
                    {/*<Button color="danger">*/}
                        {/*<img alt="Remove to Queue" src={MinusIcon} />*/}
                    {/*</Button>*/}
                {/*</td>*/}

            </tr>
        );
    }

}

export default QueueRowEntry
