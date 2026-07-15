#!/usr/bin/env bash
# encode.sh — deterministic frames + explicit poster → delivery masters
set -euo pipefail

FRAMES="${1:?frames dir}"
FPS="${2:?fps}"
OUT="${3:?out base}"
shift 3

POSTER="$FRAMES/poster.png"
AUDIO=""
LOOP=0
while (($#)); do
  case "$1" in
    --poster) POSTER="${2:?--poster needs a path}"; shift 2 ;;
    --audio) AUDIO="${2:?--audio needs a path}"; shift 2 ;;
    --loop) LOOP=1; shift ;;
    *) echo "encode: unknown option: $1" >&2; exit 1 ;;
  esac
done

command -v ffmpeg >/dev/null || { echo "encode: ffmpeg is required" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "encode: ffprobe is required" >&2; exit 1; }
[[ "$FPS" =~ ^[0-9]+([.][0-9]+)?$ ]] || { echo "encode: fps must be numeric" >&2; exit 1; }
[[ -f "$FRAMES/frame_00000.png" ]] || { echo "encode: no frame_00000.png in $FRAMES" >&2; exit 1; }
[[ -s "$POSTER" ]] || { echo "encode: explicit poster not found or empty: $POSTER" >&2; exit 1; }
[[ -z "$AUDIO" || -f "$AUDIO" ]] || { echo "encode: audio file not found: $AUDIO" >&2; exit 1; }

mkdir -p "$(dirname "$OUT")"
IN=(-framerate "$FPS" -i "$FRAMES/frame_%05d.png")
EVEN='scale=trunc(iw/2)*2:trunc(ih/2)*2'

if [[ "$LOOP" == "1" ]]; then
  ffmpeg -hide_banner -loglevel error -y "${IN[@]}" -an -c:v libx264 -crf 24 -preset slow \
    -pix_fmt yuv420p -movflags +faststart -vf "scale='min(1280,iw)':-2" "${OUT}.mp4"
  ffmpeg -hide_banner -loglevel error -y "${IN[@]}" -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
    -vf "scale='min(1280,iw)':-2" "${OUT}.webm"
elif [[ -n "$AUDIO" ]]; then
  ffmpeg -hide_banner -loglevel error -y "${IN[@]}" -i "$AUDIO" -c:v libx264 -crf 18 -preset slow \
    -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart -vf "$EVEN" "${OUT}.mp4"
  ffmpeg -hide_banner -loglevel error -y -i "${OUT}.mp4" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 \
    -c:a libopus -b:a 128k "${OUT}.webm"
else
  ffmpeg -hide_banner -loglevel error -y "${IN[@]}" -c:v libx264 -crf 18 -preset slow \
    -pix_fmt yuv420p -movflags +faststart -vf "$EVEN" "${OUT}.mp4"
  ffmpeg -hide_banner -loglevel error -y -i "${OUT}.mp4" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 \
    -an "${OUT}.webm"
fi

ffmpeg -hide_banner -loglevel error -y -i "$POSTER" -frames:v 1 -q:v 2 "${OUT}-poster.jpg"

PROBE="${OUT}-probe.json"
node "$(dirname "$0")/inspect-media.mjs" "$PROBE" "${OUT}.mp4" "${OUT}.webm"
node --input-type=module - "$PROBE" "${OUT}-metadata.json" "$POSTER" "$LOOP" <<'NODE'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
const [, , probePath, outputPath, poster, loop] = process.argv;
const { media } = JSON.parse(readFileSync(probePath, 'utf8'));
const [video, alternate] = media;
writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: 1,
  video,
  alternate,
  poster,
  loop: loop === '1',
}, null, 2)}\n`);
unlinkSync(probePath);
NODE

echo "-> ${OUT}.mp4  ${OUT}.webm  ${OUT}-poster.jpg  ${OUT}-metadata.json"
