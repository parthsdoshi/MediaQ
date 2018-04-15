import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AddNewMediaModal = ({ show, header, children, hideSearch }) => (
    <Modal size='lg' 
        isOpen={show} 
        toggle={hideSearch}>
        <ModalHeader toggle={hideSearch}>
            {header}
        </ModalHeader>
        <ModalBody>
            {children}
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={hideSearch}>
                Cancel
            </Button>
        </ModalFooter>
    </Modal>
    );

export default AddNewMediaModal
