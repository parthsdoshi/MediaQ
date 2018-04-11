import React, { Component } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Search from './Search';
<<<<<<< Updated upstream
import PauseIcon from 'open-iconic/svg/media-pause.svg';
import PlayIcon from 'open-iconic/svg/media-play.svg';
import PlusIcon from 'open-iconic/svg/plus.svg';
=======
import QueueRowEntry from './QueueRowEntry';
>>>>>>> Stashed changes

class Queue extends Component {

    // contact server in this component to grab queue

    constructor(props) {
        super(props);

        this.state = {
            searchBoxText: '',
            modal: false,
            tableRows: [],
            video: ''
        };
    }

    searchModalToggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    loadVideoCallback = (videoObject) => {
        this.setState({
            modal: false,
            video: videoObject
        });
    }
    
    insertTableEntry = (tableEntry) => {
        this.state.tableRows.push(tableEntry);
    }

    render() {
        return (
            <div>
                <Modal size='lg' 
                    isOpen={this.state.modal} 
                    toggle={this.toggle} 
                    className={this.props.className}>
                    <ModalHeader toggle={this.searchModalToggle}>
                        Add a new song
                    </ModalHeader>
                    <ModalBody>
                        <Search loadVideoCallback={this.loadVideoCallback}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.searchModalToggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Play/Pause</th>
                            <th>Title</th>
                            <th>Author/Artist</th>
                            <th>Album</th>
                            <th>Source</th>
                            <th>
                                <Button onClick={this.searchModalToggle} color="primary">
                                    <img alt="Add to Queue" src={PlusIcon} />
                                </Button>{' '}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>
                                <Button onClick={this.searchModelToggle} color="primary">
                                    <img alt="pause" src={PauseIcon} />
                                </Button>
                            </td>
                            <td>In the end</td>
                            <td>Linkin Park</td>
                            <td>Album</td>
                            <td>Youtube</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>
                                <Button onClick={this.searchModalToggle} color="primary">
                                    <img alt="play" src={PlayIcon} />
                                </Button>
                            </td>
                            <td>Breaking The Habit</td>
                            <td>Linkin Park</td>
                            <td>Album</td>
                            <td>Youtube</td>
                        </tr>
                    </tbody>
                </Table>
                {this.state.video !== '' && this.state.video}
            </div>
            );
    }

}

export default Queue
