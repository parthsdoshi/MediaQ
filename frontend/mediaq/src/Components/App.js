import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import { connect } from 'react-redux';
import { resolveBrowserClose } from "../actions";

import Footer from './Footer';
import Header from './Header';
import InitialConnect from './InitialConnect';
import Queue from './Queue';
import MediaView from './MediaView';
import { NO_MEDIA_PLAYING } from '../constants/queue';

class App extends Component {

    componentDidMount() {
        console.log('4 56 ');
        window.onbeforeunload = confirmExit;
        let resolveBrowserClose = this.props.resolveBrowserClose;
        function confirmExit() {
            resolveBrowserClose();
        }
    }

    render() {
        let paddingTopStyle = {
            paddingTop: '1em'
        };

        // TODO: use Fade reactstrap component to make below look better if we have time
        return (
            <div className="App">
                <Header />
                {this.props.socket !== null &&
                    <div style={paddingTopStyle}>
                        {!this.props.loggedIn &&
                            <InitialConnect />
                        }
                        {this.props.loggedIn &&
                            <div>
                                <Container fluid>
                                    <Row>
                                        <Col sm="12" md="6">
                                            {this.props.currentlyPlayingIndex != NO_MEDIA_PLAYING && <MediaView />}
                                        </Col>
                                        <Col sm="12" md="6">
                                            <Queue />
                                        </Col>
                                    </Row>
                                </Container>
                                <Footer />
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        socket: state.socket.socket,
        loggedIn: state.socket.loggedIn,
        currentlyPlayingIndex: state.semiRoot.currentlyPlayingIndex
    }
};

const mapDispatchToProps = dispatch => {
    return {
        resolveBrowserClose: () => dispatch(resolveBrowserClose()),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
