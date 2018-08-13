import React, { Component } from 'react';
import {
    Media,
    Button,
    Container,
    Row,
    Col,
    Input,
    InputGroupAddon,
    InputGroup
} from 'reactstrap';

import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import * as mediaStates from "../constants/media";
import * as charCodes from '../constants/charCodes';
import {
    loadYoutubeAPI,
    getSearchResults,
    getPlaylistVideos
} from '../utils/google_utils';
import {
    generateRowDataFromPlaylistResults,
    generateRowDataFromYoutubeSearchResults,
    generateRowDataFromURL
} from '../utils/rowData';
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

            searchBoxTextValue: '',

            justConstructed: true
        };

        this.numberOfResults = mediaStates.INITIAL_NUMBER_OF_RESULTS;
        this.loadYoutubeAPIOnlyOnce();
    }

    // FOCUS SEARCH BAR - kinda hacky solution...
    componentDidMount() {
        // this.setState({searchBoxTextValue: this.state.searchBoxTextValue})        
        if (this.state.justConstructed) {
            this.setState({ justConstructed: true })
        }
    }
    componentDidUpdate() {
        if (this.state.justConstructed) {
            this.setState({ justConstructed: false });
            this.searchInput.focus()
        }
    }
    //

    loadYoutubeAPIOnlyOnce = () => {
        if (Search.APIHasLoaded !== true) {
            loadYoutubeAPI(this.youtubeCallback);
        } else {
            console.log("Youtube API already loaded");
        }
    };

    youtubeCallback = () => {
        console.log("Youtube API loaded");
        // to prevent further instances of this component from loading the API again
        Search.APIHasLoaded = true;
        this.setState({ youtubeReady: true })
    };

    searchYoutube = (searchTag, numberOfResults) => {
        this.setState({ displaySearchResults: false });
        if (this.state.youtubeReady) {
            getSearchResults(searchTag, numberOfResults, this.youtubeSearchCallback);
        } else {
            this.setState({ searchAttemptInvalid: true });
            console.log('Youtube is not ready');
        }
    };

    youtubeSearchCallback = (results) => {
        if (results == null) {
            this.setState({ searchResultsInvalid: true });
            return;
        }
        results = generateRowDataFromYoutubeSearchResults(results, this.props.displayName);
        console.log('search results created: ');
        console.log(results);
        this.setState({ youtubeResults: results, displaySearchResults: true })
    };

    importYoutubePlaylist = (playlistID) => {
        this.setState({ displaySearchResults: false });
        if (!this.state.youtubeReady) {
            this.setState({ searchAttemptInvalid: true });
            console.log('Youtube is not ready');
            return;
        }
        getPlaylistVideos(playlistID, this.importYoutubePlaylistCallback);
    };

    importYoutubePlaylistCallback = (results) => {
        if (results == null) {
            this.setState({ searchResultsInvalid: true });
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

    isURL = (str) => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }

    handleSearchButtonPress = (target) => {
        if (this.isURL(this.state.searchBoxTextValue)) {
            if (ReactPlayer.canPlay(this.state.searchBoxTextValue)) {
                const rowData = generateRowDataFromURL(this.state.searchBoxTextValue);
                this.props.loadVideoCallback(rowData.timestamp, rowData)
            } else {
                // error
                console.log('react-player does not support this URL. This probably means the URL does not have an embedded video.')
            }
        } else {
            this.searchYoutube(this.state.searchBoxTextValue, this.numberOfResults);
        }
    };

    handlePlaylistButtonPress = () => {
        this.importYoutubePlaylist(this.state.searchBoxTextValue);
    };

    handleMoreResultsButtonPress = (target) => {
        this.numberOfResults += mediaStates.INCREMENT_NUMBER_OF_RESULTS;
        this.handleSearchButtonPress(target);
    };

    handleKeyboardKeyPress = (target) => {
        switch (target.charCode) {
            case charCodes.ENTER:
                this.searchYoutube(this.state.searchBoxTextValue);
                return
            default:
                return
        }
    };

    handleSearchBoxChange = (event) => {
        this.setState({ searchBoxTextValue: event.target.value });
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

                    <Media body style={{ paddingLeft: 8 }}>
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
        if (this.state.displaySearchResults) {
            for (let key in this.state.youtubeResults) {
                // todo webstorm warning message:
                // Possible iteration over unexpected (custom / inherited) members, probably
                // missing hasOwnProperty check
                //
                // Checks for any instances of unfiltered for-in loops in JavaScript. The use of this construct results
                // in processing inherited or unexpected properties. You need to filter own properties with
                // hasOwnProperty() method. The validation works in JavaScript, html or jsp files.
                youtubeMedia.push(this.getResultMedia(key));
            }
        }
        return (
            <Container fluid>
                {this.state.searchResultsInvalid &&
                    <PopupModal modelWantsToCloseCallback={() => this.setState({ searchResultsInvalid: false })}
                        title={'Search Failed'}
                        buttonColor="danger"
                        body={'Youtube did not respond with a valid result.'} />
                }
                {this.state.searchAttemptInvalid &&
                    <PopupModal modelWantsToCloseCallback={() => this.setState({ searchAttemptInvalid: false })}
                        title={'Search Failed'}
                        buttonColor="danger"
                        body={'Youtube API has not loaded yet, please try again in a moment.'} />
                }
                <InputGroup>
                    <Input type="text"
                        onKeyPress={this.handleKeyboardKeyPress}
                        onChange={this.handleSearchBoxChange}
                        innerRef={(input) => { this.searchInput = input }} />
                    <InputGroupAddon addonType="append">
                        <Button onClick={this.handleSearchButtonPress} color="primary" >
                            Search
                        </Button>
                    </InputGroupAddon>
                    <InputGroupAddon addonType="append">
                        <Button onClick={this.handlePlaylistButtonPress} color="info" >
                            Import Playlist
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
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
