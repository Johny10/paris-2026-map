#!/bin/zsh
set -euo pipefail
ROOT_DIR="/Users/marcbokobza/Documents/Playground/paris-2026-map"
URL="$("$ROOT_DIR/scripts/serve-local.sh" 8123)"
open "$URL"
