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
import { socketErrors, socketCommands, VERBOSE_SOCKET_LISTEN } from './socketConstants'

const setupSocket = (dispatch) => {
    let socket = io('http://' + document.domain + ':' + window.location.port);

    socket.CREATEACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got create acknowledgement')
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            let qID = responseData['qID'];
            dispatch(setQIDPopupDisplayStatus(true));
            dispatch(setQID(qID));
        } else {

        }
    }

    socket.JOINACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got join acknowledgement')
            console.log(responseData)
        }
        let response = responseData['response'];
        //todo don't hardcode this error code
        if (response === socketErrors.SUCCESS) {
            //todo server: userlist doesnt include current user if they created the room
            let queue = responseData['data']['queue'];
            let userList = responseData['data']['connected_users']
            dispatch(setUserList(userList));
            dispatch(setQueue(queue));
            dispatch(login());
        } else if (response === socketErrors.QID_DOES_NOT_EXIST) {
            dispatch(setIncorrectQIDPopupDisplayStatus(true));
        } else {

        }
    }

    // not used right now but we should display a loading screen probably
    socket.LEAVEACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got addmedias acknowledgement')
            console.log(responseData)
        }
        let response = responseData['response']
        if (response !== socketErrors.SUCCESS) {

        }
    }

    socket.ADDMEDIASACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got addmedias acknowledgement')
            console.log(responseData)
        }
        let response = responseData['response']
        if (response !== socketErrors.SUCCESS) {

        }
    }

    socket.REMOVEMEDIASACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got removemedias acknowledgement')
            console.log(responseData)
        }
        let response = responseData['response']
        if (response !== socketErrors.SUCCESS) {

        }
    }

    socket.CURRENTQUEUEACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got currentqueue acknowledgement')
            console.log(responseData)
        }
        let response = responseData['response']
        if (response === socketErrors.SUCCESS) {
            let queue = responseData['data']
            dispatch(setQueue(queue));
        } else {

        }
    }

    socket.CURRENTUSERSACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got currentusers acknowledgement')
        }
        let response = responseData['data']
        if (response === socketErrors.SUCCESS) {
            let userList = responseData['data']
            dispatch(setUserList(userList));
        } else {

        }
    }

    socket.on('connect', (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got connect');
        }
        dispatch(setSocket(socket));
    });

    socket.on(socketCommands.USERJOINED, (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got userjoined');
            console.log(data);
        }
        let response = data['response']
        //todo don't hardcode this error code
        if (response === socketErrors.SUCCESS) {
            let newUser = data['data']
            dispatch(addNewUser(data));
        } else if (response === socketErrors.QID_DOES_NOT_EXIST) {
            dispatch(setIncorrectQIDPopupDisplayStatus(true));
        } else {

        }
    });

    socket.on(socketCommands.MEDIASADDED, (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got mediasadded');
            console.log(data);
        }
        let response = data['response']
        if (response === socketErrors.SUCCESS) {
            let medias = data['data']
            dispatch(addToQueue(medias));
        } else {

        }
    });

    socket.on(socketCommands.USERLEFT, (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got userleft');
            console.log(data);
        }
        let response = data['response']
        if (response === socketErrors.SUCCESS) {
            let user = data['data']
            dispatch(removeUser(user));
        } else {

        }
    });

    return socket
};

export default setupSocket