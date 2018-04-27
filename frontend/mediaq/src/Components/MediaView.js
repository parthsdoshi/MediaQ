import React, { Component } from 'react';
import { Container } from 'reactstrap';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import * as mediaStates from '../constants/media'

import { changePlayState, changeMediaObject, playNextMedia, setVolume } from '../actions/index'
import { NO_MEDIA_PLAYING, MAX_VOLUME } from '../constants/queue';

class MediaView extends Component {

    playerOnReady = (ref) => {
        this.props.changeMediaObject(ref);
    };
    playerOnPause = () => {
        this.props.changePlayState(mediaStates.PAUSED)
    }
    playerOnPlay = () => {
        this.props.changePlayState(mediaStates.PLAYING)
    }
    playerOnBuffering = () => {
        this.props.changePlayState(mediaStates.BUFFERING)
    }
    playerOnEnd = () => {
        // this.props.changePlayState(mediaStates.PAUSED);
        this.props.playNextMedia();
    }

    render() {
        //https://developers.google.com/youtube/player_parameters
        const youtubeVars = {
            autoplay: 1,
            rel: 0,
            enablejsapi: 1,
            controls: 1,
            showinfo: 1,
        };

        let url = '';
        if (this.props.currentlyPlayingIndex != NO_MEDIA_PLAYING) {
            url = this.props.visibleQueue[this.props.currentlyPlayingIndex].link;
        }        
        return (
            <Container fluid style={{height: '70vh'}}>
                <ReactPlayer
                    url={url}
                    width={'100%'}
                    height={'100%'}
                    config={{
                        youtube: {
                            playerVars: youtubeVars
                        }
                    }}
                    ref={(ref) => { this.reactRef = ref }}
                    playing={this.props.playState === mediaStates.PLAYING}
                    volume={this.props.volumeLevel / MAX_VOLUME}
                    loop={this.props.repeatMode}
                    onReady={() => { this.playerOnReady(this.reactRef) }}
                    onStart={() => { console.log('onStart') }}
                    onPlay={this.playerOnPlay}
                    onProgress={(data) => {/* console.log('onProgress'); console.log(data); */ }}
                    onDuration={(data) => { console.log('onDuration'); console.log(data) }}
                    onPause={this.playerOnPause}
                    onBuffer={this.playerOnBuffering}
                    onSeek={(data) => { console.log('onSeek'); console.log(data); }}
                    onEnded={this.playerOnEnd}
                    onError={(data) => { console.log('onError'); console.log(data); }} />
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        playState: state.semiRoot.playState,
        mediaObject: state.semiRoot.mediaObject,
        currentlyPlayingIndex: state.semiRoot.currentlyPlayingIndex,
        volumeLevel: state.semiRoot.volumeLevel,
        repeatMode: state.semiRoot.repeatMode,
        visibleQueue: state.semiRoot.visibleQueue
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePlayState: playState => dispatch(changePlayState(playState)),
        changeMediaObject: youtubeVideoObject => dispatch(changeMediaObject(youtubeVideoObject)),
        playNextMedia: () => dispatch(playNextMedia()),
        setVolume: newVolumeLevel => dispatch(setVolume(newVolumeLevel)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaView)
