import io from 'socket.io-client'
import {
    setSocket,
    login,
    setQID,
    setQIDPopupDisplayStatus,
    setIncorrectQIDPopupDisplayStatus,
    setQueue,
    addToQueue,
    setUserList,
    addNewUser,
    removeUser
} from '../actions'

const VERBOSE_SOCKET_LISTEN = true;

const setupSocket = (dispatch) => {
    let socket = io('http://' + document.domain + ':' + window.location.port);

    socket.on('connect', (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got connect');
        }
        dispatch(setSocket(socket));
    });

    socket.on('Create', (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got create with data ');
            console.log(data);
        }
        console.log('yay server responded');
        let response = data['response'];
        let qID = data['qID'];
        dispatch(setQIDPopupDisplayStatus(true));
        dispatch(setQID(qID));
    });

    socket.on('join', (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got join with data ');
            console.log(data);
        }
        //todo don't hardcode this error code
        if (data === 'ERRCO 1: ROOM DOES NOT EXIST') {
            dispatch(setIncorrectQIDPopupDisplayStatus(true));
        } else if (data['queue'] === undefined) { //queue not sent, which means this is to notify of new user joining
            //todo why is the server sending join? and why is there no sid
            dispatch(addNewUser(data));
        } else {
            //todo server: userlist doesnt include current user if they created the room
            let queue = data['queue'];
            let userList = data['connected_users'];
            dispatch(setQueue(queue));
            dispatch(setUserList(userList));
            dispatch(login());
        }
    });

    socket.on('addToQueue', (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got addToQueue with data ');
            console.log(data);
        }
        dispatch(addToQueue(data));
    });

    socket.on('leave', (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got leave with data ');
            console.log(data);
        }
        dispatch(removeUser(data.displayName));
    });

    return socket
};

export default setupSocket