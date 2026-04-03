#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8123}"
PID_FILE="${TMPDIR:-/tmp}/paris-2026-map-${PORT}.pid"
LOG_FILE="${TMPDIR:-/tmp}/paris-2026-map-${PORT}.log"
URL="http://127.0.0.1:${PORT}/index.html"

if ! curl -fsS "$URL" >/dev/null 2>&1; then
  if [[ -f "$PID_FILE" ]]; then
    OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [[ -n "${OLD_PID}" ]] && kill -0 "$OLD_PID" >/dev/null 2>&1; then
      kill "$OLD_PID" >/dev/null 2>&1 || true
    fi
    rm -f "$PID_FILE"
  fi

  cd "$ROOT_DIR"
  python3 -m http.server "$PORT" --bind 127.0.0.1 >"$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo "$SERVER_PID" >"$PID_FILE"

  for _ in {1..20}; do
    if curl -fsS "$URL" >/dev/null 2>&1; then
      break
    fi
    sleep 0.25
  done
fi

echo "$URL"
