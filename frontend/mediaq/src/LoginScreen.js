import React, { Component } from 'react';
import { InputGroup, Container, InputGroupButton, Label, Input, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class LoginScreen extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props)
        
        this.hideLoginAndCallParentCallback = this.props.hideLoginAndCallParentCallback;
        
        this.state = {
            displaynameBoxText: '',
            qIDBoxText: '',
            modal: true,
        };
        
        this.handleKeyboardKeyPress = this.handleKeyboardKeyPress.bind(this);
        this.handleTextChangeqID = this.handleTextChangeqID.bind(this);
        this.handleTextChangeDisplayname = this.handleTextChangeDisplayname.bind(this);
        this.callParent = this.callParent.bind(this);
    }
    

    handleKeyboardKeyPress(target) {
        if(target.charCode==13){
                this.callParent();
        }
    }

    handleTextChangeqID(event) {
        this.setState({qIDBoxText: event.target.value});
    }

    handleTextChangeDisplayname(event) {
        this.setState({displaynameBoxText: event.target.value});
    }

    cancel = () => {
        this.setState({
            modal: false
        });
        this.hideLoginAndCallParentCallback('', '');
    }
    
    callParent() {
        this.setState({
            modal: false
        });
        this.hideLoginAndCallParentCallback(this.state.displaynameBoxText, this.state.qIDBoxText);
    }

    
    render() {
        return (
            <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.modalTurnOff}>{this.props.userAction}</ModalHeader>
                    <ModalBody>
                        <InputGroup>
                            <Input placeholder="Display Name" onKeyPress={this.handleKeyboardKeyPress} onChange={this.handleTextChangeqID} />
                        </InputGroup>
                        <InputGroup>
                            <Input placeholder="Queue ID" onKeyPress={this.handleKeyboardKeyPress} onChange={this.handleTextChangeDisplayname} />
                        </InputGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.callParent}>Start</Button>
                        <Button color="secondary" onClick={this.cancel}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            );
    }

}

export default LoginScreen
