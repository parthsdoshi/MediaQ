import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    Container } from 'reactstrap';
import MediaPlayPauseButton from './MediaPlayPauseButton.js';

class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
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
            height: "60px",
            width: "100%",
        }

        var phantom = {
          display: 'block',
          padding: '0px',
          height: '60px',
          width: '100%',
        }
        return (
            <div>
                <div style={phantom} />
                <div style={style}>
                    <Navbar color="light" light expand="md">
                        <Container fluid>
                            <Nav className="mx-auto" navbar>
                                <NavItem>
                                    <MediaPlayPauseButton playState={2} />
                                </NavItem>
                            </Nav>
                        </Container>
                    </Navbar>
                </div>
            </div>
            );
    }
}

export default Footer;
