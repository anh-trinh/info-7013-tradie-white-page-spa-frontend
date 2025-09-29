#!/usr/bin/env bash
set -euo pipefail

BASE_PORT=${DEV_BASE_PORT:-5173}
MAX_TRIES=20
CURRENT=$BASE_PORT

find_free_port() {
  local port=$1
  # Check if port is free (works on Linux)
  if ss -ltn 2>/dev/null | awk '{print $4}' | grep -q ":${port}$"; then
    return 1
  fi
  return 0
}

while ! find_free_port "$CURRENT"; do
  CURRENT=$((CURRENT+1))
  if [ $((CURRENT-BASE_PORT)) -ge $MAX_TRIES ]; then
    echo "[dev] Could not find a free port in range ${BASE_PORT}-${BASE_PORT}+${MAX_TRIES}" >&2
    exit 1
  fi
done

echo "[dev] Starting Vite on free port: $CURRENT";
# Export so Vite picks it up if reading from env
export PORT=$CURRENT
# Run Vite directly (keep host binding)
exec npx vite --host 0.0.0.0 --port "$CURRENT" "$@"
