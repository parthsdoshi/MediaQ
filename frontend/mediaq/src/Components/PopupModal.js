import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class PopupModal extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props);
        this.modelWantsToCloseCallback = this.props.modelWantsToCloseCallback;
    }

    render() {
        return (
            <div>
                <Modal isOpen={true} className={this.props.className}>
                    <ModalHeader toggle={this.modelWantsToCloseCallback}>
                        {this.props.title}
                    </ModalHeader>
                    <ModalBody>{this.props.body}</ModalBody>
                    <ModalFooter>
                        <Button color="danger" 
                            onClick={this.modelWantsToCloseCallback}>
                            Ok
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            );
    }

}

export default PopupModal
