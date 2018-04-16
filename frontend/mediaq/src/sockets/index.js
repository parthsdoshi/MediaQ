import io from 'socket.io-client'
import {
    setSocket,
    setQID,
    setQIDPopupDisplayStatus,
    setIncorrectQIDPopupDisplayStatus,
    login
} from '../actions'

const setupSocket = (dispatch) => {
    let socket = io('http://' + document.domain + ':' + window.location.port);

    socket.on('connect', (data) => {
        console.log('socket got connect');
        dispatch(setSocket(socket));
    });

    socket.on('create', (data) => {
        console.log('socket got create with data ');
        console.log(data);
        let qID = data['qID'];
        dispatch(setQIDPopupDisplayStatus(true));
        dispatch(setQID(qID));
    });

    socket.on('join', (data) => {
        console.log('socket got create with data ');
        console.log(data);
        //todo don't hardcode this error code
        console.log(data === 'ERRCO 1: ROOM DOES NOT EXIST');
        if (data === 'ERRCO 1: ROOM DOES NOT EXIST') {
            dispatch(setIncorrectQIDPopupDisplayStatus(true));
        } else {
            dispatch(login());
        }
    });


    return socket
};

export default setupSocket