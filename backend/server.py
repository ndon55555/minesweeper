import eventlet

eventlet.monkey_patch()

import errno
import json
import logging
import os
import sys

from flask import Flask, redirect
from flask_socketio import SocketIO, emit
from logdecorator import log_on_start
from minesweeper import core

logging.basicConfig()
GAME_LOGGER = logging.getLogger("minesweeper")
GAME_LOGGER.setLevel(logging.INFO)


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
GAME_LOGGER.info("Setting up minesweeper board")
board = core.Board(rows=16, cols=16, mines=40)


@app.route("/")
def open_page():
    return redirect("index.html")


@socketio.on("board")
@log_on_start(logging.INFO, "Board state requested", logger=GAME_LOGGER)
def get_board():
    emit("board", json.dumps(getTileData()))


@socketio.on("open")
@log_on_start(
    logging.INFO,
    "Attempting to open tile at row {row}, column {col}",
    logger=GAME_LOGGER,
)
def open_tile(row, col):
    board.tile_open(row, col)
    emit("open", json.dumps(getTileData()), broadcast=True)


@socketio.on("reset")
@log_on_start(logging.INFO, "Resetting game", logger=GAME_LOGGER)
def reset_game():
    board.game_reset()
    emit("board", json.dumps(getTileData()), broadcast=True)


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
