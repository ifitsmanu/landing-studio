#!/usr/bin/env bash
# encode.sh — frames → delivery masters (motion-video skill)
# Presets per references/delivery.md: H.264 master + WebM alternate + poster.
#
# Usage:
#   ./encode.sh <frames_dir> <fps> <out_base> [audio.wav] [--loop]
#
#   <frames_dir>  directory of frame_%05d.png from capture.mjs
#   <fps>         must match the capture fps
#   <out_base>    e.g. dist/master  →  dist/master.mp4, .webm, -poster.jpg
#   [audio.wav]   optional mixed audio (launch films; hero loops stay silent)
#   [--loop]      hero-loop budget: strip audio, CRF 24, 720p-class scale
set -euo pipefail

FRAMES="${1:?frames dir}"; FPS="${2:?fps}"; OUT="${3:?out base}"
AUDIO="${4:-}"; [[ "${AUDIO}" == "--loop" ]] && { AUDIO=""; set -- "$@" ; }
LOOP=0; for a in "$@"; do [[ "$a" == "--loop" ]] && LOOP=1; done

mkdir -p "$(dirname "$OUT")"
IN=(-framerate "$FPS" -i "$FRAMES/frame_%05d.png")

# The three flags whose absence breaks playback somewhere: even dims enforced
# by scale-to-even, yuv420p, +faststart.
EVEN='scale=trunc(iw/2)*2:trunc(ih/2)*2'

if [[ "$LOOP" == "1" ]]; then
  # Hero loop: silent (-an), aggressive budget, page-weight first (delivery.md).
  ffmpeg -y "${IN[@]}" -an -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p \
    -movflags +faststart -vf "scale=1280:-2" "${OUT}.mp4"
  ffmpeg -y "${IN[@]}" -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
    -vf "scale=1280:-2" "${OUT}.webm"
elif [[ -n "$AUDIO" ]]; then
  ffmpeg -y "${IN[@]}" -i "$AUDIO" -c:v libx264 -crf 18 -preset slow \
    -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart \
    -vf "$EVEN" "${OUT}.mp4"
  ffmpeg -y -i "${OUT}.mp4" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 \
    -c:a libopus -b:a 128k "${OUT}.webm"
else
  ffmpeg -y "${IN[@]}" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
    -movflags +faststart -vf "$EVEN" "${OUT}.mp4"
  ffmpeg -y -i "${OUT}.mp4" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -an \
    "${OUT}.webm"
fi

# Poster = frame one BY DESIGN (the beat sheet made frame one a poster).
ffmpeg -y -i "${OUT}.mp4" -vf "select=eq(n\,0)" -frames:v 1 -update 1 -q:v 2 "${OUT}-poster.jpg"

echo "→ ${OUT}.mp4  ${OUT}.webm  ${OUT}-poster.jpg"
if [[ "$LOOP" == "1" ]]; then
  du -h "${OUT}.mp4" "${OUT}.webm"
  echo "   (hero-loop budget: aim ≤2–4 MB — see references/delivery.md)"
fi
