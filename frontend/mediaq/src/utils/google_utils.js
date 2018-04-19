import React from 'react';
import YouTube from 'react-youtube';

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

export function executePlaylistSearch(playlistID, youtubeSearchCallback) {
    console.log('Youtube API playlist called with ' + playlistID);
    buildApiRequest('GET',
        '/youtube/v3/playlistItems',
        {'part': 'snippet',
        'playlistId': playlistID,
        'maxResults': 50},
        youtubeSearchCallback);
}

export function executePlaylistSearchNextPage(playlistID, nextPageToken, youtubeSearchCallback) {
    console.log('Youtube API playlist next page called with ' + nextPageToken);
    buildApiRequest('GET',
        '/youtube/v3/playlistItems',
        {'part': 'snippet',
            'playlistId': playlistID,
            'pageToken': nextPageToken,
            'maxResults': 50},
        youtubeSearchCallback);
}

export function executeSearch(searchtag, numberOfResults, youtubeSearchCallback) {
    console.log('Youtube API search called with ' + searchtag);
    buildApiRequest('GET',
        '/youtube/v3/search',
        {'maxResults': numberOfResults,
            'part': 'snippet',
            'q': searchtag,
            'type': 'video'},
        youtubeSearchCallback);
}
