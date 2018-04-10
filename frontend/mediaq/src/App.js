import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { Container } from 'reactstrap';

import Header from './Header';
import Queue from './Queue';
import Search from './Search';

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {};

        this.loggedIn = this.loggedIn.bind(this);
    }

    loggedIn() {

    }

    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };

        var youtubevideos = []
        for (var i = 0; i < 1; i++) {
            youtubevideos.push (
                <YouTube
                    videoId="2g811Eo7K8U"
                    opts={opts}
                    onReady={this._onReady} />
                )
        }
        return (
            <div className="App">
                <Header />
                <Container>
                    <Queue />
                </Container>
            </div>
            );
    }
}

export default App;
