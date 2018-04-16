import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';

import Header from './Header';
import InitialConnect from './InitialConnect';
import Queue from './Queue';
import Footer from './Footer';
import { login, setDisplayName, setQID } from "../actions";

class App extends Component {

    componentDidMount() {
        window.onbeforeunload = confirmExit;
        function confirmExit()
        {
            if (this.props.loggedIn) {
                this.props.socket.emit('leave', {'displayName': 'master3243', 'qID': 'HKXX'});
            }
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
                    </div>
                    }
                </div>
                }
                <Footer />
            </div>
            );
    }
}

const mapStateToProps = state => {
    return {
        socket: state.socket,
        loggedIn: state.loggedIn,
        displayName: state.displayName,
        qID: state.qID
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setDisplayName: displayName => dispatch(setDisplayName(displayName)),
        setQID : qID => dispatch(setQID(qID)),
        login: () => dispatch(login()),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
