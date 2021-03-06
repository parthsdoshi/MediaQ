import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './Components/App';
import rootReducer from './reducers';
// imports bootstrap4 css files for reactstrap dependency
import './styles/custom.css'

import setupSocket from './sockets'

const store = createStore(
    rootReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const socket = setupSocket(store.dispatch);
console.log(socket);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
