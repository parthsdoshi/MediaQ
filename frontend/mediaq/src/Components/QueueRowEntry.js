import React, { Component } from 'react';
import {
    Button,
    Input,
    ListGroupItem, 
    ListGroupItemHeading, 
    ListGroupItemText,
    Row,
    Col
} from 'reactstrap';

import MediaPlayPauseButton from './MediaPlayPauseButton';
import * as mediaStates from '../constants/media';
import youTubeLogo from '../youtube.png'
import '../styles/queueRowEntry.css'

class QueueRowEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false
        };
    }

    componentDidUpdate() {
        if (!this.props.deletionMode && this.state.active) {
            this.setState({
                active: false
            });
        }
    }

    playButtonClicked = (buttonID) => {
        //buttonID is the same as this.props.rowID in this case
        this.props.rowEntryPlayButtonClicked(this.props.rowID);
    };

    onClick = () => {
        if (this.props.deletionMode) {
            this.setState({
                active: !this.state.active
            });
            this.props.rowEntryCheckboxClicked(this.props.rowData.timestamp);
        }
    }

    render() {
        // if video is not currently selected video then show play icon because video is paused.
        let buttonState = mediaStates.PAUSED;
        let buffering = false;
        let color = '';
        if (this.props.currentlyPlayingIndex === this.props.rowID) {
            buttonState = this.props.playState;
            buffering = this.props.buffering;
            color = 'secondary'
        }

        return (
            <ListGroupItem action active={this.props.deletionMode && this.state.active} onClick={this.onClick} color={color} className="queueRowEntryListGroupItem">
                <ListGroupItemHeading>
                    {this.props.rowData.title}
                </ListGroupItemHeading>
                <Row>
                    <Col xs="1" md="1">
                        {this.props.rowID + 1 + ':'}
                    </Col>
                    <Col xs="2" md="1">
                        <MediaPlayPauseButton buttonClickedCallback={this.playButtonClicked}
                            buffering={buffering}
                            buttonID={this.props.rowID}
                            playState={buttonState} />
                    </Col>
                    <Col xs="5" md="4">
                        {this.props.rowData.author}
                    </Col>
                    <Col xs="4" md="4">
                        {this.props.rowData.album}
                    </Col>
                    <Col xs="12" md="2">
                        <a href={this.props.rowData.link} target="_blank">
                            <img src={youTubeLogo} style={{ width: 34, height: 38 }}
                                alt="youtube logo" />
                        </a>
                    </Col>
                </Row>
            </ListGroupItem>
        )
    }

}

export default QueueRowEntry
