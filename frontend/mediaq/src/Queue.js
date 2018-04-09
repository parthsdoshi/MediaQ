import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Queue extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Play/Pause</th>
                            <th>Title</th>
                            <th>Author/Artist</th>
                            <th>Album</th>
                            <th>Source</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </Table>
            </div>
            );
    }

}

export default Queue
