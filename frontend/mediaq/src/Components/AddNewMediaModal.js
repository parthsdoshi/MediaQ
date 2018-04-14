import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Search from './Search';

class AddNewMediaModal extends Component {

    constructor(props) {
        super(props);
        this.hideMe = this.props.hideMe;
        this.loadVideoCallback = this.props.loadVideoCallback;
        
    }
        
    render() {
        return (
            <Modal size='lg' 
                isOpen={true} 
                toggle={this.hideMe} 
                className={this.props.className}>
                <ModalHeader toggle={this.hideMe}>
                    Add a new song
                </ModalHeader>
                <ModalBody>
                    <Search loadVideoCallback={this.loadVideoCallback}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.hideMe}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

}

export default AddNewMediaModal
