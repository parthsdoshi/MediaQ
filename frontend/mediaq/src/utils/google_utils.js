import React from 'react';

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
    request.execute(function (response) {
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
        {
            'maxResults': numberOfResults,
            'part': 'snippet',
            'q': searchTag,
            'type': 'video'
        },
        callback);
}

function executePlaylistSearch(playlistID, callback) {
    console.log('Youtube API playlist called with ' + playlistID);
    buildApiRequest('GET',
        '/youtube/v3/playlistItems',
        {
            'part': 'snippet',
            'playlistId': playlistID,
            'maxResults': 50
        },
        callback);

}

function executePlaylistSearchNextPage(playlistID, nextPageToken, callback) {
    console.log('Youtube API playlist next page called with ' + nextPageToken);
    buildApiRequest('GET',
        '/youtube/v3/playlistItems',
        {
            'part': 'snippet',
            'playlistId': playlistID,
            'pageToken': nextPageToken,
            'maxResults': 50
        },
        callback);
}

//exported helper functions

export function getYoutubeVideoVolume(youtubeVideoObject) {
    let isMuted = false;
    if (youtubeVideoObject.isMuted) {
        isMuted = youtubeVideoObject.isMuted();
    }
    if (isMuted) {
        return 0;
    } else {
        return youtubeVideoObject.getVolume();
    }
}


// exported search functions and their helper functions/variables

let resultCallback = null;
let searchInProgress = false;

export function getSearchResults(searchtag, numberOfResults, youtubeSearchCallback) {
    if (searchInProgress) {
        return;
    }
    resultCallback = youtubeSearchCallback;
    searchInProgress = true;
    executeSearch(searchtag, numberOfResults, getSearchResultsCallback)
}

function getSearchResultsCallback(response) {
    if (response.error !== undefined) {
        response = null; // return null because youtube returned error
    }
    const tempReturnFunction = resultCallback;
    // clear global variable before returning
    resultCallback = null;
    searchInProgress = false;
    tempReturnFunction(response);
}

//playlist functions
const playlistRecursiveHelperInitial = {
    searchInProgress: false, runningResults: [],
    playlistID: '', resultCallback: null
};
let playlistRecursiveHelper = { ...playlistRecursiveHelperInitial };

export function getPlaylistVideos(playlistID, youtubeSearchCallback) {
    if (playlistRecursiveHelper.searchInProgress) {
        return;
    }
    playlistRecursiveHelper = {
        ...playlistRecursiveHelperInitial,
        playlistID: playlistID, resultCallback: youtubeSearchCallback, searchInProgress: true
    };
    executePlaylistSearch(playlistID, getPlaylistVideosCallback);
}

function getPlaylistVideosCallback(response) {
    // youtube returned an error, return null as the result
    if (response.error !== undefined) {
        const resultCallback = playlistRecursiveHelper.resultCallback;
        // clear global variable before returning
        playlistRecursiveHelper = { ...playlistRecursiveHelperInitial };
        resultCallback(null);
        return;
    }

    playlistRecursiveHelper.runningResults = [...playlistRecursiveHelper.runningResults, response];
    if (response.nextPageToken !== undefined) {
        executePlaylistSearchNextPage(playlistRecursiveHelper.playlistID,
            response.nextPageToken, getPlaylistVideosCallback);
    } else {
        const returnFunction = playlistRecursiveHelper.resultCallback;
        const results = playlistRecursiveHelper.runningResults;
        // clear global variable before returning
        playlistRecursiveHelper = { ...playlistRecursiveHelperInitial };
        returnFunction(results);
        return;
    }
}

//end playlist functions
