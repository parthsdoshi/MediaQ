import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Search from './Search'

class QueueRowEntry extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <tr>
                <th scope="row">1</th>
                <td>
                    <Button onClick={this.searchModelToggle} color="primary">
                        <i className="material-icons">pause_circle_outline</i>
                    </Button>
                </td>
                <td>In the end</td>
                <td>Linkin Park</td>
                <td>Album</td>
                <td>Youtube</td>
            </tr>
        );
    }

}

export default QueueRowEntry
