#!/usr/bin/env bash

# Compile static files for and serve web files for a minesweeper game server.
# Meant to be run from the root of the repository.
#
# Set DEV to "backend" to enable hot reloading of server code.
# Set DEV to "frontend" to automatically regenerate static files upon client changes.
#
# Usage:
# ./bin/start-server.sh
# DEV=backend ./bin/start-server.sh
# DEV=frontend ./bin/start-server.sh

set -euo pipefail

DEV="${DEV:-}"
artifacts_dir="$(pwd)/artifacts/"

# Cleanup child processes when this script is stopped
current_pid=$$
trap 'echo "Cleaning up minesweeper server"; pkill --parent $current_pid' SIGINT SIGTERM EXIT

# Generate static files
pushd "$(pwd)/frontend"
webpack_base_args=(--env minesweeper_static_folder="$artifacts_dir")

if [[ "$DEV" == "frontend" ]]; then
    npx webpack "${webpack_base_args[@]}" --mode=development --watch &
else
    npx webpack "${webpack_base_args[@]}" --mode=production
fi
popd

# Serve static files and start game server
pushd "$(pwd)/backend"
gunicorn_base_args=(--worker-class=eventlet --workers=1 server:app)

if [[ "$DEV" == "backend" ]]; then
    MINESWEEPER_STATIC_FOLDER="$artifacts_dir" poetry run gunicorn "${gunicorn_base_args[@]}" --reload &
else
    MINESWEEPER_STATIC_FOLDER="$artifacts_dir" poetry run gunicorn "${gunicorn_base_args[@]}"
fi
popd

# Infinite loop so that this script must be killed to end
while true; do
    sleep 1
done
