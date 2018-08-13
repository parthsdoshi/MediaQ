import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
<<<<<<< HEAD
=======
import { createStore, applyMiddleware } from 'redux';
>>>>>>> development

import App from './Components/App';
import store from './store';
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
