import React from 'react';
import YouTube from 'react-youtube';
import {RowData} from "./rowData";

/* global gapi */
// above tells compiler that gapi is global

const API_KEY = '967952823565-ujd2c9i8p32skqcduc93qhu3kah4aif8.apps.googleusercontent.com';

export function initClient() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    gapi.client.init({
        apiKey: 'AIzaSyCSR-D790Htqm9vFAoDojNjjE3inJ-gONQ',
        clientId: API_KEY,
        scope: 'https://www.googleapis.com/auth/youtube.readonly'
    });
}

export function getEmbededVideoComponent(id, onReady, onStateChange, width=640, height=390) {
    const opts = {
        height: height,
        width: width,
        playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            rel: 0,
            showinfo: 0,
//            controls: 0,
//            disablekb: 1,
        }
    };
    return (<YouTube videoId={id}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}/>);
}

export function loadYoutubeAPI(youtubeCallback) {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
        gapi.load('client', () => {
            gapi.load('client:auth2', initClient);
            gapi.client.load('youtube', 'v3', () => {
                youtubeCallback()
            });
        });
    };
    document.body.appendChild(script);
}

function removeEmptyParams(params) {
    for (let p in params) {
        if (!params[p] || params[p] === 'undefined') {
            delete params[p];
        }
    }
    return params;
}

function executeRequest(request, youtubeSearchCallback) {
    request.execute(function(response) {
        youtubeSearchCallback(response)
    });
}

function buildApiRequest(requestMethod, path, params, youtubeSearchCallback) {
    params = removeEmptyParams(params);
    let request = gapi.client.request({
        'method': requestMethod,
        'path': path,
        'params': params
    });
    executeRequest(request, youtubeSearchCallback);
}

function executeSearch(searchTag, numberOfResults, callback) {
    console.log('Youtube API search called with ' + searchTag);
    buildApiRequest('GET',
        '/youtube/v3/search',
        {'maxResults': numberOfResults,
            'part': 'snippet',
            'q': searchTag,
            'type': 'video'},
        callback);
}

function executePlaylistSearch(playlistID, callback) {
    console.log('Youtube API playlist called with ' + playlistID);
    buildApiRequest('GET',
        '/youtube/v3/playlistItems',
        {'part': 'snippet',
            'playlistId': playlistID,
            'maxResults': 50},
        callback);

}

function executePlaylistSearchNextPage(playlistID, nextPageToken, callback) {
    console.log('Youtube API playlist next page called with ' + nextPageToken);
    buildApiRequest('GET',
        '/youtube/v3/playlistItems',
        {'part': 'snippet',
            'playlistId': playlistID,
            'pageToken': nextPageToken,
            'maxResults': 50},
        callback);
}

// exported functions and their helper functions/variables

let resultCallback = null;

export function getSearchResults(searchtag, numberOfResults, youtubeSearchCallback) {
    resultCallback = youtubeSearchCallback;
    executeSearch(searchtag, numberOfResults, getSearchResultsCallback)
}

function getSearchResultsCallback(response) {
    if (response.error !== undefined) {
        const tempReturnFunction = resultCallback;
        resultCallback = null;
        tempReturnFunction(null);
    }
    let resulst = [];
    for (let i = 0; i < response.items.length; i++) {
        resulst.push(getResultData(response, i));
    }
    const tempReturnFunction = resultCallback;
    resultCallback = null;
    tempReturnFunction(resulst);
}

function getResultData(data, number) {
    return new RowData(
        data.items[number].id.videoId,
        data.items[number].snippet.title,
        data.items[number].snippet.channelTitle,
        ' - ',
        'YouTube',
        data.items[number].snippet.thumbnails.default.url);
}

//playlist functions
const playlistRecursiveHelperInitial = { runningResults: [], playlistID: '', resultCallback: null };

let playlistRecursiveHelper = { ...playlistRecursiveHelperInitial };

export function getPlaylistVideos(playlistID, youtubeSearchCallback) {
    playlistRecursiveHelper = { ...playlistRecursiveHelperInitial,
        playlistID: playlistID, resultCallback: youtubeSearchCallback };
    executePlaylistSearch(playlistID, getPlaylistVideosCallback);
}

function getPlaylistVideosCallback(response) {
    if (response.error !== undefined) {
        const resultCallback = playlistRecursiveHelper.resultCallback;
        playlistRecursiveHelper = { ...playlistRecursiveHelperInitial }; //clear variables
        resultCallback(null);
    }
    for (let i = 0; i < response.items.length; i++) {
        playlistRecursiveHelper.runningResults.push(getPlaylistResultData(response, i));
    }
    if (response.nextPageToken !== undefined) {
        executePlaylistSearchNextPage(playlistRecursiveHelper.playlistID,
            response.nextPageToken, getPlaylistVideosCallback);
    } else {
        const returnFunction = playlistRecursiveHelper.resultCallback;
        const results = playlistRecursiveHelper.runningResults;
        playlistRecursiveHelper = { ...playlistRecursiveHelperInitial }; //clear variables
        returnFunction(results);
    }
}

function getPlaylistResultData (playlistData, number) {
    let thumbnail = '';
    if (playlistData.items[number].snippet.thumbnails !== undefined) {
        thumbnail = playlistData.items[number].snippet.thumbnails.default.url
    }
    return new RowData(
        playlistData.items[number].snippet.resourceId.videoId,
        playlistData.items[number].snippet.title,
        ' Playlist ',
        ' - ',
        'YouTube',
        thumbnail);
}

//end playlist functions
