import React, { Component } from 'react';
import {loadYoutubeAPI, executeSearch} from './google_utils';
import { Button } from 'reactstrap';
import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
import YouTube from 'react-youtube';

class Search extends Component {

    constructor(props) {
        super(props)

        this.state = {
            youtubeResults: {},
            spotifyResults: {},
            youtubeSearchReady: false,
            youtubeReady: false,
            value: ''
        }

        this.youtubeCallback = this.youtubeCallback.bind(this);
        this.youtubeSearchCallback = this.youtubeSearchCallback.bind(this);
        
        this.getResultTitle = this.getResultTitle.bind(this);
        this.getResultThumbnailUrl = this.getResultThumbnailUrl.bind(this);
        this.getResultThumbnailTag = this.getResultThumbnailTag.bind(this);        
        this.searchYoutube = this.searchYoutube.bind(this);
        this.getResultID = this.getResultID.bind(this);
        this.getResultEmbedded = this.getResultEmbedded.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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
    
    searchYoutube(searchTag) {
        this.state.youtubeSearch = false;
        if( this.state.youtubeReady ){
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
            return this.state.youtubeResults.items[number].snippet.thumbnails.default.url;
        }
        return null;
    }
    getResultThumbnailTag(number) {
        if (this.state.youtubeSearchReady) {
            return (<img src={this.state.youtubeResults.items[number].snippet.thumbnails.default.url}></img>);
        }
        return null;
    }
    getResultID(number) {
        if (this.state.youtubeSearchReady) {
            return this.state.youtubeResults.items[number].id.videoId
        }
        return null;
    }
    
    getResultEmbedded(number) {
        if (this.state.youtubeSearchReady) {
            const opts = {
                height: '390',
                width: '640',
                playerVars: { // https://developers.google.com/youtube/player_parameters
                    autoplay: 1
                }
            };
            return (<YouTube    videoId={this.getResultID(number)}
                        opts={opts}
                        onReady={this._onReady} />)
        }
        return null;
    }

    handleKeyPress(target) {
        if(target.charCode==13){
                this.searchYoutube(this.state.value);
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
        <div>
        <input type="text" onKeyPress={this.handleKeyPress} onChange={this.handleChange} value={this.state.value}/>
        <h1>{this.getResultTitle(0)}</h1>
        {this.getResultThumbnailTag(0)}
        <h1>VIDEO</h1>
        {this.getResultEmbedded(0)}
        </div>);
        
    }

}

export default Search
