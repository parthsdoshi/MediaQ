import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PauseIcon from 'open-iconic/svg/media-pause.svg';
import PlayIcon from 'open-iconic/svg/media-play.svg';
import BufferIcon from 'open-iconic/svg/aperture.svg';

class MediaPlayPauseButton extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props);
        //this.props.buttonClickedCallback
        //this.props.buttonID
        //this.props.playState
        
    }
    
    playButtonClicked = () => {
        this.props.buttonClickedCallback(this.props.buttonID);
    }

    render() {
        var img_alt = '';
        var src = null;
        var color = '';
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
        return (
            <Button onClick={this.playButtonClicked} color={color}>
            <img alt={img_alt} style={{
                fill: 'blue',
                stroke: 'blue'
            }}
                src={src} />
            </Button>
        );
    }

}

export default MediaPlayPauseButton
