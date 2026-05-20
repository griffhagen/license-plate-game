#!/bin/bash
# Requires ImageMagick (brew install imagemagick) or use any PNG exporter from icon.svg
DIR="$(cd "$(dirname "$0")/.." && pwd)/public/icons"
if command -v magick &>/dev/null; then
  magick -background none "$DIR/icon.svg" -resize 192x192 "$DIR/icon-192.png"
  magick -background none "$DIR/icon.svg" -resize 512x512 "$DIR/icon-512.png"
  echo "Icons generated."
elif command -v convert &>/dev/null; then
  convert -background none "$DIR/icon.svg" -resize 192x192 "$DIR/icon-192.png"
  convert -background none "$DIR/icon.svg" -resize 512x512 "$DIR/icon-512.png"
  echo "Icons generated."
else
  echo "Install ImageMagick to generate PNG icons, or add icon-192.png and icon-512.png manually."
  exit 1
fi
