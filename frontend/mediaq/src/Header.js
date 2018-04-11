import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container} from 'reactstrap';
import PopupModal from './PopupModal';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            displayQIDModal: true
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    
    hideQIDModal = () => {
        this.setState({
            displayQIDModal: false
        });
    }   


    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <Container>
                        <NavbarBrand href="/">MediaQ</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink href="">{this.props.qID}</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="">
                                        {this.props.displayName}
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
                {this.props.qID !== '' && this.state.displayQIDModal && 
                                <PopupModal modelWantsToCloseCallback={this.hideQIDModal} 
                                    title={'Your new Queue ID: ' + this.props.qID} 
                                    body={'Give the Queue ID ' + this.props.qID + ' to your friends to join your queue'}/>}
            </div>
            );
    }
}

export default Header;
