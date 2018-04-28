import React, { Component } from 'react';
import { Container, Jumbotron } from 'reactstrap';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import * as mediaStates from '../constants/media';
import { mediaType } from '../constants/queue';

import { changePlayState, changeMediaObject, playNextMedia, setVolume, changeMediaType } from '../actions/index'
import { NO_MEDIA_PLAYING, MAX_VOLUME } from '../constants/queue';
import { getYoutubeVideoVolume } from '../utils/google_utils';

class MediaView extends Component {
    constructor(props) {
        super(props);

        //https://developers.google.com/youtube/player_parameters
        this.youtubeVars = {
            autoplay: 1,
            rel: 0,
            enablejsapi: 1,
            controls: 1,
            showinfo: 1,
        };
    }

    componentDidMount() {
        this.youtubeVolumeListener = setInterval(() => {
            if (this.props.visibleQueue[this.props.currentlyPlayingIndex].source === mediaType.YOUTUBE && window['YT']) {
                let widget = window['YT'].get('widget2');
                console.log(widget);
                let volumeLevel = getYoutubeVideoVolume(widget);
                if (volumeLevel != this.props.volumeLevel) {
                    this.props.setVolume(volumeLevel);
                }
            }
        }, mediaStates.CHECK_YOUTUBE_VOLUME_INTERVAL_MS);
    }

    componentWillUnmount() {
        if (this.youtubeVolumeListener) {
            clearInterval(this.youtubeVolumeListener);
        }
    }

    playerOnReady = (ref) => {
        this.props.changeMediaObject(ref);
        let media = mediaType.OTHER;
        if (this.props.visibleQueue[this.props.currentlyPlayingIndex].source === mediaType.YOUTUBE) {
            media = mediaType.YOUTUBE;
        }
        this.props.changeMediaType(media);
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
        let url = '';
        if (this.props.currentlyPlayingIndex != NO_MEDIA_PLAYING) {
            url = this.props.visibleQueue[this.props.currentlyPlayingIndex].link;
        }
        return (
            <Jumbotron style={{marginBottom: '.5em'}}>
                <Container>
                    <Container style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <ReactPlayer
                            style={{ position: 'absolute', top: 0, left: 0 }}
                            url={url}
                            width={'100%'}
                            height={'100%'}
                            config={{
                                youtube: {
                                    preload: true,
                                    playerVars: this.youtubeVars
                                },
                                twitch: {
                                    options: {
                                        chat: 'mobile'
                                    }
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
                </Container>
            </Jumbotron>
        )
    }
}

const mapStateToProps = state => {
    return {
        playState: state.semiRoot.playState,
        mediaObject: state.semiRoot.mediaObject,
        mediaType: state.semiRoot.mediaType,
        currentlyPlayingIndex: state.semiRoot.currentlyPlayingIndex,
        volumeLevel: state.semiRoot.volumeLevel,
        repeatMode: state.semiRoot.repeatMode,
        visibleQueue: state.semiRoot.visibleQueue
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changePlayState: playState => dispatch(changePlayState(playState)),
        changeMediaObject: mediaObject => dispatch(changeMediaObject(mediaObject)),
        changeMediaType: mediaType => dispatch(changeMediaType(mediaType)),
        playNextMedia: () => dispatch(playNextMedia()),
        setVolume: newVolumeLevel => dispatch(setVolume(newVolumeLevel)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaView)
