import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { Container } from 'reactstrap';
import io from 'socket.io-client'

import Header from './Header';
import InitialConnect from './InitialConnect';
import Queue from './Queue';
import Search from './Search';

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false,
            connectionEstablished: false,
            displayName: '',
            qID: ''
            };

        this.loggedInCallback = this.loggedInCallback.bind(this);
        this.setDisplayNameCallback = this.setDisplayNameCallback.bind(this);
        
    }

    componentDidMount() {
        this.socket = io('http://' + document.domain + ':' + window.location.port);
        this.socket.on('connect', (data) => {
            this.setState({connectionEstablished: true});
        });
    }

    loggedInCallback(groupid) {
        console.log(groupid);
        this.setState({loggedIn: true});
    }
    
    setDisplayNameCallback(displayName, qID) {
        this.setState({
            displayName: displayName,
            qID: qID});
    }


    render() {
        const paddingTopStyle = {
            paddingTop: 50
        };
        /*const opts = {
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
        }*/
        // TODO: use Fade reactstrap component to make below look better if we have time
        return (
            <div className="App">
                <Header displayName={this.state.displayName} qID={this.state.qID} />
                    <div style={paddingTopStyle}>
                    {this.state.connectionEstablished &&
                        <div>
                            {!this.state.loggedIn &&
                                <InitialConnect socket={this.socket}
                                    setDisplayNameCallback={this.setDisplayNameCallback} />
                            }
                            {this.state.loggedIn &&
                                <div>
                                    <Container>
                                        <Queue />
                                    </Container>
                                    <Search />
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
            );
    }
}

export default App;
