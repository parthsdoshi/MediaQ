import os, time, random, string, json, sys
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
import redis
# from rejson import Client, Path
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

def get(key, path):
    retries = 5
    while True:
        try:
            value = database.execute_command('JSON.GET', key, path)
            if value != None:
                value = json.loads(value)
            return value
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)
        except redis.exceptions.ResponseError as exc:
            return None

def set(key, path, value):
    retries = 5
    while True:
        try:
            return database.execute_command('JSON.SET', key, path, json.dumps(value))
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)
        except redis.exceptions.ResponseError as exc:
            return None

def arrAppend(key, path, value):
    retries = 5
    while True:
        try:
            return database.execute_command('JSON.ARRAPPEND', key, path, json.dumps(value))
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)
        except redis.exceptions.ResponseError as exc:
            return None

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


# print(json.loads(database.execute_command('JSON.GET', "foo", "ans")))
# set("foo", ".", "{}");
# set("foo", "ans", "34");
# print(json.loads(get("foo", "ans")));

# initialize queues
if (get('queues', '') == None):
    set('queues', '.', {})

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
        while(get('queues', random_id) != None):
            random_id = ''.join(random.choices(string.ascii_uppercase, k=4))

        qID = random_id
        room = qID

        queue_info = {
                'queue': {},
                'connected_users': [{
                    'sid': request.sid,
                    'displayName': displayName}]
                }
        set("queues", qID, queue_info)

        join_room(room)
        return {'response': constants.SUCCESS, 'qID': random_id}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}


@socketio.on(constants.JOIN)
def handle_join(data):
    try:
        qID = data['qID']
        displayName = data['data']['displayName']

        queue_info = get('queues', qID)

        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST}

        for user in queue_info['connected_users']:
            if (user['displayName'] == displayName):
                return {'response': constants.DISPLAY_NAME_NOT_UNIQUE}

        current_user = {
            'sid': request.sid,
            'displayName': displayName
            }
        queue_info['connected_users'].append(current_user)

        usersArr = []
        for user in queue_info['connected_users']:
            usersArr.append(user['displayName'])

        arrAppend('queues', qID + '.connected_users', current_user)

        join_room(qID)
        emit(constants.USERJOINED, {'data': {'displayName': displayName}, 'response': constants.SUCCESS}, room=qID, include_self=False)
        return {'response': constants.SUCCESS, 'data': {'current_users': usersArr, 'queue': queue_info['queue']}}
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

        queue_info = get('queues', qID)
        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST}

        current_user = {'sid': request.sid, 'displayName': displayName}
        for i in range(queue_info['connected_users'].length):
            if queue_info['connected_users'][i] == current_user:
                tryDatabaseCommand('json.arrpop', 'queues', qID + '.connected_users', i)
                break

        leave_room(qID)
        emit(constants.USERLEFT, {'data': {'displayName': displayName}, 'response': constants.SUCCESS}, room=qID, include_self=False)
        return {'response': constants.SUCCESS}
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
        queue_info = get('queues', qID)
        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST}

        medias = data['data']['medias']
        for key, value in medias.items():
            set('queues', qID + '.queue.' + key, value)

        emit(constants.MEDIASADDED, {'data': {'medias': medias}, 'response': constants.SUCCESS}, room=qID, include_self=False)
        return {'response': constants.SUCCESS}
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
        queue_info = get('queues', qID)
        if (queue_info == None):
            return {'response': constants.QID_DOES_NOT_EXIST}

        removedMedias = []
        medias = data['data']['medias']
        for id in medias:
            if tryDatabaseCommand('json.del', 'queues', qID + '.queue.' + id) == 1:
                removedMedias.append(id)
    
        emit(constants.MEDIASREMOVED, {'data': {'medias': removedMedias}, 'response': constants.SUCCESS}, room=qID, include_self=False)
        return {'response': constants.SUCCESS}
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
        queue = get('queues', qID + '.queue')
        if (queue == None):
            return {'response': constants.QID_DOES_NOT_EXIST}
    
        return {'response': constants.SUCCESS, 'data': {'queue': queue}}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}

@socketio.on(constants.CURRENTUSERS)
def handle_current_users(data):
    try:
        qID = data['qID']
        current_users = get('queues', qID + '.current_users')
        if current_users == None:
            return {'response': constants.QID_DOES_NOT_EXIST}

        ret = []
        for user in current_users:
            ret.append(user['displayName'])

        return {'response': constants.SUCCESS, 'data': {'current_users': ret}}
    except KeyError as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.ILL_FORMED_DATA}
    except Exception as exc:
        print(exc, file=sys.stderr)
        return {'response': constants.SERVER_ERROR}

# @socketio.on('disconnect')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80, debug=True)