import io from 'socket.io-client'
import {
    setSocket,
    login,
    setDisplayName,
    setQID,
    setQIDPopupDisplayStatus,
    setIncorrectQIDPopupDisplayStatus,
    setQueue,
    addToQueue,
    setUserList,
    addNewUser,
    removeUser, 
    removeFromQueue,
    setDeletionMode,
    setSessionRestoredPopupDisplayStatus
} from '../actions'
import { socketErrors, socketCommands, VERBOSE_SOCKET_LISTEN } from './socketConstants'

const setupSocket = (dispatch) => {
    let socket = io('http://' + document.domain + ':' + window.location.port);

    socket.CREATEACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got create acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            let qID = responseData['qID'];
            dispatch(setQIDPopupDisplayStatus(true));
            dispatch(setQID(qID));
            let displayName = responseData['data']['displayName'];
            dispatch(setUserList([displayName]))
        } else {

        }
    };

    socket.JOINACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got join acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            //todo server: userlist doesnt include current user if they created the room
            let queue = responseData['data']['queue'];
            let userList = responseData['data']['connected_users'];
            dispatch(setUserList(userList));
            dispatch(setQueue(queue));
            dispatch(login());
        } else if (response === socketErrors.QID_DOES_NOT_EXIST) {
            dispatch(setIncorrectQIDPopupDisplayStatus(true));
        } else {

        }
    };

    socket.SESSIONRESTOREDACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got session restored acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            const queue = responseData['data']['queue'];
            const userList = responseData['data']['connected_users'];
            const qID = responseData['qID'];
            const displayName = responseData['data']['displayName'];
            dispatch(setSessionRestoredPopupDisplayStatus(true));
            dispatch(setDisplayName(displayName));
            dispatch(setQID(qID));
            dispatch(setUserList(userList));
            dispatch(setQueue(queue));
            dispatch(login());
        } else {
            localStorage.removeItem("qID");
            localStorage.removeItem("displayName");
        }
    };

    // not used right now but we should display a loading screen probably
    socket.LEAVEACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got leave acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response !== socketErrors.SUCCESS) {

        }
    };

    socket.ADDMEDIASACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got addmedias acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response !== socketErrors.SUCCESS) {

        }
    };

    socket.REMOVEMEDIASACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got removemedias acknowledgement');
            console.log(responseData)
        }
        const response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            const medias = responseData['data']['medias'];
            dispatch(removeFromQueue(medias));
            dispatch(setDeletionMode(false))
        }
    };

    socket.CURRENTQUEUEACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got currentqueue acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            let queue = responseData['data']['queue'];
            dispatch(setQueue(queue));
        } else {

        }
    };

    socket.CURRENTUSERSACKNOWLEDGEMENT = (responseData) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got currentusers acknowledgement')
        }
        let response = responseData['data'];
        if (response === socketErrors.SUCCESS) {
            let userList = responseData['data']['current_users'];
            dispatch(setUserList(userList));
        } else {

        }
    };

    socket.DUPLICATE_LEAVE_ACKNOWLEDGEMENT = (responseData, newDisplayName, newQueueMedia) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got leave acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            // successfully left previous queue
            dispatch(setDisplayName(newDisplayName));
            socket.emit(socketCommands.CREATE,
                { 'data': {'displayName': newDisplayName} },
                (responseData) => {socket.DUPLICATE_CREATE_ACKNOWLEDGEMENT(
                    responseData, newQueueMedia)});
        }
    };
    socket.DUPLICATE_CREATE_ACKNOWLEDGEMENT = (responseData, newQueueMedia) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got create acknowledgement');
            console.log(responseData)
        }
        let response = responseData['response'];
        if (response === socketErrors.SUCCESS) {
            // successfully created queue
            let qID = responseData['qID'];
            dispatch(setQIDPopupDisplayStatus(true));
            dispatch(setQID(qID));
            let displayName = responseData['data']['displayName'];
            dispatch(setUserList([displayName]));
            dispatch(addToQueue(newQueueMedia));
            socket.emit(socketCommands.ADDMEDIAS,
                { 'data': {'medias':  newQueueMedia}, 'qID': qID },
                socket.ADDMEDIASACKNOWLEDGEMENT);
        }
    };

    socket.on('connect', () => {
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
        let response = data['response'];
        if (response === socketErrors.SUCCESS) {
            let newUser = data['data']['displayName'];
            dispatch(addNewUser(newUser));
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
        let response = data['response'];
        if (response === socketErrors.SUCCESS) {
            let medias = data['data']['medias'];
            dispatch(addToQueue(medias));
        } else {

        }
    });

    socket.on(socketCommands.USERLEFT, (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got userleft');
            console.log(data);
        }
        let response = data['response'];
        if (response === socketErrors.SUCCESS) {
            let user = data['data']['displayName'];
            dispatch(removeUser(user));
        } else {

        }
    });

    socket.on(socketCommands.MEDIASREMOVED, (data) => {
        if (VERBOSE_SOCKET_LISTEN) {
            console.log('socket got userleft');
            console.log(data);
        }
        const response = data['response'];
        if (response === socketErrors.SUCCESS) {
            const medias = data['data']['medias'];
            dispatch(removeFromQueue(medias));
            dispatch(setDeletionMode(false))
        }
    });

    return socket
};

export default setupSocket