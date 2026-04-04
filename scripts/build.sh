#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$ROOT_DIR/docs"
BUILD_VERSION="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || date +%s)"

mkdir -p "$DOCS_DIR/data" "$DOCS_DIR/vendor/leaflet"

cp "$ROOT_DIR/index.html" "$DOCS_DIR/index.html"
cp "$ROOT_DIR/app.js" "$DOCS_DIR/app.js"
cp "$ROOT_DIR/styles.css" "$DOCS_DIR/styles.css"
cp "$ROOT_DIR/data/official-history.js" "$DOCS_DIR/data/official-history.js"
cp "$ROOT_DIR/data/paris-2026-local.js" "$DOCS_DIR/data/paris-2026-local.js"
cp "$ROOT_DIR/vendor/leaflet/leaflet.css" "$DOCS_DIR/vendor/leaflet/leaflet.css"
cp "$ROOT_DIR/vendor/leaflet/leaflet.js" "$DOCS_DIR/vendor/leaflet/leaflet.js"
touch "$DOCS_DIR/.nojekyll"

python3 - <<PY
from pathlib import Path

index_path = Path(r"$DOCS_DIR/index.html")
html = index_path.read_text()
version = "$BUILD_VERSION"
replacements = {
    './vendor/leaflet/leaflet.css': f'./vendor/leaflet/leaflet.css?v={version}',
    './styles.css': f'./styles.css?v={version}',
    './vendor/leaflet/leaflet.js': f'./vendor/leaflet/leaflet.js?v={version}',
    './data/official-history.js': f'./data/official-history.js?v={version}',
    './data/paris-2026-local.js': f'./data/paris-2026-local.js?v={version}',
    './app.js': f'./app.js?v={version}',
}
for old, new in replacements.items():
    html = html.replace(old, new)
index_path.write_text(html)
PY

echo "Build complete: docs/ synced from root with asset version $BUILD_VERSION."
