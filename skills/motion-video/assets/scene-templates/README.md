# Scene Templates — reproducible browser-capture fallback

Gated-CSS HTML scenes + a clock-controlled capture script + ffmpeg encode/cutdown
scripts. Requires Node.js, the locked Playwright dependency and Chromium, plus
`ffmpeg`/`ffprobe`. Templates make no network requests; live-URL capture naturally may.

## Files

| File | What it is |
|---|---|
| `brand.example.css` | The brand-kit variable sheet. **Every value is a placeholder** — copy to `brand.css` and fill from the kit before rendering anything. |
| `kinetic-type-card.html` | Claim/section card: blur-up reveal + optional per-word cascade. Text via URL params. |
| `staged-ui-frame.html` | Staged product window on a canvas: camera push-in, staggered panel reveal, choreographed cursor with hesitation beat + click ripple. |
| `end-card.html` | The CTA close: wordmark + verb + destination, one settle, then designed stillness. Params via URL. |
| `capture.mjs` | Clock-controlled Playwright frame capture (seek mode for these templates; CDP virtual-time mode for arbitrary live URLs), explicit poster, and capture metadata. |
| `encode.sh` | Frames + explicit poster → H.264/WebM masters, JPEG poster, and inspected metadata. |
| `cutdowns.sh` | Validated 16:9 master → 1:1 / 4:5 / 9:16 fallbacks, or transcodes of native aspect compositions. |
| `inspect-media.mjs` | `ffprobe` wrapper used by the encode and cutdown metadata gates. |

## How gating works

Every animation in a template is fully declared in CSS — durations, delays
(the beat sheet), curves — but nothing plays until the `play` class lands on
`<html>`. The capture script adds the class, immediately pauses every animation,
then **seeks** the document to each frame's timestamp and screenshots. Time is
an axis you index, not a stream you race. This removes real-time capture jitter;
verify output when the browser, fonts, OS rendering, or dependencies change.
(Recipe rationale: `references/ui-cinematography.md`.)

Open a template in a normal browser and add `?preview=1` to watch it play in
real time while designing.

## Quickstart

```bash
# One-time setup
npm ci
npx playwright install chromium
ffmpeg -version
ffprobe -version

# 1. Fill the kit
# Edit brand.css using approved values from brand.example.css

# 2. Preview a scene live
open "kinetic-type-card.html?text=Answers,%20not%20dashboards.&preview=1"

# 3. Capture frames and the intentional static/reduced-motion poster
node capture.mjs --url "kinetic-type-card.html?text=Answers,%20not%20dashboards." \
  --out out/claim --fps 30 --duration 4 --width 1920 --height 1080 \
  --poster-time 2

# Produces:
# out/claim/frame_00000.png ... out/claim/poster.png
# out/claim/capture-metadata.json

# 4. Encode the same capture (master + alternate + poster + metadata)
./encode.sh out/claim 30 dist/claim --poster out/claim/poster.png

# Produces:
# dist/claim.mp4, dist/claim.webm, dist/claim-poster.jpg,
# dist/claim-metadata.json

# 5. Cutdowns from that 16:9 master
./cutdowns.sh dist/claim.mp4 dist/cutdowns

# Produces cut-1x1.mp4, cut-4x5.mp4, cut-9x16.mp4,
# and cutdowns-metadata.json under dist/cutdowns/
```

Scenes are captured individually and assembled on the music grid with ffmpeg
concat (or any editor). For films with heavy per-scene interleaving, prefer a
real engine (`references/tech.md`) — this floor is optimized for reliability,
not editing comfort.

## Composition lane vs encode lane

Use **Remotion as the composition lane** when React components, shared scenes,
data-driven variants, or native aspect-ratio compositions add real leverage.
Its compositions own timing, layout, and art direction. Verify current Remotion
licensing and runtime requirements before adoption.

Use **FFmpeg as the deterministic encode and inspection lane** after composition.
The scripts here own codecs, pixel format, poster conversion, metadata inspection,
and delivery cutdowns. FFmpeg is not a substitute for re-composing text, UI, or
focal action for vertical placements. Pass `--native-1x1`, `--native-4x5`, or
`--native-9x16` to `cutdowns.sh` when those art-directed renders exist; its center
crops are explicitly labeled fallbacks in `cutdowns-metadata.json`.

`--width` and `--height` are logical capture dimensions. The encoded dimensions
match them by default. `--scale 2` is an explicit 2× raster request and is recorded
in `capture-metadata.json`.

## Rules

- Brand values live ONLY in `brand.css`. If you type a hex, font name, or brand
  string into a template, you've broken portability — parameterize it.
- Words on cards come from the approved beat sheet, via URL params — not edited
  into the HTML (keeps the sheet the single source of truth).
- Every template's resting frame must pass the poster test; these files double
  as the storyboard tool.
- `--poster-time` is mandatory and must land on visible content. Capture fails
  instead of silently shipping a blank poster.
- Capture into a fresh output directory. The script rejects existing frame files
  so a shorter rerun cannot silently retain stale trailing frames.
- `cutdowns.sh` accepts any even-dimension exact 16:9 master. Prefer native aspect
  compositions over its fallback center crops whenever layout meaning changes.
