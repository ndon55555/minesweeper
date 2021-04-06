import json

from flask import Flask, Response, render_template, request
from flask_socketio import SocketIO, emit

from minesweeper import core

app = Flask(__name__, static_folder="browser")
board = core.Board(rows=10, cols=10, mines=30)


socketio = SocketIO(app)


@socketio.on("message")
def handle_message(data):
    print("received message: " + data)
    emit("some event", data, broadcast=True)


@app.route("/")
def open_page():
    return app.send_static_file("index.html")


@app.route("/index.js")
def get_js():
    return app.send_static_file("index.js")


@app.route("/index.css")
def get_css():
    return app.send_static_file("index.css")


@socketio.on("board")
def get_board():
    emit("board", json.dumps(getTileData()))


@socketio.on("open")
def open_tile(row, col):
    tiles = board.tile_open(row, col)

    print(board)
    emit("open", json.dumps(getTileData()), broadcast=True)


def getTileData():
    tiles = []
    for r in range(board.rows):
        row_tiles = []
        tiles.append(row_tiles)
        for c in range(board.cols):
            row_tiles.append(board._tiles[r][c].type)
    return tiles


if __name__ == "__main__":
    socketio.run(app)
