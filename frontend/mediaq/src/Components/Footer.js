import React, { Component } from 'react';
import {
    Button,
    Collapse,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    Container } from 'reactstrap';
import { connect } from 'react-redux';

import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css';

import SeekAheadIcon from 'open-iconic/svg/media-skip-forward.svg';
import SeekBehindIcon from 'open-iconic/svg/media-skip-backward.svg';
import PrevMediaIcon from 'open-iconic/svg/media-step-backward.svg';
import NextMediaIcon from 'open-iconic/svg/media-step-forward.svg';

import {
    seekSecondsAhead,
    decrementCurrentlyPlayingIndex,
    incrementCurrentlyPlayingIndex,
    setVolume
} from "../actions/index";
import MediaPlayPauseButton from './MediaPlayPauseButton.js';


class Footer extends Component {
    constructor(props) {
        super(props);

        this.playing = 1;
        this.paused = 2;
        this.buffering = 3;

        this.style = {
            backgroundColor: "#F8F8F8",
            borderTop: "1px solid #E7E7E7",
            textAlign: "center",
            padding: "0px",
            position: "fixed",
            left: "0",
            bottom: "0",
            height: "60px",
            width: "100%",
        };

        this.phantom = {
          display: 'block',
          padding: '0px',
          height: '60px',
          width: '100%',
        };
    }

    playButtonClicked = (entryNumber) => {
        if (this.props.currentlyPlayingIndex === 0) {
            //no media is playing and play button is pressed, play first in queue
            this.props.incrementCurrentlyPlayingIndex();
        }
        if (this.props.currentlyPlayingYoutubeVideoObject === null) {
            // youtube haven't given back the object yet
        } else {
            if (this.props.playState === this.paused || this.props.playState === this.buffering) {
                this.props.currentlyPlayingYoutubeVideoObject.playVideo();
            } else if (this.props.playState === this.playing) {
                this.props.currentlyPlayingYoutubeVideoObject.pauseVideo()
            }
        }
    };

    seekBehindButtonClicked = () => {
        this.props.seekSecondsAhead(-5);
    };

    seekAheadButtonClicked = () => {
        this.props.seekSecondsAhead(5);
    };

    handleChangeVolumeSlider = (value) => {
        this.props.setVolume(value);
    };

    render() {
        const paddingRight = {paddingLeft: 2};
        return (
            <div>
                <div style={this.phantom} />
                <div style={this.style}>
                    <Navbar color="light" light expand="md">
                        <Container fluid>
                            <Nav className="mx-auto" navbar>
                                <NavItem style={paddingRight}>
                                    <Button onClick={this.props.decrementCurrentlyPlayingIndex} color={'primary'}>
                                        <img alt={'prev_media'}
                                             src={PrevMediaIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingRight}>
                                    <Button onClick={this.seekBehindButtonClicked} color={'primary'}>
                                        <img alt={'seek_behind'}
                                             src={SeekBehindIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingRight}>
                                    <MediaPlayPauseButton playState={this.props.playState}
                                                          buttonID={-1}
                                                          buttonClickedCallback={this.playButtonClicked} />
                                </NavItem>
                                <NavItem style={paddingRight}>
                                    <Button onClick={this.seekAheadButtonClicked} color={'primary'}>
                                        <img alt={'seek_ahead'}
                                             src={SeekAheadIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingRight}>
                                    <Button onClick={this.props.incrementCurrentlyPlayingIndex} color={'primary'}>
                                        <img alt={'next_media'}
                                             src={NextMediaIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={{paddingLeft: 20, width:150}}>
                                    <div className='slider-horizontal'>
                                        <Slider
                                            min={0}
                                            max={100}
                                            value={this.props.volumeLevel}
                                            orientation='horizontal'
                                            onChange={this.handleChangeVolumeSlider}
                                        />
                                        <div className='value'>{this.props.volumeLevel}</div></div>
                                </NavItem>
                            </Nav>
                        </Container>
                    </Navbar>
                </div>
            </div>
            );
    }
}


const mapStateToProps = state => {
    return {
        playState : state.playState,
        currentlyPlayingIndex: state.currentlyPlayingIndex,
        currentlyPlayingYoutubeVideoObject: state.youtubeVideoObject,
        volumeLevel: state.volumeLevel
    }
};

const mapDispatchToProps = dispatch => {
    return {
        seekSecondsAhead: seconds => dispatch(seekSecondsAhead(seconds)),
        decrementCurrentlyPlayingIndex: () => dispatch(decrementCurrentlyPlayingIndex()),
        incrementCurrentlyPlayingIndex: () => dispatch(incrementCurrentlyPlayingIndex()),
        setVolume: newVolumeLevel => dispatch(setVolume(newVolumeLevel))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer)
