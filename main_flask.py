from flask import Flask, Response, request, render_template
from minesweeper import core
import json
app = Flask(__name__, static_folder="browser")
board = core.Board(rows=10, cols=10, mines=30)

@app.route('/')
def open_page():
    return app.send_static_file("index.html")

@app.route('/index.js')
def get_js():
    return app.send_static_file("index.js")

@app.route('/index.css')
def get_css():
    return app.send_static_file("index.css")

@app.route('/board', methods=['GET'])
def get_board():
    return json.dumps(getTileData())

@app.route('/open', methods=['POST'])
def open_tile():
    row = int(request.form.get("row"))
    col = int(request.form.get("col"))
    tiles = board.tile_open(row, col)

    print(board)

    return json.dumps(getTileData())

def getTileData():
    tiles = []
    for r in range(board.rows):
        row_tiles = []
        tiles.append(row_tiles)
        for c in range(board.cols):
            row_tiles.append(board._tiles[r][c].type)
    return tiles