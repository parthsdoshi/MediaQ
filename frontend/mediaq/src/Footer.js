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
    Container,
    Button} from 'reactstrap';
import PopupModal from './PopupModal';
import PauseIcon from 'open-iconic/svg/media-pause.svg';
import PlayIcon from 'open-iconic/svg/media-play.svg';

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

    render() {
        var style = {
            backgroundColor: "#F8F8F8",
            borderTop: "1px solid #E7E7E7",
            textAlign: "center",
            padding: "0px",
            position: "fixed",
            left: "0",
            bottom: "0",
            height: "120px",
            width: "100%",
        }

        var phantom = {
          display: 'block',
          padding: '20px',
          height: '60px',
          width: '100%',
        }
        return (
            <div>
                <div style={phantom} />
                <div style={style}>
                    <Navbar color="light" light expand="md">
                        <Container>
                            <NavbarBrand>Media Control Panel</NavbarBrand>
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="mx-auto" navbar>
                                    <NavItem>
                                        <Button onClick={this.toggle} color="warning">
                                            <img alt="Add to Queue" src={PlayIcon} />
                                        </Button>
                                    </NavItem>
                                    <NavItem>
                                        <Button onClick={this.toggle} color="primary">
                                            <img alt="Add to Queue" src={PlayIcon} />
                                        </Button>
                                    </NavItem>
                                    <NavItem>
                                        <Button onClick={this.toggle} color="primary">
                                            <img alt="Add to Queue" src={PlayIcon} />
                                        </Button>
                                    </NavItem>
                                    <NavItem>
                                        <Button onClick={this.toggle} color="danger">
                                            <img alt="Add to Queue" src={PlayIcon} />
                                        </Button>
                                    </NavItem>
                                    <NavItem>
                                        <Button onClick={this.toggle} color="primary">
                                            <img alt="Add to Queue" src={PlayIcon} />
                                        </Button>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </Container>
                    </Navbar>
                </div>
            </div>
            );
    }
}

export default Header;
