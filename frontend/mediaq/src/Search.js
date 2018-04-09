import React, { Component } from 'react';
import {loadYoutubeAPI, executeSearch} from './google_utils';

class Search extends Component {

    constructor(props) {
        super(props)

        this.youtubeCallback = this.youtubeCallback.bind(this);
        loadYoutubeAPI(this.youtubeCallback)
    }

    youtubeCallback() {
        console.log("API loaded");
        executeSearch();
    }

    render() {

        return (<div/>)

    }

}

export default Search
