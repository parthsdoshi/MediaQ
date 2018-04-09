/* global gapi */

const API_KEY = '967952823565-ujd2c9i8p32skqcduc93qhu3kah4aif8.apps.googleusercontent.com';

 export var initGapi = () => {
    console.log('Initializing GAPI...');
    console.log('Creating the google script tag...');

    const script = document.createElement("script");
    script.onload = () => {
      console.log('Loaded script, now loading our api...')
      // Gapi isn't available immediately so we have to wait until it is to use gapi.
      loadClientWhenGapiReady(script);
    };
    script.src = "https://apis.google.com/js/api.js";
    
    document.body.appendChild(script);
  }
var loadClientWhenGapiReady = (script) => {
    console.log('Trying To Load Client!');
    console.log(script)
    if(script.getAttribute('gapi_processed')){
      console.log('Client is ready! Now you can access gapi. :)');
      if(window.location.hostname==='localhost'){
        gapi.client.load("http://localhost:8080/_ah/api/discovery/v1/apis/metafields/v1/rest")
        .then((response) => {
          console.log("Connected to metafields API locally.");
          },
          function (err) {
            console.log("Error connecting to metafields API locally.");
          }
        );
      }
    }
    else{
      console.log('Client wasn\'t ready, trying again in 100ms');
      setTimeout(() => {loadClientWhenGapiReady(script)}, 100);
    }
  }
  
  export function loadYoutubeApi() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.setApiKey(API_KEY);
        gapi.client.load('youtube', 'v3', () => {
          this.setState({ gapiReady: true });
        });
      });
    };

    document.body.appendChild(script);
  }

  function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] === 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

  function executeRequest(request) {
    request.execute(function(response) {
      console.log(response);
    });
  }

  function buildApiRequest(requestMethod, path, params) {
    params = removeEmptyParams(params);
    var request = gapi.client.request({
          'method': requestMethod,
          'path': path,
          'params': params
      });
    executeRequest(request);
  }
  
  export function executeSearch(searchtag) {
    buildApiRequest('GET',
                '/youtube/v3/search',
                {'maxResults': '25',
                 'part': 'snippet',
                 'q': 'linkinpark',
                 'type': ''});
  }
