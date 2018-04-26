import React, { Component } from 'react';
import {
    Collapse,
    Container,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Popover,
    PopoverHeader
} from 'reactstrap';

import LogoutIcon from 'open-iconic/svg/account-logout.svg';
import DuplicateIcon from 'open-iconic/svg/fork.svg';
import ExportIcon from 'open-iconic/svg/data-transfer-download.svg'
import ImportIcon from 'open-iconic/svg/data-transfer-upload.svg'

import { connect } from 'react-redux';
import { logout, socketLogout, socketClearState, addToQueue } from "../actions";
import {rowDataToString, stringToRowData} from "../utils/rowData";
import MediaQIcon from '../logo.svg';
import {socketCommands} from "../sockets/socketConstants";
import ImportPlaylistModal from "./ImportPlaylistModal";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapseIsOpen: false,
            QIDClipboardPopover: false,
            importQueuePopup: false,
        };
    }

    toggle = () => {
        this.setState({
            collapseIsOpen: !this.state.collapseIsOpen
        });
    };

    toggleQIDClipboardPopover = () => {
        this.setState({
            QIDClipboardPopover: !this.state.QIDClipboardPopover
        });
    };

    //don't look at this its ugly. it copies qID to clipboard.
    copyQIDToClipboard = () => {
        let textarea = document.createElement("textarea");
        textarea.textContent = this.props.qID;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false
        } finally {
            document.body.removeChild(textarea);
        }
        this.toggleQIDClipboardPopover();
    };

    duplicateQueue = () => {
        const displayName = this.props.displayName;
        const qID = this.props.qID;
        const QueueRowEntries = this.props.QueueRowEntries;
        this.props.logout();
        this.props.socketClearState();
        this.props.socket.emit(socketCommands.LEAVE,
            { 'data': { 'displayName': displayName }, 'qID': qID },
            (responseData) => {this.props.socket.DUPLICATE_LEAVE_ACKNOWLEDGEMENT(
                responseData, displayName, QueueRowEntries)});

    };

    exportQueue = () => {
        const QueueRowEntries = this.props.QueueRowEntries;
        let result = '';
        for (let key in QueueRowEntries) {
            result += rowDataToString(QueueRowEntries[key]) + '\n\n';
        }
        let element = document.createElement("a");
        const file = new Blob([result], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "myFile.txt";
        element.click();
    };

    importQueue = (text) => {
        this.setState({
            importQueuePopup: false
        });
        if (text === "") {
            return;
        }
        const importedQueue = stringToRowData(text, this.props.displayName);
        console.log(importedQueue);
        this.props.addToQueue(importedQueue);
        this.props.socket.emit(socketCommands.ADDMEDIAS,
            { 'data': { 'medias': importedQueue }, 'qID': this.props.qID },
            this.props.socket.ADDMEDIASACKNOWLEDGEMENT);

    };

    render() {
        let icon = {
            width: '16px',
            height: '16px'
        };
        let userList = this.props.userList.map((displayName) =>
            <DropdownItem disabled key={displayName}>{displayName}</DropdownItem>);

        //todo change if qid !== '' to loggedin === true and make sure it works
        return (
            <div>
                {this.state.importQueuePopup &&
                    <ImportPlaylistModal parentCallback={this.importQueue}/>
                }
                <Navbar color="light" light expand="md">
                    <Container>
                        <NavbarBrand href="#">
                            <img alt="MediaQ" src={MediaQIcon} width="10%" height="10%" />
                            MediaQ
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.collapseIsOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                {this.props.loggedIn &&
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            {'User List (' + this.props.userList.length + ')'}
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            {userList}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                }
                                {this.props.loggedIn &&
                                    <NavItem>
                                        <NavLink id="QIDPopover" onClick={this.copyQIDToClipboard} href="#">
                                            {'Queue ID: ' + this.props.qID}
                                        </NavLink>
                                        <Popover placement="bottom" isOpen={this.state.QIDClipboardPopover}
                                            target="QIDPopover" toggle={this.toggleQIDClipboardPopover}>
                                            <PopoverHeader>Copied Queue ID!</PopoverHeader>
                                        </Popover>
                                    </NavItem>
                                }
                                {this.props.loggedIn &&
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            {this.props.displayName}
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem onClick={this.duplicateQueue} >
                                                <NavLink href="#">
                                                    <img alt="Duplicate Queue" src={DuplicateIcon} style={icon} />
                                                    <div style={{ marginLeft: 20, display: 'inline' }}>
                                                        Duplicate Queue
                                                    </div>
                                                </NavLink>
                                            </DropdownItem>
                                            <DropdownItem onClick={this.exportQueue} >
                                                <NavLink href="#">
                                                    <img alt="Export Queue" src={ExportIcon} style={icon} />
                                                    <div style={{ marginLeft: 20, display: 'inline' }}>
                                                        Export Queue
                                                    </div>
                                                </NavLink>
                                            </DropdownItem>
                                            <DropdownItem onClick={() =>
                                                this.setState({importQueuePopup: !this.state.importQueuePopup})} >
                                                <NavLink href="#">
                                                    <img alt="Import Queue" src={ImportIcon} style={icon} />
                                                    <div style={{ marginLeft: 20, display: 'inline' }}>
                                                        Import Queue
                                                    </div>
                                                </NavLink>
                                            </DropdownItem>
                                            <DropdownItem onClick={() => {this.props.logout(); this.props.socketLogout();}} >
                                                <NavLink href="#">
                                                    <img alt="Logout" src={LogoutIcon} style={icon} />
                                                    <div style={{ marginLeft: 20, display: 'inline' }}>
                                                        Logout
                                                    </div>
                                                </NavLink>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                }
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        socket: state.socket.socket,
        loggedIn: state.socket.loggedIn,
        displayName: state.semiRoot.displayName,
        qID: state.semiRoot.qID,
        userList: state.semiRoot.userList,
        QueueRowEntries: state.semiRoot.QueueRowEntries,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        socketLogout: () => dispatch(socketLogout()),
        socketClearState: () => dispatch(socketClearState()),
        addToQueue: medias => dispatch(addToQueue(medias)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)
