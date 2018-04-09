/* global gapi */

import React, { Component } from 'react';

const API_KEY = '967952823565-ujd2c9i8p32skqcduc93qhu3kah4aif8.apps.googleusercontent.com';
var GoogleAuth;

export default class GoogleUtils extends Component {


    initClient() {
        // Initialize the client with API key and People API, and initialize OAuth with an
        // OAuth 2.0 client ID and scopes (space delimited string) to request access.
        gapi.client.init({
            apiKey: 'AIzaSyCSR-D790Htqm9vFAoDojNjjE3inJ-gONQ',
            clientId: API_KEY,
        });
      }
  
  loadYoutubeApi() {
      
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      gapi.load('client', () => {
        gapi.load('client:auth2', this.initClient);
        gapi.client.load('youtube', 'v3', () => {
          this.setState({ gapiReady: true });
        });
      });
    };
    document.body.appendChild(script);
  }

  componentDidMount() {
    console.log('asdf');
    this.loadYoutubeApi();
  }
     removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] === 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

   executeRequest(request) {
    request.execute(function(response) {
      console.log(response);
    });
  }

   buildApiRequest(requestMethod, path, params) {
    params = this.removeEmptyParams(params);
    var request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    this.executeRequest(request);
  }
  
   executeSearch(searchtag) {
    this.buildApiRequest('GET',
                '/youtube/v3/search',
                {'maxResults': '5',
                 'part': 'snippet',
                 'q': searchtag,
                 'type': ''});
  }


  render() {
    if (this.state && this.state.gapiReady) {
     this.executeSearch('linkingpark castle of glass');
     return (
       <h1>GAPI is loaded and ready to use.</h1>
     );
  } else {
      return (
       <h1>.................</h1>
       
     );
  };
  };
}