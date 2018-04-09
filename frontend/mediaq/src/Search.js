import React, { Component } from 'react';
import {loadYoutubeAPI, executeSearch} from './google_utils';

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            youtubeResults: {},
            spotifyResults: {},
            youtubeSearchReady: false
        }

        this.youtubeCallback = this.youtubeCallback.bind(this);
        this.youtubeSearchCallback = this.youtubeSearchCallback.bind(this);

        loadYoutubeAPI(this.youtubeCallback)
    }

    youtubeCallback() {
        console.log("API loaded");
        executeSearch("cats", this.youtubeSearchCallback);
    }

    youtubeSearchCallback(response) {
        console.log(response);
        this.setState({youtubeResults: response, youtubeSearchReady: true})
    }

    render() {
        if (this.state.youtubeSearchReady) {
            return (<div>
        <h1>{this.state.youtubeResults.items[0].snippet.title}</h1>
        <img src={this.state.youtubeResults.items[0].snippet.thumbnails.default.url}></img>
        </div>);
        } else {
            return (
                <h1>.................</h1>
            );
        };
    }

}

export default Search
