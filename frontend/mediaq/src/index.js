import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './Components/App';
import rootReducer from './reducers';
// imports bootstrap4 css files for reactstrap dependency
import 'bootstrap/dist/css/bootstrap.css';

import setupSocket from './sockets'

const store = createStore(rootReducer);
const socket = setupSocket(store.dispatch);
console.log(socket)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
