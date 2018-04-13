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
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container} from 'reactstrap';
import PopupModal from './PopupModal';
import LogoutIcon from 'open-iconic/svg/account-logout.svg';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            displayQIDModal: true
        };
        
        this.logoutRequestCallback = this.props.logoutRequestCallback;
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        var icon = {
          width: '16px',
          height: '16px'
        }
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <Container>
                        <NavbarBrand href="/">MediaQ</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink href="">{'Queue ID:' + this.props.qID}</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="">
                                        {'Name:' + this.props.displayName}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="">
                                        <Button onClick={this.logoutRequestCallback} color="primary">
                                            <img alt="Logout" src={LogoutIcon} style={icon} />
                                        </Button>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
            );
    }
}

export default Header;
