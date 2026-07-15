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
| `capture.mjs` | Clock-controlled Playwright frame capture (seek mode for these templates; CDP virtual-time mode for arbitrary live URLs). |
| `encode.sh` | Frames → H.264 + WebM masters + poster, per `references/delivery.md`. |
| `cutdowns.sh` | Master → 1:1 / 4:5 / 9:16 crops with per-scene offsets. |

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

# 3. Capture frames (deterministic)
node capture.mjs --url "kinetic-type-card.html?text=Answers,%20not%20dashboards." \
  --out out/claim --fps 30 --duration 4 --width 1920 --height 1080

# 4. Encode (master + webm + poster)
./encode.sh out/claim 30 dist/claim

# 5. Cutdowns from a composed master
./cutdowns.sh dist/master.mp4 dist/
```

Scenes are captured individually and assembled on the music grid with ffmpeg
concat (or any editor). For films with heavy per-scene interleaving, prefer a
real engine (`references/tech.md`) — this floor is optimized for reliability,
not editing comfort.

## Rules

- Brand values live ONLY in `brand.css`. If you type a hex, font name, or brand
  string into a template, you've broken portability — parameterize it.
- Words on cards come from the approved beat sheet, via URL params — not edited
  into the HTML (keeps the sheet the single source of truth).
- Every template's resting frame must pass the poster test; these files double
  as the storyboard tool.
- Capture into a fresh output directory. The script rejects existing frame files
  so a shorter rerun cannot silently retain stale trailing frames.
- `cutdowns.sh` accepts a 1920×1080 master only. Re-render native aspect ratios
  for other masters or adapt the crop plan explicitly.
