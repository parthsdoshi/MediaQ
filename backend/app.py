import os, time, random, string, json
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
import redis

app = Flask(__name__, static_folder='/build')
socketio = SocketIO(app)
database = redis.Redis(host='database', port=6379)

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

def incr_id():
    retries = 5
    while True:
        try:
            return database.incr('id')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

def get(key):
    retries = 5
    while True:
        try:
            return database.get(key)
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

def set(key, value):
    retries = 5
    while True:
        try:
            return database.set(key, value)
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)


# just some info about the socketio library...
# calling just 'emit' sends back to the sender
# calling 'socketio.emit' sends back to everyone
# HOWEVER, for both of them you can define namespaces/rooms
# and thus make their behavior the same

# TL;DR: socketio functions are NOT context aware

@socketio.on('create')
def handle_create(data):
    random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=4))

    while(get(random_id) != None):
        random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=4))

    qID = random_id
    room = qID

    queue_info = {'queue': []}
    set(qID, json.dumps(queue_info))

    join_room(room)

    # random_id should always equal room here
    emit('create', {'qID': random_id}, room=room)


@socketio.on('join')
def handle_join(data):
    print(data)
    qID = data['qID']
    room = qID
    displayName = data['displayName']

    queue_info = json.loads(get(qID))
    print(queue_info)

    if (queue_info == None):
        # TODO: change errco to be a dictionary to keep it consistent
        emit('join', 'ERRCO 1: ROOM DOES NOT EXIST')
        return

    join_room(room)
    emit('join', {'displayName': displayName}, room=room, include_self=False)
    emit('join', queue_info)

@socketio.on('leave')
def handle_leave(data):
    print(data)
    room = data['qID']
    displayName = data['displayName']
    # include_self set to True because the website should wait till we've confirmed
    # that the user has been removed...
    emit('leave', {'displayName': displayName}, room=room, include_self=True)
    leave_room(data['qID'])

@socketio.on('addToQueue')
def handle_add_to_queue(data):
    print(data)
    room = ''
    for val in rooms():
        if (val != request.sid):
            room = val
            break
    qID = room

    # should probably add some error handling...
    queue_info = json.loads(get(qID))
    queue_info['queue'].append(data['rowData'])
    set(qID, json.dumps(queue_info))

    # should include_self be set to true here?
    emit('addToQueue', data['rowData'], room=room, include_self=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80, debug=False)
