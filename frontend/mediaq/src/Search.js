import React, { Component } from 'react';
import {loadYoutubeAPI, executeSearch} from './google_utils';

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            youtubeResults: {},
            spotifyResults: {} 
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
        this.setState({youtubeResults: response})
    }

    render() {

        return (<div/>)

    }

}

export default Search
