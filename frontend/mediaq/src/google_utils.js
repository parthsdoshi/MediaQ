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
                // this.setState({ gapiReady: true });
                youtubeCallback()
            });
        });
    };
    document.body.appendChild(script);
}

/*componentDidMount() {
    console.log('asdf');
    this.loadYoutubeApi();
}*/

export function removeEmptyParams(params) {
    for (var p in params) {
        if (!params[p] || params[p] === 'undefined') {
            delete params[p];
        }
    }
    return params;
}

export function executeRequest(request, youtubeSearchCallback) {
    request.execute(function(response) {
        youtubeSearchCallback(response)
    });
}

export function buildApiRequest(requestMethod, path, params, youtubeSearchCallback) {
    params = removeEmptyParams(params);
    var request = gapi.client.request({
        'method': requestMethod,
        'path': path,
        'params': params
    });
    executeRequest(request, youtubeSearchCallback);
}

export function executeSearch(searchtag, youtubeSearchCallback) {
    buildApiRequest('GET',
        '/youtube/v3/search',
        {'maxResults': '5',
            'part': 'snippet',
            'q': searchtag,
            'type': ''},
        youtubeSearchCallback);
}


/*render() {
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
};*/