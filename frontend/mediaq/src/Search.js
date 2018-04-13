import React, { Component } from 'react';
import { loadYoutubeAPI, executeSearch } from './google_utils';
import { Media, Button, Container, Row, Col } from 'reactstrap';
import { RowData } from './QueueRowEntry.js'

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            youtubeResults: null,
            spotifyResults: null,
            youtubeSearchReady: false,
            youtubeReady: (Search.APIHasLoaded === true ? true : false),
            searchBoxTextValue: ''
        }

        this.loadVideoCallback = this.props.loadVideoCallback;

        this.numberOfResults = 5
        this.loadYoutubeAPIOnlyOnce();
    }
    
    loadYoutubeAPIOnlyOnce = () => {
        if ( Search.APIHasLoaded !== true ) {
            loadYoutubeAPI(this.youtubeCallback);
        } else {
            console.log("Youtube API already loaded");
        }
    }

    youtubeCallback = () => {
        console.log("Youtube API loaded");
        Search.APIHasLoaded = true; // to prevent further instances of this component from loading the API again
        this.setState({youtubeReady: true})
    }

    youtubeSearchCallback = (response) => {
        console.log(response);
        this.setState({youtubeResults: response, youtubeSearchReady: true})
    }

    searchYoutube = (searchTag, numberOfResults) => {
        this.setState({youtubeSearchReady: false});
        if( this.state.youtubeReady ){
            executeSearch(searchTag, numberOfResults, this.youtubeSearchCallback);
        } else {
            console.log('Youtube is not ready');
            return;
        }

    }
    
    getResultData = (number) => {
        var result = new RowData(this.getResultID(number),
                                    this.getResultTitle(number),
                                    this.getResultAuthor(number),
                                    ' - ',
                                    'YouTube',
                                    this.getResultThumbnailUrl(number));
        return result;
    }

    addToPlaylist = (number) => {
        this.loadVideoCallback(this.getResultData(number));
    }

    getResultTitle = (number) => {
        if (this.state.youtubeSearchReady && 
            this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.title
        }
        console.log('getResultTitle was called before search results were ready or called with out of bounds element');
        return null;
    }

    getResultAuthor = (number) => {
        if (this.state.youtubeSearchReady && 
            this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.channelTitle
        }
        console.log('getResultAuthor was called before search results were ready or called with out of bounds element');
        return null;
    }
    
    getResultThumbnailUrl = (number) => {
        if (this.state.youtubeSearchReady && 
            this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.thumbnails.default.url;
        }
        console.log('getResultThumbnailUrl was called before search results were ready or called with out of bounds element');
        return null;
    }

    getResultID = (number) => {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].id.videoId
        }
        console.log('getResultID was called before search results were ready or called with out of bounds element');
        return null;
    }

    getResultMedia = (number) => {
        if (this.state.youtubeSearchReady && 
            this.state.youtubeResults.items.length > number) {
            return (
                <Media key={number}>
                    <Media left href="#">
                        <Media object 
                            src={this.getResultThumbnailUrl(number)} 
                            alt="Youtube Video Thumbnail" />
                    </Media>
                    <Media body>
                        <Media heading>
                            {this.getResultTitle(number)}
                        </Media>
                        <Button 
                            color="success" 
                            onClick={() => this.addToPlaylist(number)}> 
                            Add To Playlist
                        </Button>{' '}
                    </Media>

                </Media>
                );
    }
    console.log('getResultMedia was called before search results were ready or called with out of bounds element');
    return null;
}

handleSearchButtonPress = (target) => {
    this.searchYoutube(this.state.searchBoxTextValue, this.numberOfResults);
}

handleMoreResultsButtonPress = (target) => {
    this.numberOfResults += 5;
    this.handleSearchButtonPress(target);
}

handleKeyboardKeyPress = (target) => {
    if(target.charCode === 13){
        this.searchYoutube(this.state.searchBoxTextValue);
    }
}

handleChange = (event) => {
    this.setState({searchBoxTextValue: event.target.value});
}

render() {
    var youtubeMedia = [];
    if( this.state.youtubeSearchReady ){
        for (var i = 0; i < this.state.youtubeResults.items.length; i++) {
            youtubeMedia.push(this.getResultMedia(i));
        }
    }
    return (
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
            {youtubeMedia}
            {this.state.youtubeSearchReady && 
                <Col sm={{ size: 'auto', offset: 0 }}>
                    <Button onClick={this.handleMoreResultsButtonPress} color="primary">
                        More Results
                    </Button>{' '}
                </Col>
            }

        </Container>
        );

    }

}

export default Search
