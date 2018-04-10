import React, { Component } from 'react';
import { loadYoutubeAPI, executeSearch } from './google_utils';
import { Media, Button, Container, Row, Col } from 'reactstrap';
import YouTube from 'react-youtube';

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            youtubeResults: {},
            spotifyResults: {},
            youtubeSearchReady: false,
            youtubeReady: false,
            searchBoxTextValue: '',
            defaultWidth: 640,
            defaultHeight: 390
        }
        
        this.numberOfResults = 5

        this.youtubeCallback = this.youtubeCallback.bind(this);
        this.youtubeSearchCallback = this.youtubeSearchCallback.bind(this);
        
        this.searchYoutube = this.searchYoutube.bind(this);
        
        this.getResultTitle = this.getResultTitle.bind(this);
        this.getResultThumbnailUrl = this.getResultThumbnailUrl.bind(this);
        this.getResultThumbnailTag = this.getResultThumbnailTag.bind(this);        
        this.getResultID = this.getResultID.bind(this);
        this.getResultEmbedded = this.getResultEmbedded.bind(this);
        this.getResultEmbeddedSpecificSize = this.getResultEmbeddedSpecificSize.bind(this);
        this.getResultMedia = this.getResultMedia.bind(this);
        
        this.addToPlaylist = this.addToPlaylist.bind(this);
        
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
    
    searchYoutube(searchTag, numberOfResults) {
        this.state.youtubeSearch = false;
        if( this.state.youtubeReady ){
            executeSearch(searchTag, numberOfResults, this.youtubeSearchCallback);
        } else {
            return;
        }
        
    }
    
    getResultTitle(number) {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.title
        }
        console.log('getResultTitle was called before search results were ready');
        return null;
    }
    
    getResultThumbnailUrl(number) {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.thumbnails.default.url;
        }
        console.log('getResultThumbnailUrl was called before search results were ready');
        return null;
    }
    
    getResultThumbnailTag(number) {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            return (<img src={this.state.youtubeResults.items[number].snippet.thumbnails.default.url}></img>);
        }
        console.log('getResultThumbnailTag was called before search results were ready');
        return null;
    }
    
    getResultID(number) {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].id.videoId
        }
        console.log('getResultID was called before search results were ready');
        return null;
    }
    
    logVideoEnd() {
        console.log('Your video ended');
    }

    addToPlaylist(number) {
        console.log('Reult clicked ' + number);
        this.props.triggerParentUpdate(this.getResultEmbedded(number));
    }
    
    getResultEmbeddedSpecificSize(number, height, width) {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            const opts = {
                height: height,
                width: width,
                playerVars: { // https://developers.google.com/youtube/player_parameters
                    autoplay: 1,
                    rel: 0,
                }
            };
            return (<YouTube    videoId={this.getResultID(number)}
                        opts={opts}
                        onReady={this._onReady}
                        onEnd={this.logVideoEnd}/>)
        }
        console.log('getResultEmbeddedSpecificSize was called before search results were ready');
        return null;
    }
    
    getResultEmbedded(number) {
        return this.getResultEmbeddedSpecificSize(number, this.state.defaultHeight, this.state.defaultWidth);
    }
    
    getResultMedia(number) {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            return (
                <Media>
                  <Media left href="#">
                    <Media object src={this.getResultThumbnailUrl(number)} alt="Youtube Video Thumbnail" />
                  </Media>
                    <Media body>
                    <Media heading>
                        {this.getResultTitle(number)}
                    </Media>
                    <Button color="success" onClick={() => this.addToPlaylist(number)}> Add To Playlist</Button>{' '}
                    </Media>
                    
                </Media>
            );
        }
        console.log('getResultMedia was called before search results were ready');
        return null;
    }

    handleButtonPress(target) {
        this.searchYoutube(this.state.searchBoxTextValue, this.numberOfResults);
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
                this.searchYoutube(this.state.searchBoxTextValue);
        }
    }

    handleChange(event) {
        this.setState({searchBoxTextValue: event.target.value});
    }

    render() {
        return (
        <Container>
        <Row>
        <Col sm={{ size: 'auto', offset: 3 }}>
            <input type="text" onKeyPress={this.handleKeyboardKeyPress} onChange={this.handleChange} value={this.state.value}/>
        </Col>
        <Col sm={{ size: 'auto', offset: 0 }}>
            <Button onClick={this.handleButtonPress} color="primary">Search</Button>{' '}
        </Col>
        </Row>
        {this.state.youtubeSearchReady && this.getResultMedia(0)}
        {this.state.youtubeSearchReady && this.getResultMedia(1)}
        {this.state.youtubeSearchReady && this.getResultMedia(2)}
        {this.state.youtubeSearchReady && this.getResultMedia(3)}
        {this.state.youtubeSearchReady && this.getResultMedia(4)}
        
        </Container>
        );
        
    }

}

export default Search
