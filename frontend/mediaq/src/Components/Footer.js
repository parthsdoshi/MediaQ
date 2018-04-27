import React, { Component } from 'react';
import {
    Button,
    Navbar,
    Nav,
    NavItem,
    Container
} from 'reactstrap';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import SeekAheadIcon from 'open-iconic/svg/media-skip-forward.svg';
import SeekBehindIcon from 'open-iconic/svg/media-skip-backward.svg';
import PrevMediaIcon from 'open-iconic/svg/media-step-backward.svg';
import NextMediaIcon from 'open-iconic/svg/media-step-forward.svg';
import ShuffleIcon from 'open-iconic/svg/random.svg';
import RepeatIcon from 'open-iconic/svg/loop-circular.svg'
import info from 'open-iconic/svg/info.svg';

import { connect } from 'react-redux';
import {
    seekSecondsAhead,
    playPreviousMedia,
    playNextMedia,
    changePlayState,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleMediaDetailModal,
    deleteCheckedRows
} from "../actions/index";

import MediaPlayPauseButton from './MediaPlayPauseButton';
import * as mediaStates from '../constants/media';
import { NO_MEDIA_PLAYING, MIN_VOLUME, MAX_VOLUME } from '../constants/queue'

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
        if (this.props.currentlyPlayingIndex === NO_MEDIA_PLAYING) {
            //no media is playing and play button is pressed, play first in queue
            this.props.playNextMedia();
            // }
            // if (this.props.currentlyPlayingYoutubeVideoObject === null) {
            // youtube haven't given back the object yet
        } else {
            if (this.props.playState === mediaStates.PAUSED || this.props.playState === mediaStates.BUFFERING) {
                this.props.changePlayState(mediaStates.PLAYING)
                // this.props.currentlyPlayingYoutubeVideoObject.playVideo();
            } else if (this.props.playState === mediaStates.PLAYING) {
                this.props.changePlayState(mediaStates.PAUSED)
                // this.props.currentlyPlayingYoutubeVideoObject.pauseVideo()
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
        const paddingLeft = { paddingLeft: 2 };
        const volumeSlider = { paddingLeft: 20, width: 150, paddingRight: 20, paddingTop: 13 };
        let icon = {
            width: '8px',
            height: '8px'
        };
        return (
            <div style={this.phantom}>
                <div style={this.style}>
                    <Navbar color="light" light expand="md">
                        <Container>
                            {!this.props.deletionMode && <Nav className="mx-auto" navbar>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.props.toggleRepeat} color={'primary'}
                                        active={this.props.repeatMode}
                                        style={{
                                            backgroundColor: this.props.repeatMode ?
                                                'blue' : ''
                                        }}>
                                        <img alt={'repeat'} src={RepeatIcon} style={icon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.props.toggleShuffle} color={'primary'}
                                        active={this.props.shuffleMode}
                                        style={{
                                            backgroundColor: this.props.shuffleMode ?
                                                'blue' : ''
                                        }}>
                                        <img alt={'shuffle'} src={ShuffleIcon} style={icon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.props.decrementCurrentlyPlayingIndex} color={'primary'}>
                                        <img alt={'prev_media'} src={PrevMediaIcon} style={icon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.seekBehindButtonClicked} color={'primary'}>
                                        <img alt={'seek_behind'} src={SeekBehindIcon} style={icon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <MediaPlayPauseButton playState={this.props.playState}
                                        buffering={this.props.buffering}
                                        buttonID={-1}
                                        buttonClickedCallback={this.playButtonClicked} />
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.seekAheadButtonClicked} color={'primary'}>
                                        <img alt={'seek_ahead'} src={SeekAheadIcon} style={icon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={this.props.playNextMedia} color={'primary'}>
                                        <img alt={'next_media'} src={NextMediaIcon} style={icon} />
                                    </Button>
                                </NavItem>
                                <NavItem style={volumeSlider}>
                                    <Slider
                                        max={MAX_VOLUME}
                                        min={MIN_VOLUME}
                                        step={.2}
                                        vertical={false}
                                        onChange={this.handleChangeVolumeSlider}
                                        value={this.props.volumeLevel}
                                    />
                                </NavItem>
                                <NavItem style={paddingLeft}>
                                    <Button onClick={() => { this.props.toggleMediaDetailModal() }} color="secondary"
                                        className="rounded-circle">
                                        <img alt="More Info" src={info} style={icon} />
                                    </Button>
                                </NavItem>
                            </Nav>}
                            {this.props.deletionMode && <Nav className="mx-auto">
                                <NavItem>
                                    <Button onClick={this.props.deleteCheckedRows} color="danger">
                                        Delete Selected Media
                                    </Button>
                                </NavItem>
                            </Nav>}
                        </Container>
                    </Navbar>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        playState: state.semiRoot.playState,
        currentlyPlayingIndex: state.semiRoot.currentlyPlayingIndex,
        currentlyPlayingYoutubeVideoObject: state.semiRoot.youtubeVideoObject,
        volumeLevel: state.semiRoot.volumeLevel,
        shuffleMode: state.semiRoot.shuffleMode,
        repeatMode: state.semiRoot.repeatMode,
        deletionMode: state.socket.deletionMode,
        buffering: state.semiRoot.buffering
    }
};

const mapDispatchToProps = dispatch => {
    return {
        seekSecondsAhead: seconds => dispatch(seekSecondsAhead(seconds)),
        decrementCurrentlyPlayingIndex: () => dispatch(playPreviousMedia()),
        playNextMedia: () => dispatch(playNextMedia()),
        changePlayState: playState => dispatch(changePlayState(playState)),
        setVolume: newVolumeLevel => dispatch(setVolume(newVolumeLevel)),
        toggleShuffle: () => dispatch(toggleShuffle()),
        toggleRepeat: () => dispatch(toggleRepeat()),
        toggleMediaDetailModal: () => dispatch(toggleMediaDetailModal()),
        deleteCheckedRows: () => dispatch(deleteCheckedRows())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer)
