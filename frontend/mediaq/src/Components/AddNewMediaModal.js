import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Search from './Search';

class AddNewMediaModal extends Component {

    render() {
        return (
            <Modal size='lg' 
                isOpen={true} 
                toggle={this.props.hideMe}
                className={this.props.className}>
                <ModalHeader toggle={this.props.hideMe}>
                    Add a new song
                </ModalHeader>
                <ModalBody>
                    <Search loadVideoCallback={this.props.loadVideoCallback}
                            loadPlaylistCallback={this.props.loadPlaylistCallback}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.hideMe}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

}

export default AddNewMediaModal
