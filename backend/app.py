import os, time
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
    # if (path == "create"):
    #     return "hi create"
    # if (path == "join"):
    #     return request.args.get("queueid")
    if(path == ""):
        return send_from_directory('/build', 'index.html')
    else:
        if(os.path.exists("/build/" + path)):
            return send_from_directory('/build', path)
        else:
            return send_from_directory('/build', 'index.html')

def get_id():
    retries = 5
    while True:
        try:
            return database.incr('id')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@socketio.on('create')
def handle_join(data):
    emit('create', get_id())

# TODO: broadcasting - a socketio feature 
# TODO: namespace creations based on group ids
@socketio.on('join')
def handle_join(data):
    emit('join', get_id())

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=80)
    socketio.run(app, host='0.0.0.0', port=80)
