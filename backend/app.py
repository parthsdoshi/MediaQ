import os, time, random, string
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit
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



@socketio.on('create')
def handle_join(data):
    random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=4))

    while(get(random_id) != None):
        random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=4))

    set(random_id, '{}')
    print(get(random_id))
    emit('create', random_id)

# TODO: broadcasting - a socketio feature 
# TODO: namespace creations based on group ids
@socketio.on('join')
def handle_join(data):
    print(data)
    emit('join', incr_id())


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=80)
    socketio.run(app, host='0.0.0.0', port=80, debug=True)
