#!/usr/bin/env bash

gunicorn --worker-class=eventlet --workers=1 server:app