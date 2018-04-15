import React, { Component } from 'react';
import { Container } from 'reactstrap';
import io from 'socket.io-client'

import SearchContainer from './SearchContainer';
import VisibleQueue from './VisibleQueue';

const App = () => (
    // TODO: use Fade reactstrap component to make below look better if we have time
    <div className="App">
        <SearchContainer />
        <VisibleQueue />
    </div>
);

export default App;
