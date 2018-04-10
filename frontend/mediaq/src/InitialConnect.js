import React, { Component } from 'react';
import { Jumbotron, Button, Container } from 'reactstrap';

class InitialConnect extends Component {
    constructor(props) {
        super(props);

        this.callback = props.loggedInCallback;
        this.socket = props.socket;

        this.state = {

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
        // var request = new XMLHttpRequest();
        // request.onreadystatechange = () => {
        //     if (request.readyState == 4 && request.status == 200) {
        //         console.log(request.responseText);
        //     }
        // }
        // request.open("GET", "/create", true);

        // // send null since it's a GET request
        // request.send(null);
        this.socket.emit('create', {data: ''});
    }

    joinQueue() {
        // var request = new XMLHttpRequest();
        // request.onreadystatechange = () => {
        //     if (request.readyState == 4 && request.status == 200) {
        //         console.log(request.responseText);
        //     }
        // }
        // var requestString = "/join";
        // requestString += "?" + "queueid=" + 1;
        // request.open("GET", requestString, true);

        // // send null since it's a GET request
        // request.send(null);
        this.socket.emit('join', {data: ''});
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
                            <Button color="primary" onClick={this.createQueue}>Create a Queue</Button>
                            {' '}
                            <Button color="primary" onClick={this.joinQueue}>Join a Queue</Button>
                        </Container>
                    </Jumbotron>
                </Container>
            </div>
            );
    }
}

export default InitialConnect
