import { combineReducers } from 'redux'

import semiRoot from './semi-root'
import socket from './socket'

export default combineReducers({
    semiRoot,
    socket
})