import eventlet

eventlet.monkey_patch()

import errno
import json
import logging
import os
import sys

from flask import Flask, redirect
from flask_socketio import SocketIO, emit

from minesweeper import core


def get_static_folder():
    STATIC_FOLDER_ENV_VAR = "MINESWEEPER_STATIC_FOLDER"
    folder = os.getenv(STATIC_FOLDER_ENV_VAR)

    if folder is None:
        logging.error(
            f"{STATIC_FOLDER_ENV_VAR} variable must be set in the environment."
        )
        sys.exit(errno.EINTR)

    return folder


app = Flask(__name__, static_url_path="", static_folder=get_static_folder())

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
    board.tile_open(row, col)
    emit("open", json.dumps(getTileData()), broadcast=True)


def getTileData():
    tiles = []
    for r in range(board.rows):
        row_tiles = []
        tiles.append(row_tiles)
        for c in range(board.cols):
            row_tiles.append(board._tiles[r][c].type)
    return tiles


def main():
    socketio.run(app, port=os.getenv("PORT", "8080"))


if __name__ == "__main__":
    main()
