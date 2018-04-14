import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    Container } from 'reactstrap';
import MediaPlayPauseButton from './MediaPlayPauseButton.js';

import { connect } from 'react-redux';
import { changePlayState } from "../actions/index";

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
        if (this.props.currentlyPlayingYoutubeVideoObject === null) {
            // youtube haven't given back the object yet
        } else {
            if (this.props.playState === this.paused || this.props.playState === this.buffering) {
                this.props.currentlyPlayingYoutubeVideoObject.playVideo();
            } else if (this.props.playState === this.playing) {
                this.props.currentlyPlayingYoutubeVideoObject.pauseVideo()
            }
        }
    }


    render() {
        return (
            <div>
                <div style={this.phantom} />
                <div style={this.style}>
                    <Navbar color="light" light expand="md">
                        <Container fluid>
                            <Nav className="mx-auto" navbar>
                                <NavItem>
                                    <MediaPlayPauseButton playState={this.props.playState}
                                                          buttonID={-1}
                                                          buttonClickedCallback={this.playButtonClicked} />
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
        currentlyPlayingYoutubeVideoObject: state.youtubeVideoObject
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changePlayState : (playState) => dispatch({
            type : 'CHANGE_PLAY_STATE',
            payload: {playState: playState}
        })
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer)
