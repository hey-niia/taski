#!/bin/bash
# Builds the icon-suggester Swift helper (calls Apple Intelligence /
# FoundationModels on-device to suggest a routine's emoji) and drops it into
# src-tauri/binaries with the target-triple suffix Tauri's externalBin expects.
set -euo pipefail

cd "$(dirname "$0")/.."
SIDECAR_DIR="src-tauri/sidecar/icon-suggester"
OUT_DIR="src-tauri/binaries"
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"
TRIPLE="$(rustc -vV 2>/dev/null | awk '/^host:/ {print $2}')"
TRIPLE="${TRIPLE:-aarch64-apple-darwin}"

mkdir -p "$OUT_DIR"
(cd "$SIDECAR_DIR" && swift build -c release)
cp "$SIDECAR_DIR/.build/release/icon-suggester" "$OUT_DIR/icon-suggester-$TRIPLE"
chmod +x "$OUT_DIR/icon-suggester-$TRIPLE"
echo "icon-suggester built -> $OUT_DIR/icon-suggester-$TRIPLE"
