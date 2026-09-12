#!/bin/bash
# Builds the icon-suggester Swift helper (calls Apple Intelligence /
# FoundationModels on-device to suggest a routine's emoji) as a single
# universal (arm64 + x86_64) binary, then copies it to both target-triple
# names Tauri's externalBin expects — one real universal Mach-O under each
# name, so `tauri build --target universal-apple-darwin` finds a valid sidecar
# for either arch it's assembling.
set -euo pipefail

cd "$(dirname "$0")/.."
SIDECAR_DIR="src-tauri/sidecar/icon-suggester"
OUT_DIR="src-tauri/binaries"
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"

mkdir -p "$OUT_DIR"
(cd "$SIDECAR_DIR" && swift build -c release --arch arm64 --arch x86_64)

cp "$SIDECAR_DIR/.build/apple/Products/Release/icon-suggester" \
  "$OUT_DIR/icon-suggester-aarch64-apple-darwin"
cp "$SIDECAR_DIR/.build/apple/Products/Release/icon-suggester" \
  "$OUT_DIR/icon-suggester-x86_64-apple-darwin"
cp "$SIDECAR_DIR/.build/apple/Products/Release/icon-suggester" \
  "$OUT_DIR/icon-suggester-universal-apple-darwin"
chmod +x "$OUT_DIR"/icon-suggester-*
echo "icon-suggester (universal) built -> $OUT_DIR/icon-suggester-{aarch64,x86_64,universal}-apple-darwin"
