#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$ROOT_DIR/docs"

mkdir -p "$DOCS_DIR/data" "$DOCS_DIR/vendor/leaflet"

cp "$ROOT_DIR/index.html" "$DOCS_DIR/index.html"
cp "$ROOT_DIR/app.js" "$DOCS_DIR/app.js"
cp "$ROOT_DIR/styles.css" "$DOCS_DIR/styles.css"
cp "$ROOT_DIR/data/official-history.js" "$DOCS_DIR/data/official-history.js"
cp "$ROOT_DIR/data/paris-2026-local.js" "$DOCS_DIR/data/paris-2026-local.js"
cp "$ROOT_DIR/vendor/leaflet/leaflet.css" "$DOCS_DIR/vendor/leaflet/leaflet.css"
cp "$ROOT_DIR/vendor/leaflet/leaflet.js" "$DOCS_DIR/vendor/leaflet/leaflet.js"
touch "$DOCS_DIR/.nojekyll"

echo "Build complete: docs/ synced from root."
