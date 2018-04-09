import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import YouTube from 'react-youtube';
import { loadYoutubeApi, initGapi , executeSearch} from "./youtube.js";

class App extends Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    var youtubevideos = []
    for (var i = 0; i < 1; i++){
        youtubevideos.push
          (<YouTube
            videoId="2g811Eo7K8U"
            opts={opts}
            onReady={this._onReady}
           />)
    }
    executeSearch();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {youtubevideos}
      </div>
    );
  }
}

export default App;
