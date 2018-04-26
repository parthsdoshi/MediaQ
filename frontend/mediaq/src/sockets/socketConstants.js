// Error Codes
export const socketErrors = {
    SUCCESS: 0,
    DISPLAY_NAME_NOT_UNIQUE: -1,
    QID_DOES_NOT_EXIST: -2,
    ILL_FORMED_DATA: -3,
    SERVER_ERROR: -4,
    USER_DOES_NOT_EXIST: -5
};

// Socket IO
export const socketCommands = {
    CREATE: 'Create',
    JOIN: 'Join',
    LEAVE: 'Leave',
    USERJOINED: 'UserJoined',
    ADDMEDIA: 'AddMedia',
    ADDMEDIAS: 'AddMedias',
    REMOVEMEDIA: 'RemoveMedia',
    REMOVEMEDIAS: 'RemoveMedias',
    USERLEFT: 'UserLeft',
    MEDIAADDED: 'MediaAdded',
    MEDIASADDED: 'MediasAdded',
    MEDIAREMOVED: 'MediaRemoved',
    MEDIASREMOVED: 'MediasRemoved',
    CURRENTQUEUE: 'CurrentQueue',
    CONNECTEDUSERS: 'ConnectedUsers'
};

export const VERBOSE_SOCKET_LISTEN = true;