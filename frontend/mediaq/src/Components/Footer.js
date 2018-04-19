import React, { Component } from 'react';
import {
    Button,
    Navbar,
    Nav,
    NavItem,
    Container } from 'reactstrap';

import Slider from 'react-rangeslider'
import SeekAheadIcon from 'open-iconic/svg/media-skip-forward.svg';
import SeekBehindIcon from 'open-iconic/svg/media-skip-backward.svg';
import PrevMediaIcon from 'open-iconic/svg/media-step-backward.svg';
import NextMediaIcon from 'open-iconic/svg/media-step-forward.svg';
import ShuffleIcon from 'open-iconic/svg/random.svg';

import { connect } from 'react-redux';
import {
    seekSecondsAhead,
    decrementCurrentlyPlayingIndex,
    incrementCurrentlyPlayingIndex,
    setVolume,
    toggleShuffle } from "../actions/index";

import MediaPlayPauseButton from './MediaPlayPauseButton';
import * as youtubeStates from '../constants/youtube';

class Footer extends Component {
    constructor(props) {
        super(props);

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
            if (this.props.playState === youtubeStates.PAUSED || this.props.playState === youtubeStates.BUFFERING) {
                this.props.currentlyPlayingYoutubeVideoObject.playVideo();
            } else if (this.props.playState === youtubeStates.PLAYING) {
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
        const paddingLeft = {paddingLeft: 2};
        const volumeSlider = {paddingLeft: 20, width:150};
        return (
            <div>
                <div style={this.phantom} />
                <div style={this.style}>
                    <Navbar color="light" light expand="md">
                        <Container fluid>
                            <Nav className="mx-auto" navbar>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.props.toggleShuffle} color={'primary'}
                                            active={this.props.shuffleMode}
                                            style={{backgroundColor:this.props.shuffleMode ?
                                                    'blue':''}}>
                                        <img alt={'shuffle'}
                                             src={ShuffleIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.props.decrementCurrentlyPlayingIndex} color={'primary'}>
                                        <img alt={'prev_media'}
                                             src={PrevMediaIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.seekBehindButtonClicked} color={'primary'}>
                                        <img alt={'seek_behind'}
                                             src={SeekBehindIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <MediaPlayPauseButton playState={this.props.playState}
                                                          buttonID={-1}
                                                          buttonClickedCallback={this.playButtonClicked} />
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.seekAheadButtonClicked} color={'primary'}>
                                        <img alt={'seek_ahead'}
                                             src={SeekAheadIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.props.incrementCurrentlyPlayingIndex} color={'primary'}>
                                        <img alt={'next_media'}
                                             src={NextMediaIcon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={volumeSlider}>
                                    <div className='slider-horizontal'>
                                        <link rel="stylesheet" href="https://unpkg.com/react-rangeslider/umd/rangeslider.min.css" />
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
        volumeLevel: state.volumeLevel,
        shuffleMode: state.shuffleMode
    }
};

const mapDispatchToProps = dispatch => {
    return {
        seekSecondsAhead: seconds => dispatch(seekSecondsAhead(seconds)),
        decrementCurrentlyPlayingIndex: () => dispatch(decrementCurrentlyPlayingIndex()),
        incrementCurrentlyPlayingIndex: () => dispatch(incrementCurrentlyPlayingIndex()),
        setVolume: newVolumeLevel => dispatch(setVolume(newVolumeLevel)),
        toggleShuffle: () => dispatch(toggleShuffle())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer)
