import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './Components/App';
import store from './store';
// imports bootstrap4 css files for reactstrap dependency
import 'bootstrap/dist/css/bootstrap.css';

import setupSocket from './sockets'

const socket = setupSocket(store.dispatch);
console.log(socket);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
