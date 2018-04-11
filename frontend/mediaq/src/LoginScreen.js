import React, { Component } from 'react';
import { InputGroup, Container, InputGroupButton, Label, Input, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PopupModal from './PopupModal'

class LoginScreen extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props)
        
        this.hideLoginAndCallParentCallback = this.props.hideLoginAndCallParentCallback;
        
        this.state = {
            displaynameBoxText: '',
            qIDBoxText: '',
            modal: true,
            showQIDInput: this.props.userAction === 'Create a new queue' ? false : true,
            warningModal: false,
            warningModalTitle: '',
            warningModalBody: ''
        };
    }
    

    handleKeyboardKeyPress = (target) => {
        if(target.charCode==13){
                this.callParent();
        }
    }

    handleTextChangeqID = (event) => {
        this.setState({qIDBoxText: event.target.value});
    }

    handleTextChangeDisplayname = (event) => {
        this.setState({displaynameBoxText: event.target.value});
    }

    cancel = () => {
        this.setState({
            modal: false
        });
        this.hideLoginAndCallParentCallback('', '');
    }
    
    callParent = () => {
        if (this.state.displaynameBoxText === '') {
            this.setState({
                warningModal: true,
                warningModalTitle: 'Display Name Empty',
                warningModalBody: 'Please input a display name.'
            });
            return;
        } 

        if (this.state.showQIDInput && this.state.qIDBoxText === '') {
            this.setState({
                warningModal: true,
                warningModalTitle: 'Queue ID Empty',
                warningModalBody: 'Please input a queue ID.'
            });
            return;
        }

        this.setState({
            modal: false
        });
        this.hideLoginAndCallParentCallback(this.state.displaynameBoxText, this.state.qIDBoxText);
    }
    
    hideWarning = () => {
        this.setState({
            warningModal: false,
            warningModalTitle: '',
            warningModalBody: ''
        });
    }


    
    render() {
        return (
            <div>
            <Modal isOpen={this.state.modal} className={this.props.className}>
                    <ModalHeader toggle={this.modalTurnOff}>{this.props.userAction}</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <Input placeholder="Display Name" onKeyPress={this.handleKeyboardKeyPress} onChange={this.handleTextChangeDisplayname} />
                        </div>
                        
                        { this.state.showQIDInput && 
                        <div className="form-group">
                            <Input placeholder="Queue ID" onKeyPress={this.handleKeyboardKeyPress} onChange={this.handleTextChangeqID} />
                        </div>
                        }
                        
                        {this.state.warningModal && <PopupModal modelWantsToCloseCallback={this.hideWarning} 
                                        title={this.state.warningModalTitle} body={this.state.warningModalBody}/>}
                        
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
