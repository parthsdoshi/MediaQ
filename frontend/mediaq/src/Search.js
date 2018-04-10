import React, { Component } from 'react';
import {loadYoutubeAPI, executeSearch} from './google_utils';
import { Button } from 'reactstrap';
import { Container, Row, Col, InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
import YouTube from 'react-youtube';

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            youtubeResults: {},
            spotifyResults: {},
            youtubeSearchReady: false,
            youtubeReady: false,
            value: '',
            defaultWidth: 640,
            defaultHeight: 390
        }

        this.youtubeCallback = this.youtubeCallback.bind(this);
        this.youtubeSearchCallback = this.youtubeSearchCallback.bind(this);

        this.searchYoutube = this.searchYoutube.bind(this);
        
        this.getResultTitle = this.getResultTitle.bind(this);
        this.getResultThumbnailUrl = this.getResultThumbnailUrl.bind(this);
        this.getResultThumbnailTag = this.getResultThumbnailTag.bind(this);        
        this.getResultID = this.getResultID.bind(this);
        this.getResultEmbedded = this.getResultEmbedded.bind(this);
        this.getResultEmbeddedSpecificSize = this.getResultEmbeddedSpecificSize.bind(this);
        
        this.handleKeyboardKeyPress = this.handleKeyboardKeyPress.bind(this);
        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handlePlusButtonPress = this.handlePlusButtonPress.bind(this);
        this.handleMinusButtonPress = this.handleMinusButtonPress.bind(this);
        this.handleChange = this.handleChange.bind(this);

        loadYoutubeAPI(this.youtubeCallback)
    }

    youtubeCallback() {
        console.log("API loaded");
        this.setState({youtubeReady: true})
    }

    youtubeSearchCallback(response) {
        console.log(response);
        this.setState({youtubeResults: response, youtubeSearchReady: true})
    }
    
    searchYoutube(searchTag) {
        this.state.youtubeSearch = false;
        if( this.state.youtubeReady ){
            executeSearch(searchTag, 1, this.youtubeSearchCallback);
        } else {
            return;
        }
        
    }
    
    getResultTitle(number) {
        if (this.state.youtubeSearchReady) {
            return this.state.youtubeResults.items[number].snippet.title
        }
        return null;
    }
    getResultThumbnailUrl(number) {
        if (this.state.youtubeSearchReady) {
            return this.state.youtubeResults.items[number].snippet.thumbnails.default.url;
        }
        return null;
    }
    getResultThumbnailTag(number) {
        if (this.state.youtubeSearchReady) {
            return (<img src={this.state.youtubeResults.items[number].snippet.thumbnails.default.url}></img>);
        }
        return null;
    }
    getResultID(number) {
        if (this.state.youtubeSearchReady) {
            return this.state.youtubeResults.items[number].id.videoId
        }
        return null;
    }
    
    getResultEmbeddedSpecificSize(number, height, width) {
        if (this.state.youtubeSearchReady) {
            const opts = {
                height: height,
                width: width,
                playerVars: { // https://developers.google.com/youtube/player_parameters
                    autoplay: 1
                }
            };
            return (<YouTube    videoId={this.getResultID(number)}
                        opts={opts}
                        onReady={this._onReady} />)
        }
        return null;
    }
    
    getResultEmbedded(number) {
        return this.getResultEmbeddedSpecificSize(number, this.state.defaultHeight, this.state.defaultWidth);
    }

    handleButtonPress(target) {
        this.searchYoutube(this.state.value);
    }

    handlePlusButtonPress(target) {
        this.setState({defaultHeight: this.state.defaultHeight + 50});
        this.setState({defaultWidth: this.state.defaultWidth + 50});
    }

    handleMinusButtonPress(target) {
        this.setState({defaultHeight: this.state.defaultHeight - 50});
        this.setState({defaultWidth: this.state.defaultWidth - 50});
    }
    
    handleKeyboardKeyPress(target) {
        if(target.charCode==13){
                this.searchYoutube(this.state.value);
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
        <Container>
        <Row>
        <Col sm={{ size: 'auto', offset: 3 }}>
            <input type="text" onKeyPress={this.handleKeyboardKeyPress} onChange={this.handleChange} value={this.state.value}/>
        </Col>
        <Col sm={{ size: 'auto', offset: 0 }}>
            <Button onClick={this.handleButtonPress} color="primary">I'm feeling lucky</Button>{' '}
        </Col>
        <Col sm={{ size: 'auto', offset: 0 }}>
            <Button onClick={this.handlePlusButtonPress} color="primary">+</Button>{' '}
        </Col>
        <Col sm={{ size: 'auto', offset: 0 }}>
            <Button onClick={this.handleMinusButtonPress} color="primary">-</Button>{' '}
        </Col>
        </Row>
        <Row>
        <Col>
            <h1>{this.getResultTitle(0)}</h1>
            {this.getResultEmbedded(0)}
        </Col>
        </Row>
        </Container>
        );
        
    }

}

export default Search
