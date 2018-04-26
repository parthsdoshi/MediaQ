import React, { Component } from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PopupModal from './PopupModal'
import * as charCodes from '../constants/charCodes'

class LoginScreen extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props);

        this.state = {
            displaynameBoxText: '',
            qIDBoxText: '',
            modal: true,
            showQIDInput: !this.props.createQueue,
            warningModal: false,
            warningModalTitle: '',
            warningModalBody: ''
        };
    }

    componentDidMount() {
        this.displayNameInput.focus()
    }

    handleKeyboardKeyPress = (target) => {
        switch(target.charCode) {
            case charCodes.ENTER:
                this.callParent()
                return
            default:
                return
        }
    };

    handleTextChangeqID = (event) => {
        this.setState({ qIDBoxText: event.target.value });
    };

    handleTextChangeDisplayname = (event) => {
        this.setState({ displaynameBoxText: event.target.value });
    };

    cancel = () => {
        this.setState({
            modal: false
        });
        this.props.hideLoginAndCallParentCallback('', '');
    };

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
        this.props.hideLoginAndCallParentCallback(this.state.displaynameBoxText, this.state.qIDBoxText);
    };

    hideWarning = () => {
        this.setState({
            warningModal: false,
            warningModalTitle: '',
            warningModalBody: ''
        });
    };

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal} className={this.props.className}>
                    <ModalHeader toggle={this.modalTurnOff}>
                        {this.props.createQueue ? 'Create a new queue' : 'Join an existing queue'}
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <Input placeholder="Display Name"
                                innerRef={(input) => {this.displayNameInput = input}}
                                onKeyPress={this.handleKeyboardKeyPress}
                                onChange={this.handleTextChangeDisplayname} />
                        </div>

                        {this.state.showQIDInput &&
                            <div className="form-group">
                                <Input placeholder="Queue ID"
                                    onKeyPress={this.handleKeyboardKeyPress}
                                    onChange={this.handleTextChangeqID} />
                            </div>
                        }

                        {this.state.warningModal &&
                            <PopupModal modelWantsToCloseCallback={this.hideWarning}
                                buttonColor="danger"
                                title={this.state.warningModalTitle}
                                body={this.state.warningModalBody} />
                        }
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
