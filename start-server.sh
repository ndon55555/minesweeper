#!/usr/bin/env bash

MINESWEEPER_STATIC_FOLDER="./static/" gunicorn --worker-class=eventlet --workers=1 server:app