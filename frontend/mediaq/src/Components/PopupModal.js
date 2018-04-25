import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class PopupModal extends Component {

    render() {
        return (
            <div>
                <Modal isOpen={true} className={this.props.className}>
                    <ModalHeader toggle={this.props.modelWantsToCloseCallback}>
                        {this.props.title}
                    </ModalHeader>
                    <ModalBody>{this.props.body}</ModalBody>
                    <ModalFooter>
                        <Button color={this.props.buttonColor}
                            onClick={this.props.modelWantsToCloseCallback}>
                            Ok
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            );
    }

}

export default PopupModal
