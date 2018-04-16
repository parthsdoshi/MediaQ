import React, { Component } from 'react';
import {
    Collapse,
    Button,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Popover,
    PopoverHeader,
    PopoverBody } from 'reactstrap';
import LogoutIcon from 'open-iconic/svg/account-logout.svg';
import { connect } from 'react-redux';

import MediaQIcon from '../logo.svg';
import { logout } from "../actions";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapseIsOpen: false,
            QIDClipboardPopover: false
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

    render() {
        let icon = {
            width: '16px',
            height: '16px'
        };
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <Container>
                        <NavbarBrand href="/">
                            <img alt="MediaQ" src={MediaQIcon} width="10%" height="10%" />
                            MediaQ
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.collapseIsOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                {this.props.qID !== "" && this.props.displayName !== "" &&
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
                                {this.props.qID !== "" && this.props.displayName !== "" &&
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        {this.props.displayName}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={this.props.logout} >
                                            <NavLink href="#">
                                                <img alt="Logout" src={LogoutIcon} style={icon} />
                                                <div style={{marginLeft: 20, display: 'inline'}}>
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
        displayName : state.displayName,
        qID: state.qID
    }
};

const mapDispatchToProps = dispatch => {
    return {
        logout : () => dispatch(logout())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)
