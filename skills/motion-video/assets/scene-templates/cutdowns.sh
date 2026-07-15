#!/usr/bin/env bash
# cutdowns.sh — validate a 16:9 master and create placement-specific fallback crops.
# Native aspect renders may be supplied to preserve art direction.
set -euo pipefail

MASTER="${1:?master file}"
OUTDIR="${2:?out dir}"
shift 2
NATIVE11=""; NATIVE45=""; NATIVE916=""
while (($#)); do
  case "$1" in
    --native-1x1) NATIVE11="${2:?path required}"; shift 2 ;;
    --native-4x5) NATIVE45="${2:?path required}"; shift 2 ;;
    --native-9x16) NATIVE916="${2:?path required}"; shift 2 ;;
    *) echo "cutdowns: unknown option: $1" >&2; exit 1 ;;
  esac
done

command -v ffmpeg >/dev/null || { echo "cutdowns: ffmpeg is required" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "cutdowns: ffprobe is required" >&2; exit 1; }
[[ -f "$MASTER" ]] || { echo "cutdowns: master file not found: $MASTER" >&2; exit 1; }

dimensions() {
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$1"
}
IFS=x read -r SRC_W SRC_H <<<"$(dimensions "$MASTER")"
[[ "$SRC_W" =~ ^[0-9]+$ && "$SRC_H" =~ ^[0-9]+$ ]] || { echo "cutdowns: unreadable video dimensions" >&2; exit 1; }
((SRC_W % 2 == 0 && SRC_H % 2 == 0)) || { echo "cutdowns: input dimensions must be even" >&2; exit 1; }
((SRC_W * 9 == SRC_H * 16)) || { echo "cutdowns: expected a 16:9 master, got ${SRC_W}x${SRC_H}" >&2; exit 1; }
mkdir -p "$OUTDIR"

ENC=(-c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k)

transcode_native() {
  local input="$1" expected_num="$2" expected_den="$3" output="$4"
  [[ -f "$input" ]] || { echo "cutdowns: native source not found: $input" >&2; exit 1; }
  local width height
  IFS=x read -r width height <<<"$(dimensions "$input")"
  ((width * expected_den == height * expected_num)) || {
    echo "cutdowns: native source $input has wrong aspect ${width}x${height}" >&2
    exit 1
  }
  ffmpeg -hide_banner -loglevel error -y -i "$input" -map 0:v:0 -map '0:a?' "${ENC[@]}" "$output"
}

if [[ -n "$NATIVE11" ]]; then
  transcode_native "$NATIVE11" 1 1 "$OUTDIR/cut-1x1.mp4"
else
  X11=$(((SRC_W - SRC_H) / 2))
  ffmpeg -hide_banner -loglevel error -y -i "$MASTER" -map 0:v:0 -map '0:a?' \
    -vf "crop=${SRC_H}:${SRC_H}:${X11}:0" "${ENC[@]}" "$OUTDIR/cut-1x1.mp4"
fi

if [[ -n "$NATIVE45" ]]; then
  transcode_native "$NATIVE45" 4 5 "$OUTDIR/cut-4x5.mp4"
else
  W45=$((SRC_H * 4 / 5)); W45=$((W45 / 2 * 2)); X45=$(((SRC_W - W45) / 2))
  ffmpeg -hide_banner -loglevel error -y -i "$MASTER" -map 0:v:0 -map '0:a?' \
    -vf "crop=${W45}:${SRC_H}:${X45}:0" "${ENC[@]}" "$OUTDIR/cut-4x5.mp4"
fi

if [[ -n "$NATIVE916" ]]; then
  transcode_native "$NATIVE916" 9 16 "$OUTDIR/cut-9x16.mp4"
else
  W916=$((SRC_H * 9 / 16)); W916=$((W916 / 2 * 2)); X916=$(((SRC_W - W916) / 2))
  ffmpeg -hide_banner -loglevel error -y -i "$MASTER" -map 0:v:0 -map '0:a?' \
    -vf "crop=${W916}:${SRC_H}:${X916}:0,scale=${SRC_H}:$((SRC_H * 16 / 9))" \
    "${ENC[@]}" "$OUTDIR/cut-9x16.mp4"
  echo "cutdowns: 9:16 used a center-safe fallback crop; pass --native-9x16 for art-directed composition" >&2
fi

node "$(dirname "$0")/inspect-media.mjs" "$OUTDIR/cutdowns-probe.json" \
  "$OUTDIR/cut-1x1.mp4" "$OUTDIR/cut-4x5.mp4" "$OUTDIR/cut-9x16.mp4"
node --input-type=module - "$OUTDIR/cutdowns-probe.json" "$OUTDIR/cutdowns-metadata.json" "$MASTER" "$SRC_W" "$SRC_H" "$NATIVE11" "$NATIVE45" "$NATIVE916" <<'NODE'
import { basename } from 'node:path';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
const [, , probePath, outputPath, input, width, height, native11, native45, native916] = process.argv;
const { media } = JSON.parse(readFileSync(probePath, 'utf8'));
const native = [native11, native45, native916];
writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: 1,
  input: { file: basename(input), width: Number(width), height: Number(height) },
  outputs: media.map((item, index) => ({ ...item, composition: native[index] ? 'native' : 'fallback-crop' })),
}, null, 2)}\n`);
unlinkSync(probePath);
NODE

echo "-> $OUTDIR/cut-1x1.mp4  cut-4x5.mp4  cut-9x16.mp4  cutdowns-metadata.json"
