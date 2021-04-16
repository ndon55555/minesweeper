#!/usr/bin/env bash

set -euo pipefail

artifacts_dir="$(pwd)/artifacts/"

# Generate static files
pushd "$(pwd)/frontend"
npx webpack --env minesweeper_static_folder="$artifacts_dir"
popd

# Serve static files and start game server
pushd "$(pwd)/backend"
MINESWEEPER_STATIC_FOLDER="$artifacts_dir" poetry run gunicorn --worker-class=eventlet --workers=1 server:app
popd
