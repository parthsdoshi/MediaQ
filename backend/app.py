import os, time, random, string, json
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
    displayName = data['data']

    random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=4))

    while(get('queues', random_id) != None):
        random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=4))

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


@socketio.on(constants.JOIN)
def handle_join(data):
    # print(data)
    qID = data['qID']
    displayName = data['data']

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
    emit(constants.USERJOINED, {'data': displayName, 'response': constants.SUCCESS}, room=qID, include_self=False)
    return {'response': constants.SUCCESS, 'data': usersArr}
 
 
@socketio.on(constants.LEAVE)
def handle_leave(data):
    qID = data['qID']
    displayName = data['data']

    queue_info = get('queues', qID)
    if (queue_info == None):
        return {'response': constants.QID_DOES_NOT_EXIST}

    current_user = {'sid': request.sid, 'displayName': displayName}
    for i in range(queue_info['connected_users'].length):
        if queue_info['connected_users'][i] == current_user:
            tryDatabaseCommand('json.arrpop', 'queues', qID + '.connected_users', i)
            break

    leave_room(qID)
    emit(constants.USERLEFT, {'data': displayName, 'response': constants.SUCCESS}, room=qID, include_self=False)
    return {'response': constants.SUCCESS}


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

@socketio.on(constants.ADDMEDIA)
@socketio.on(constants.ADDMEDIAS)
def handle_add_medias(data):
    qID = data['qID']
    queue_info = get('queues', qID)
    if (queue_info == None):
        return {'response': constants.QID_DOES_NOT_EXIST}

    media = data['data']

    for key, value in media:
        set('queues', 'queue.' + key, value)

    emit(constants.MEDIASADDED, {'data': media, 'response': constants.SUCCESS}, room=qID, include_self=False)
    return {'response': constants.SUCCESS}

# @socketio.on('disconnect')
# def handle_disconnect():
#     for room in rooms():
#         if (room != request.sid):
#             queue_info = json.loads(get(room))
#             for connected_user in queue_info['connected_users']:
#                 if (connected_user['sid'] == request.sid):
#                     displayName = connected_user['displayName']
#                     emit('leave', {'displayName': displayName}, room=room, include_self=False)
#                     queue_info['connected_users'].remove(connected_user)
# 
#             leave_room(room)
# 
# 
# # should probably not be used since the user already grabs current queue when they join
# @socketio.on('getQueueInfo')
# def handle_get_queue(data):
#     # print(data)
#     qID = data['qID']
#     queue_info = json.loads(get(qID))
#     emit('getQueueInfo', queue_info['queue'])
# 
# 
# 
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80, debug=True)