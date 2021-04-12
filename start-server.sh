#!/usr/bin/env bash

MINESWEEPER_STATIC_FOLDER="./browser/" gunicorn --worker-class=eventlet --workers=1 server:app