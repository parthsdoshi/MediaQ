import React, { Component } from 'react';
import { Media, Button, Container, Row, Col } from 'reactstrap';

import { connect } from 'react-redux';

import * as youtubeStates from "../constants/youtube";
import {
    loadYoutubeAPI,
    getSearchResults,
    getPlaylistVideos } from '../utils/google_utils';
import {
    generateRowDataFromPlaylistResults,
    generateRowDataFromYoutubeSearchResults } from '../utils/rowData';
import PopupModal from "./PopupModal";

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            youtubeReady: (Search.APIHasLoaded === true),
            searchResultsInvalid: false,
            searchAttemptInvalid: false,

            youtubeResults: null,
            displaySearchResults: false,

            searchBoxTextValue: ''
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
        this.setState({displaySearchResults: false});
        if( this.state.youtubeReady ){
            getSearchResults(searchTag, numberOfResults, this.youtubeSearchCallback);
        } else {
            this.setState({searchAttemptInvalid: true});
            console.log('Youtube is not ready');
        }
    };

    youtubeSearchCallback = (results) => {
        if (results == null) {
            this.setState({searchResultsInvalid: true});
            return;
        }
        results = generateRowDataFromYoutubeSearchResults(results, this.props.displayName);
        console.log('search results created: ');
        console.log(results);
        this.setState({youtubeResults: results, displaySearchResults: true})
    };

    importYoutubePlaylist = (playlistID) => {
        this.setState({displaySearchResults: false});
        if( !this.state.youtubeReady ){
            this.setState({searchAttemptInvalid: true});
            console.log('Youtube is not ready');
            return;
        }
        getPlaylistVideos(playlistID, this.importYoutubePlaylistCallback);
    };

    importYoutubePlaylistCallback = (results) => {
        if (results == null) {
            this.setState({searchResultsInvalid: true});
            return;
        }
        results = generateRowDataFromPlaylistResults(results, this.props.displayName);
        console.log('playlist results created: ');
        console.log(results);
        this.props.loadPlaylistCallback(results);
    };

    addToQueue = (mediaId) => {
        this.props.loadVideoCallback(mediaId, this.state.youtubeResults[mediaId]);
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

    handleSearchBoxChange = (event) => {
        this.setState({searchBoxTextValue: event.target.value});
    };

    getResultMedia = (mediaId) => {
        if (!this.state.displaySearchResults || !(mediaId in this.state.youtubeResults)) {
            console.log('getResultMedia was called before search ' +
                'results were ready or called with out of bounds element');
            return null;
        }
        return (
            <div key={this.state.youtubeResults[mediaId].id}>
                <Media>
                    <Media left href="#">
                        <Media object
                               src={this.state.youtubeResults[mediaId].thumbnail}
                               alt="Youtube Video Thumbnail" />
                    </Media>

                    <Media body style={{paddingLeft: 8}}>
                        <Media heading>
                            {this.state.youtubeResults[mediaId].title}
                        </Media>
                        <Button onClick={() => this.addToQueue(mediaId)} color="success">
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
        if( this.state.displaySearchResults ){
            for (let key in this.state.youtubeResults) {
                youtubeMedia.push(this.getResultMedia(key));
            }
        }
        return (
            <Container fluid>
                {this.state.searchResultsInvalid &&
                <PopupModal modelWantsToCloseCallback={() => this.setState({searchResultsInvalid: false})}
                            title={'Search Failed'}
                            body={'Youtube did not respond with a valid result.'} />
                }
                {this.state.searchAttemptInvalid &&
                <PopupModal modelWantsToCloseCallback={() => this.setState({searchAttemptInvalid: false})}
                            title={'Search Failed'}
                            body={'Youtube API has not loaded yet, please try again in a moment.'} />
                }
                <Row>
                        <input type="text"
                            onKeyPress={this.handleKeyboardKeyPress}
                            onChange={this.handleSearchBoxChange} />
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
                    {this.state.displaySearchResults &&
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

const mapStateToProps = state => {
    return {
        displayName: state.semiRoot.displayName,
    }
};

export default connect(
    mapStateToProps
)(Search)
