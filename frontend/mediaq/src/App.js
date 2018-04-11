import React, { Component } from 'react';
import { Container } from 'reactstrap';
import io from 'socket.io-client'

import Header from './Header';
import InitialConnect from './InitialConnect';
import Queue from './Queue';

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false,
            connectionEstablished: false,
            displayName: '',
            qID: ''
        };

    }

    componentDidMount() {
        this.socket = io('http://' + document.domain + ':' + window.location.port);
        this.socket.on('connect', (data) => {
            this.setState({connectionEstablished: true});
        });
    }

    setDisplayNameCallback = (displayName) => {
        if(displayName === '') { //user canceled login screen
            this.setState({
                loggedIn: false,
                displayName: '',
                qID: ''
            });
            return;
        }
        this.setState({
            loggedIn: true,
            displayName: displayName
        });
    }

    setQIDCallback = (qID) => {
        this.setState({
            qID: qID
        });
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
                            setDisplayNameCallback={this.setDisplayNameCallback}
                            setQIDCallback={this.setQIDCallback}/>
                        }
                        {this.state.loggedIn &&
                        <div>
                            <Container>
                                <Queue />
                            </Container>
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
