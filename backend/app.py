import os, time, random, string, json, sys
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
import redis
import time

import socket_constants as constants

app = Flask(__name__, static_folder='/build')
socketio = SocketIO(app)
database = redis.StrictRedis(host='database', port=6379)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory('/build', 'index.html')
    else:
        if(os.path.exists("/build/" + path)):
            return send_from_directory('/build', path)
        else:
            return send_from_directory('/build', 'index.html')

def tryDatabaseCommand(command, *args):
    retries = 5
    while True:
        try:
            return database.execute_command(command, *args)
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)
        except redis.exceptions.ResponseError as exc:
            return None

def hget(hash, key):
    ret = tryDatabaseCommand('hget', hash, key)
    if (ret != None):
        ret = json.loads(ret)
    return ret

def hset(hash, key, value):
    ret = tryDatabaseCommand('hset', hash, key, json.dumps(value))
    return ret

# 
# def get(key):
#     ret = tryDatabaseCommand('GET', key)
#     if (ret != None):
#         ret = json.loads(ret)
#     return ret
#     
# def set(key, value):
#     return tryDatabaseCommand('SET', key, json.dumps(value))

# initialize queues
# if ez_database.queues == None:
#     ez_database.queues = {}

# just some info about the socketio library...
# calling just 'emit' sends back to the sender
# calling 'socketio.emit' sends back to everyone
# HOWEVER, for both of them you can define namespaces/rooms
# and thus make their behavior the same

# TL;DR: socketio functions are NOT context aware

@socketio.on(constants.CREATE)
def handle_create(data):
    try:
        displayName = data['data']['displayName']

        random_id = ''.join(random.choices(string.ascii_uppercase, k=4))

        while hget('queues', random_id) != None:
            random_id = ''.join(random.choices(string.ascii_uppercase, k=4))

        qID = random_id
        room = qID

        queue_info = {
                'queue': {},
                'connected_users': [{
                    'sid': request.sid,
                    'displayName': displayName}]
                }
        hset('queues', random_id, queue_info)
        connected_users = queue_info['connected_users']

        join_room(room)
        return {'response': constants.SUCCESS, 'qID': random_id, 'data': {'displayName': displayName}}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}


@socketio.on(constants.JOIN)
def handle_join(data):
    try:
        qID = data['qID']
        displayName = data['data']['displayName']

        queue_info = hget('queues', qID)

        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST, 'qID': qID}

        connected_users = queue_info['connected_users']
        queue = queue_info['queue']

        for user in connected_users:
            if (user['displayName'] == displayName):
                return {'response': constants.DISPLAY_NAME_NOT_UNIQUE, 'qID': qID, 'data': {'displayName': displayName}}

        current_user = {
            'sid': request.sid,
            'displayName': displayName
            }
        connected_users.append(current_user)

        usersArr = []
        for user in connected_users:
            usersArr.append(user['displayName'])

        hset('queues', qID, queue_info)

        join_room(qID)
        emit(constants.USERJOINED, {'data': {'displayName': displayName}, 'response': constants.SUCCESS, 'qID': qID}, room=qID, include_self=False)
        return {'response': constants.SUCCESS, 'data': {'connected_users': usersArr, 'queue': queue, 'displayName': displayName}, 'qID': qID}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}
 
@socketio.on(constants.LEAVE)
def handle_leave(data):
    try:
        qID = data['qID']
        displayName = data['data']['displayName']

        queue_info = hget('queues', qID)
        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST, 'qID': qID}

        connected_users = queue_info['connected_users']

        found_user = False
        current_user = {'sid': request.sid, 'displayName': displayName}
        for (i, user) in enumerate(connected_users):
            if (user == current_user):
                found_user = True
                connected_users.pop(i)
                hset('queues', qID, queue_info)
                break

        if not found_user:
            return {'response': constants.USER_DOES_NOT_EXIST, 'qID': qID, 'data': {'displayName': displayName}}

        leave_room(qID)
        emit(constants.USERLEFT, {'data': {'displayName': displayName}, 'response': constants.SUCCESS, 'qID': qID}, room=qID, include_self=False)
        return {'response': constants.SUCCESS, 'qID': qID, 'data': {'displayName': displayName}}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}


# @socketio.on(constants.ADDMEDIA)
# def handle_add_media(data):
#     qID = data['qID']
# 
#     queue_info = get('queues', qID)
#     if (queue_info == None):
#         return {'response': constants.QID_DOES_NOT_EXIST}
# 
#     media = data['data']
#     mediaId = [*media][0]
#     rowData = media[mediaId]
# 
#     set('queues', 'queue.' + mediaId, rowData)
# 
#     emit(constants.MEDIAADDED, {'data': {mediaId: rowData}, 'response': constants.SUCCESS}, room=qID, include_self=False)
#     return {'response': constants.SUCCESS}

# @socketio.on(constants.ADDMEDIA)
@socketio.on(constants.ADDMEDIAS)
def handle_add_medias(data):
    try:
        qID = data['qID']

        queue_info = hget('queues', qID)
        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST, 'qID': qID}

        queue = queue_info['queue']

        medias = data['data']['medias']
        for mediaId, media in medias.items():
            mediaId.replace('-', '$')
            queue[mediaId] = media

        hset('queues', qID, queue_info)

        emit(constants.MEDIASADDED, {'data': {'medias': medias}, 'response': constants.SUCCESS, 'qID': qID}, room=qID, include_self=False)
        return {'response': constants.SUCCESS, 'data': {'medias': medias}, 'qID': qID}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}

# @socketio.on(constants.REMOVEMEDIA)
@socketio.on(constants.REMOVEMEDIAS)
def handle_remove_medias(data):
    try:
        qID = data['qID']
        queue_info = hget('queues', qID)
        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST, 'qID': qID}

        queue = queue_info['queue']

        removedMedias = []
        medias = data['data']['medias']
        for id in medias:
            if id in queue:
                queue.pop(id)
                removedMedias.append(id)
    
        hset('queues', qID, queue_info)

        emit(constants.MEDIASREMOVED, {'data': {'medias': removedMedias}, 'response': constants.SUCCESS, 'qID': qID}, room=qID, include_self=False)
        return {'response': constants.SUCCESS, 'qID': qID, 'data': {'medias': removedMedias}}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}

@socketio.on(constants.CURRENTQUEUE)
def handle_current_queue(data):
    try:
        qID = data['qID']
        queue_info = hget('queues', qID)
        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST, 'qID': qID}

        queue = queue_info['queue']
    
        return {'response': constants.SUCCESS, 'data': {'queue': queue}, 'qID': qID}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}

@socketio.on(constants.CONNECTEDUSERS)
def handle_connected_users(data):
    try:
        qID = data['qID']
        queue_info = hget('queues', qID)
        if queue_info == None:
            return {'response': constants.QID_DOES_NOT_EXIST, 'qID': qID}

        connected_users = queue_info['connected_users']

        ret = []
        for user in connected_users:
            ret.append(user['displayName'])

        return {'response': constants.SUCCESS, 'data': {'connected_users': ret}, 'qID': qID}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}

# @socketio.on('disconnect')

if __name__ == '__main__':
    db_state = tryDatabaseCommand('hgetall', 'queues')
    print(db_state)
    if db_state != None:
        for i, s in enumerate(db_state):
            if i % 2 == 1 and s != None:
                queue_info = json.loads(s)
                queue_info["connected_users"] = []
                hset('queues', db_state[i - 1], queue_info)

    socketio.run(app, host='0.0.0.0', port=80, debug=False)