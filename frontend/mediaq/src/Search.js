import React, { Component } from 'react';
import {loadYoutubeAPI, executeSearch} from './google_utils';
import { Button } from 'reactstrap';

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            youtubeResults: {},
            spotifyResults: {},
            youtubeSearchReady: false,
            youtubeReady: false
        }

        this.youtubeCallback = this.youtubeCallback.bind(this);
        this.youtubeSearchCallback = this.youtubeSearchCallback.bind(this);
        
        this.getResultTitle = this.getResultTitle.bind(this);
        this.getResultThumbnailUrl = this.getResultThumbnailUrl.bind(this);
        this.getResultThumbnailTag = this.getResultThumbnailTag.bind(this);
        
        this.searchYoutube = this.searchYoutube.bind(this);

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
        searchTag = "linking park castle of glass"
        if( this.state.youtubeReady ){
            this.state.youtubeSearch = false;
            executeSearch(searchTag, this.youtubeSearchCallback);
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
            return this.state.youtubeResults.items[0].snippet.thumbnails.default.url;
        }
        return null;
    }
    getResultThumbnailTag(number) {
        if (this.state.youtubeSearchReady) {
            return (<img src={this.state.youtubeResults.items[0].snippet.thumbnails.default.url}></img>);
        }
        return null;
    }

    render() {
        return (
        <div>
        <Button onClick={this.searchYoutube} color="primary">primary</Button>{' '}
        <h1>{this.getResultTitle(0)}</h1>
        {this.getResultThumbnailTag(0)}
        </div>);
        
    }

}

export default Search
