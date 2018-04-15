import React from 'react';
import { Media, Button, Container, Row, Col } from 'reactstrap';

import AddNewMediaModal from './AddNewMediaModal';

const Search = ({ showModal, hideSearch }) => (
    <AddNewMediaModal header={"Add a new song"} show={showModal} hideSearch={hideSearch}>
        <Container>
            <Row>
                <Col sm={{ size: 'auto', offset: 3 }}>
                    <input type="text" 
                        onKeyPress={this.handleKeyboardKeyPress} 
                        onChange={this.handleChange} />
                </Col>
                <Col sm={{ size: 'auto', offset: 0 }}>
                    <Button onClick={this.handleSearchButtonPress} color="primary">
                        Search
                    </Button>{' '}
                </Col>
            </Row>
        </Container>
    </AddNewMediaModal>
    );

export default Search;
