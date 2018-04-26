import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

class ImportPlaylistModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
        };
    }

    handleTextChange = (event) => {
        this.setState({ text: event.target.value });
    };

    cancel = () => {
        this.setState({
            text: ''
        });
        this.props.parentCallback('');
    };

    callParent = () => {
        this.setState({
            text: ''
        });
        this.props.parentCallback(this.state.text);
    };

    render() {
        return (
            <Modal size='lg'
                   isOpen={true}
                   toggle={this.props.hideMe}
                   className={this.props.className}>
                <ModalHeader toggle={this.cancel}>
                    {'Import playlist'}
                </ModalHeader>
                <ModalBody>
                    <Input type="textarea" name="text" id="exampleText" onChange={this.handleTextChange} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.callParent}>Import</Button>
                    <Button color="secondary" onClick={this.cancel}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }

}

export default ImportPlaylistModal
