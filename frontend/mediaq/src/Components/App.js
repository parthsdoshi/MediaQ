import React, { Component } from 'react';
import { Container } from 'reactstrap';

import { connect } from 'react-redux';
import { login, resolveBrowserClose } from "../actions";

import Footer from './Footer';
import Header from './Header';
import InitialConnect from './InitialConnect';
import Queue from './Queue';

class App extends Component {

    componentDidMount() {
        console.log('4 5');
        window.onbeforeunload = confirmExit;
        let resolveBrowserClose = this.props.resolveBrowserClose;
        function confirmExit() {
            resolveBrowserClose();
        }
    }

    render() {
        let paddingTopStyle = {
            paddingTop: 50
        };
        // TODO: use Fade reactstrap component to make below look better if we have time
        return (
            <div className="App">
                <Header />
                {this.props.socket !== null &&
                <div style={paddingTopStyle}>
                    {!this.props.loggedIn &&
                    <InitialConnect/>
                    }
                    {this.props.loggedIn &&
                    <div>
                        <Container>
                            <Queue/>
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(login()),
        resolveBrowserClose: () => dispatch(resolveBrowserClose()),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
