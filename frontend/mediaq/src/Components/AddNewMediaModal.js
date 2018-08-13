import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AddNewMediaModal extends Component {

    render() {
        return (
            <Modal size='lg' 
                isOpen={true} 
                toggle={this.props.hideMe}
                className={this.props.className}>
                <ModalHeader toggle={this.props.hideMe}>
                    {this.props.header}
                </ModalHeader>
                <ModalBody>
                    {this.props.children}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.hideMe}>
                        Done
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

}

export default AddNewMediaModal
