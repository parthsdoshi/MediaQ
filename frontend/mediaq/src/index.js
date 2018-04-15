import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// import createSagaMiddleware from 'redux-saga';

import App from './Components/App';
import rootReducer from './reducers';
// import setupSocket from './utils/socket';
// import handleRequests from './sagas/index';

import 'bootstrap/dist/css/bootstrap.css';

// const sagaMiddleware = createSagaMiddleware();
// const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
const store = createStore(rootReducer);

// const socket = setupSocket(store.dispatch);

// sagaMiddleware.run(handleRequests, { socket });

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
