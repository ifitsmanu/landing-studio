#!/usr/bin/env bash
# cutdowns.sh — 16:9 master → per-platform aspect crops (motion-video skill)
# Mechanical ONLY if the master was composed center-safe at beat-sheet time
# (references/beat-sheets.md). Re-timed cuts (the 1.5s feed hook) are edit
# decisions from the sheet's cutdown tags — not trims done here.
#
# Usage:
#   ./cutdowns.sh <master.mp4> <out_dir> [x_offset_1x1] [x_offset_4x5]
#     x offsets in px let a scene's off-center action survive the crop;
#     defaults center the crop on a 1920x1080 master.
set -euo pipefail

MASTER="${1:?master file}"; OUTDIR="${2:?out dir}"
X11="${3:-420}"    # 1920 → 1080 wide: (1920-1080)/2
X45="${4:-528}"    # 1920 →  864 wide: (1920-864)/2
command -v ffmpeg >/dev/null || { echo "cutdowns: ffmpeg is required" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "cutdowns: ffprobe is required" >&2; exit 1; }
[[ -f "$MASTER" ]] || { echo "cutdowns: master file not found: $MASTER" >&2; exit 1; }
[[ "$X11" =~ ^[0-9]+$ && "$X45" =~ ^[0-9]+$ ]] || {
  echo "cutdowns: crop offsets must be non-negative integers" >&2
  exit 1
}
IFS=x read -r SRC_W SRC_H < <(
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
    -of csv=s=x:p=0 "$MASTER"
)
if [[ "$SRC_W" != "1920" || "$SRC_H" != "1080" ]]; then
  echo "cutdowns: expected a 1920x1080 master, got ${SRC_W:-unknown}x${SRC_H:-unknown}; re-render native aspect ratios or provide the documented master" >&2
  exit 1
fi
mkdir -p "$OUTDIR"

ENC=(-c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a copy)

# 1:1 (1080x1080)
ffmpeg -y -i "$MASTER" -vf "crop=1080:1080:${X11}:0" "${ENC[@]}" "$OUTDIR/cut-1x1.mp4"

# 4:5 (864x1080)
ffmpeg -y -i "$MASTER" -vf "crop=864:1080:${X45}:0" "${ENC[@]}" "$OUTDIR/cut-4x5.mp4"

# 9:16 — prefer a true re-render at 1080x1920 (Remotion: same comp, different
# metadata; vendored floor: re-capture at --width 1080 --height 1920).
# This fallback crop is only acceptable if the beat sheet planned a
# vertical-safe zone; it discards ~70% of the frame.
ffmpeg -y -i "$MASTER" -vf "crop=607:1080:656:0,scale=1080:1920" \
  "${ENC[@]}" "$OUTDIR/cut-9x16.mp4"
echo "NOTE: cut-9x16.mp4 is a fallback crop — prefer a native vertical render." >&2

echo "→ $OUTDIR/cut-1x1.mp4  cut-4x5.mp4  cut-9x16.mp4"
echo "Next: burn captions on feed cuts (references/delivery.md §Captions),"
echo "      then the phone-size legibility pass (references/qa.md)."
