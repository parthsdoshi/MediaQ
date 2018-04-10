import os
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_folder='/build')
socketio = SocketIO(app)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if (path == "create"):
        return "hi create"
    if (path == "join"):
        return request.args.get("queueid")
    if(path == ""):
        return send_from_directory('/build', 'index.html')
    else:
        if(os.path.exists("/build/" + path)):
            return send_from_directory('/build', path)
        else:
            return send_from_directory('/build', 'index.html')

@socketio.on('create')
def handle_join(data):
    emit('create', 1)

# TODO: broadcasting - a socketio feature 
# TODO: namespace creations based on group ids
@socketio.on('join')
def handle_join(data):
    emit('join', 1)

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=80)
    socketio.run(app, host='0.0.0.0', port=80)
