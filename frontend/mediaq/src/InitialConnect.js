import React, { Component } from 'react';
import { Jumbotron, Button, Container } from 'reactstrap';
import LoginScreen from './LoginScreen.js'

class InitialConnect extends Component {
    constructor(props) {
        super(props);
        
        this.setDisplayNameCallback = this.props.setDisplayNameCallback;
        this.socket = props.socket;

        this.state = {
            displayLoginScreen: false,
            userAction: ''
        };

        this.createQueue = this.createQueue.bind(this);
        this.joinQueue = this.joinQueue.bind(this);

        this.socket.on('create', (data) => {
            console.log(data);
        });
        this.socket.on('join', (data) => {
            console.log(data);
        });
    }

    createQueue() {
        this.setState({
            displayLoginScreen: true,
            userAction: 'Create a new queue'
        });
        this.socket.emit('create', {data: ''});
    }

    joinQueue() {
        this.setState({
            displayLoginScreen: true,
            userAction: 'Join an existing queue'
        });
        this.socket.emit('join', {data: ''});
    }
    
    hideLoginAndCallParentCallback = (displayName, qID) => {
        this.setState({
            displayLoginScreen: false,
            userAction: ''
        });
        this.setDisplayNameCallback(displayName, qID);
        
    }

    render() {
        return (
            <div>
                <Container>
                    <Jumbotron>
                        <h1 className="display-3 text-center">Please select an option.</h1>
                        <p className="lead text-center">Select Create if you would like to start a MediaQ or select Join if you want to join an already created MediaQ.</p>
                        <hr className="my-2" />
                        {false && 
                            <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                        }
                        <Container className="text-center">
                            <Button color="success" onClick={this.createQueue}>Create a Queue</Button>
                            {' '}
                            <Button color="primary" onClick={this.joinQueue}>Join a Queue</Button>
                        </Container>
                    </Jumbotron>
                </Container>
                {this.state.displayLoginScreen && <LoginScreen 
                                                    userAction={this.state.userAction}
                                                    hideLoginAndCallParentCallback={this.hideLoginAndCallParentCallback} />}
            </div>
            );
    }
}

export default InitialConnect
