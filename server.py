import eventlet
eventlet.monkey_patch()

import json
import os

from flask import Flask, redirect, url_for
from flask_socketio import SocketIO, emit

from minesweeper import core

app = Flask(__name__, static_url_path="", static_folder="browser")
socketio = SocketIO(app)
board = core.Board(rows=10, cols=10, mines=10)


@app.route("/")
def open_page():
    return redirect("index.html")


@socketio.on("board")
def get_board():
    emit("board", json.dumps(getTileData()))


@socketio.on("open")
def open_tile(row, col):
    tiles = board.tile_open(row, col)
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
    socketio.run(app, port=os.getenv("PORT", "8080"))
