import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';

import Header from './Header';
import InitialConnect from './InitialConnect';
import Queue from './Queue';
import Footer from './Footer';

class App extends Component {

    render() {
        let paddingTopStyle = {
            paddingTop: 50
        };
        // TODO: use Fade reactstrap component to make below look better if we have time
        return (
            <div className="App">
                <Header />
                <div style={paddingTopStyle}>
                    {!this.props.loggedIn &&
                    <InitialConnect />
                    }
                    {this.props.loggedIn &&
                    <div>
                        <Container>
                            <Queue />
                        </Container>
                    </div>
                    }
                </div>
                <Footer />
            </div>
            );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn : state.loggedIn,
    }
};

export default connect(
    mapStateToProps
)(App)
