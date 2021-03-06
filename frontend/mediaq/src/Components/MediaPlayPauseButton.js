import React, { Component } from 'react';
import { Button } from 'reactstrap';

import PauseIcon from 'open-iconic/svg/media-pause.svg';
import PlayIcon from 'open-iconic/svg/media-play.svg';
import BufferIcon from 'open-iconic/svg/aperture.svg';

import * as mediaStates from "../constants/media";

class MediaPlayPauseButton extends Component {

    playButtonClicked = () => {
        this.props.buttonClickedCallback(this.props.buttonID);
    };

    render() {
        let img_alt = '';
        let src = null;
        let color = '';
        if (this.props.buffering) {
            img_alt = 'buffer';
            src = BufferIcon;
            color = 'danger';
        } else if (this.props.playState === mediaStates.PLAYING) {
            img_alt = 'pause';
            src = PauseIcon;
            color = 'warning';
        } else if (this.props.playState === mediaStates.PAUSED) {
            img_alt = 'play';
            src = PlayIcon;
            color = 'primary';
        } else {
            //don't know what to do, just show buffering
            console.log('this.props.playState unknown value encountered ' + this.props.playState);
            img_alt = 'buffer';
            src = BufferIcon;
            color = 'danger';
        }
        const style = {
            fill: 'blue',
            stroke: 'blue',
            width: '8px',
            height: '8px'
        };
        return (
            <Button onClick={this.playButtonClicked} color={color}>
                <img alt={img_alt} style={style} src={src} />
            </Button>
        );
    }

}

export default MediaPlayPauseButton
