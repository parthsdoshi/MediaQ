import React, { Component } from 'react';
import { Media, Button, Container, Row, Col, Input } from 'reactstrap';

import AddNewMediaModal from './AddNewMediaModal';

class Search extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            searchBoxTextValue: ''
        }
    }

    handleButtonPress = () => {
        this.props.handleSearch(this.state.searchBoxTextValue);
    }

    handleKeyboardPress = (target) => {
        if (target.charCode === 13) {
            this.props.handleSearch(this.state.searchBoxTextValue);
        }
    }

    handleChange = (event) => {
        this.setState({searchBoxTextValue: event.target.value});
    }

    render() {
        return (
            <AddNewMediaModal header={"Add a new song"} show={this.props.showModal} hideSearch={this.props.hideSearch}>
                <Container>
                    <Row>
                        <Col sm={{ size: 'auto', offset: 3 }}>
                            <Input type="text" 
                                onKeyPress={this.handleKeyboardKeyPress} 
                                onChange={this.handleChange} />
                        </Col>
                        <Col sm={{ size: 'auto', offset: 0 }}>
                            <Button onClick={this.handleButtonPress} color="primary">
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </AddNewMediaModal>
            );
    }
}
export default Search;
