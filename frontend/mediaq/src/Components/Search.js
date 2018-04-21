import React, { Component } from 'react';
import { Media, Button, Container, Row, Col } from 'reactstrap';

import { RowData } from '../utils/rowData'
import * as youtubeStates from "../constants/youtube";
import {
    loadYoutubeAPI,
    executeSearch,
    getPlaylistVideos } from '../utils/google_utils';
import PopupModal from "./PopupModal";

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            youtubeResults: null,
            youtubeSearchReady: false,
            youtubeReady: (Search.APIHasLoaded === true),
            searchBoxTextValue: '',
            searchFailed: false
        };

        this.numberOfResults = youtubeStates.INITIAL_NUMBER_OF_RESULTS;
        this.loadYoutubeAPIOnlyOnce();
    }

    loadYoutubeAPIOnlyOnce = () => {
        if ( Search.APIHasLoaded !== true ) {
            loadYoutubeAPI(this.youtubeCallback);
        } else {
            console.log("Youtube API already loaded");
        }
    };

    youtubeCallback = () => {
        console.log("Youtube API loaded");
        // to prevent further instances of this component from loading the API again
        Search.APIHasLoaded = true;
        this.setState({youtubeReady: true})
    };

    searchYoutube = (searchTag, numberOfResults) => {
        this.setState({youtubeSearchReady: false});
        if( this.state.youtubeReady ){
            executeSearch(searchTag, numberOfResults, this.youtubeSearchCallback);
        } else {
            console.log('Youtube is not ready');
        }
    };

    youtubeSearchCallback = (response) => {
        console.log(response);
        this.setState({youtubeResults: response, youtubeSearchReady: true})
    };

    importYoutubePlaylist = (playlistID) => {
        this.setState({youtubeSearchReady: false});
        if( !this.state.youtubeReady ){
            console.log('Youtube is not ready');
            return;
        }
        getPlaylistVideos(playlistID, this.importYoutubePlaylistCallback);
    };

    importYoutubePlaylistCallback = (response) => {
        if (response == null) {
            this.setState({searchFailed: true});
            return;
        }
        this.props.loadPlaylistCallback(response);
    };

    getResultData = (number) => {
        return new RowData(this.getResultID(number),
                                    this.getResultTitle(number),
                                    this.getResultAuthor(number),
                                    ' - ',
                                    'YouTube',
                                    this.getResultThumbnailUrl(number));
    };

    addToQueue = (number) => {
        this.props.loadVideoCallback(this.getResultData(number));
    };

    getResultTitle = (number) => {
        if (this.state.youtubeSearchReady &&
            this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.title
        }
        console.log('getResultTitle was called before search ' +
            'results were ready or called with out of bounds element');
        return null;
    };

    getResultAuthor = (number) => {
        if (this.state.youtubeSearchReady &&
            this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.channelTitle
        }
        console.log('getResultAuthor was called before search ' +
            'results were ready or called with out of bounds element');
        return null;
    };

    getResultThumbnailUrl = (number) => {
        if (this.state.youtubeSearchReady &&
            this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].snippet.thumbnails.default.url;
        }
        console.log('getResultThumbnailUrl was called before search ' +
            'results were ready or called with out of bounds element');
        return null;
    };

    getResultID = (number) => {
        if (this.state.youtubeSearchReady && this.state.youtubeResults.items.length > number) {
            return this.state.youtubeResults.items[number].id.videoId
        }
        console.log('getResultID was called before search ' +
            'results were ready or called with out of bounds element');
        return null;
    };

    handleSearchButtonPress = (target) => {
        this.searchYoutube(this.state.searchBoxTextValue, this.numberOfResults);
    };

    handlePlaylistButtonPress = (target) => {
        this.importYoutubePlaylist(this.state.searchBoxTextValue, false);
    };

    handleMoreResultsButtonPress = (target) => {
        this.numberOfResults += youtubeStates.INCREMENT_NUMBER_OF_RESULTS;
        this.handleSearchButtonPress(target);
    };

    handleKeyboardKeyPress = (target) => {
        const ENTER_BUTTON = 13;
        if(target.charCode === ENTER_BUTTON){
            this.searchYoutube(this.state.searchBoxTextValue);
        }
    };

    handleChange = (event) => {
        this.setState({searchBoxTextValue: event.target.value});
    };

    getResultMedia = (number) => {
        if (!this.state.youtubeSearchReady || number >= this.state.youtubeResults.items.length) {
            console.log('getResultMedia was called before search ' +
                'results were ready or called with out of bounds element');
            return null;
        }
        return (
            <div key={this.getResultID(number)}>
                <Media>
                    <Media left href="#">
                        <Media object
                               src={this.getResultThumbnailUrl(number)}
                               alt="Youtube Video Thumbnail" />
                    </Media>

                    <Media body style={{paddingLeft: 8}}>
                        <Media heading>
                            {this.getResultTitle(number)}
                        </Media>
                        <Button onClick={() => this.addToQueue(number)} color="success">
                            {'Add'}
                        </Button>
                    </Media>

                </Media>
                <hr className="my-2" />
            </div>
        );
    };

    render() {
        let youtubeMedia = [];
        if( this.state.youtubeSearchReady ){
            for (let i = 0; i < this.state.youtubeResults.items.length; i++) {
                youtubeMedia.push(this.getResultMedia(i));
            }
        }
        return (
            <Container fluid>
                {this.state.searchFailed &&
                <PopupModal modelWantsToCloseCallback={() => this.setState({searchFailed: false})}
                            title={'Search Failed'}
                            body={'Youtube did not respond with a valid result.'} />
                }
                <Row>
                        <input type="text"
                            onKeyPress={this.handleKeyboardKeyPress}
                            onChange={this.handleChange} />
                        <Button onClick={this.handleSearchButtonPress} color="primary" >
                            Search
                        </Button>
                        <Button onClick={this.handlePlaylistButtonPress} color="primary" >
                            Import Playlist
                        </Button>
                </Row>
                <hr className="my-2" />
                {youtubeMedia}
                <Row>
                    {this.state.youtubeSearchReady &&
                        <Col sm={{ size: 'auto', offset: 0 }}>
                            <Button onClick={this.handleMoreResultsButtonPress} color="primary">
                                More Results
                            </Button>{' '}
                        </Col>
                    }
                </Row>
            </Container>
        );
    }
}

export default Search
