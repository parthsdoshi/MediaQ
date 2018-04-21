import React, { Component } from 'react';
import { Media, Button, Container, Row, Col } from 'reactstrap';

import { RowData } from '../utils/rowData'
import * as youtubeStates from "../constants/youtube";
import {
    loadYoutubeAPI,
    getSearchResults,
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
            getSearchResults(searchTag, numberOfResults, this.youtubeSearchCallback);
        } else {
            console.log('Youtube is not ready');
        }
    };

    youtubeSearchCallback = (results) => {
        console.log('google utils returned: ' + results);
        this.setState({youtubeResults: results, youtubeSearchReady: true})
    };

    importYoutubePlaylist = (playlistID) => {
        this.setState({youtubeSearchReady: false});
        if( !this.state.youtubeReady ){
            console.log('Youtube is not ready');
            return;
        }
        getPlaylistVideos(playlistID, this.importYoutubePlaylistCallback);
    };

    importYoutubePlaylistCallback = (results) => {
        console.log('google utils returned: ' + results);
        if (results == null) {
            this.setState({searchFailed: true});
            return;
        }
        this.props.loadPlaylistCallback(results);
    };

    addToQueue = (number) => {
        this.props.loadVideoCallback(this.state.youtubeResults[number]);
    };

    handleSearchButtonPress = (target) => {
        this.searchYoutube(this.state.searchBoxTextValue, this.numberOfResults);
    };

    handlePlaylistButtonPress = (target) => {
        this.importYoutubePlaylist(this.state.searchBoxTextValue);
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
        if (!this.state.youtubeSearchReady || number >= this.state.youtubeResults.length) {
            console.log('getResultMedia was called before search ' +
                'results were ready or called with out of bounds element');
            return null;
        }
        return (
            <div key={this.state.youtubeResults[number].id}>
                <Media>
                    <Media left href="#">
                        <Media object
                               src={this.state.youtubeResults[number].thumbnail}
                               alt="Youtube Video Thumbnail" />
                    </Media>

                    <Media body style={{paddingLeft: 8}}>
                        <Media heading>
                            {this.state.youtubeResults[number].title}
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
            for (let i = 0; i < this.state.youtubeResults.length; i++) {
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
