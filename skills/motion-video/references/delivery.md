# Delivery — the last mile

Encoding and embedding are where films quietly die: a 40MB hero loop that stalls
on 4G kills the hook harder than any creative mistake, and a missing poster
frame throws away the largest audience the film has (everyone who never presses
play). This file protects the hook and the CTA on every stack.

Scripts for everything here ship in `assets/scene-templates/` (`encode.sh`,
`cutdowns.sh`).

## Contents

1. [The encode ladder](#the-encode-ladder)
2. [The poster frame](#the-poster-frame)
3. [Captions](#captions)
4. [Cutdown crops](#cutdown-crops)
5. [Hero-loop budgets and the embed pattern](#hero-loop)
6. [The no-GIF rule](#the-no-gif-rule)
7. [Per-placement export checklists](#per-placement-export-checklists)

## The encode ladder

Master from frames (deterministic pipelines) or from the editor's export.
Always: **even pixel dimensions, `yuv420p`, `+faststart`** — the three flags
whose absence breaks playback in some player somewhere.

```bash
# Frames → H.264 master (universal playback)
ffmpeg -framerate 30 -i frames/frame_%05d.png \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
  -movflags +faststart master.mp4

# + audio master (launch film)
ffmpeg -framerate 30 -i frames/frame_%05d.png -i mix.wav \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart master.mp4

# WebM alternate (smaller at same quality; serve first via <source>)
ffmpeg -i master.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 \
  -c:a libopus -b:a 128k master.webm

# AV1 alternate (best compression, slower encode; modern browsers)
ffmpeg -i master.mp4 -c:v libsvtav1 -crf 32 -preset 6 \
  -c:a libopus -b:a 128k master.av1.webm
```

CRF guide (H.264): 18 = master/archive, 20–23 = web delivery, 23+ only for the
hero loop's aggressive budget. Social platforms re-encode whatever you upload —
upload the *highest* quality master within their size limits so their re-encode
has headroom; never pre-crush for social.

## The poster frame

The poster is **designed, not extracted at random** — it's frame one by
construction (the beat sheet made frame one a poster; that was the point):

```bash
# Extract the designed frame (here: frame 0)
ffmpeg -i master.mp4 -vf "select=eq(n\,0)" -frames:v 1 -q:v 2 poster.jpg
# WebP variant for pages that prefer it
ffmpeg -i poster.jpg -quality 85 poster.webp
```

The poster serves three duties with one file: the `<video poster>` attribute,
the social share card (or its basis), and the `prefers-reduced-motion`
fallback. If frame one ever changes, the poster regenerates — they are the
same design object.

## Captions

- **Sidecar always**: a `.vtt` (web) and `.srt` (platforms) with verbatim VO
  and any meaning-bearing sound cues. Even a VO-less film ships an empty-safe
  sidecar if the platform indexes captions for search.
- **Burned for feed**: feed cutdowns burn captions into pixels (platform
  caption UIs are off by default and positioned unpredictably). Style them from
  the kit (body face, fg on bg-scrim), sized per the floors in
  `kinetic-type.md`, placed inside the vertical-safe area:

```bash
ffmpeg -i feed-master.mp4 -vf "subtitles=captions.srt:force_style=\
'FontName=<kit body face>,FontSize=18,PrimaryColour=&HFFFFFF&,\
BorderStyle=4,BackColour=&H80000000&,MarginV=60'" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart feed-captioned.mp4
```

- Kinetic type cards are NOT captions — don't duplicate a card's words into the
  caption track at the same timestamp (double text reads as an error); caption
  only the audio.

## Cutdown crops

If the master was composed center-safe (`beat-sheets.md`), crops are mechanical:

```bash
# 16:9 1920x1080 master → 1:1 1080x1080 (center crop)
ffmpeg -i master.mp4 -vf "crop=1080:1080:420:0" -c:v libx264 -crf 20 \
  -pix_fmt yuv420p -movflags +faststart cut-1x1.mp4

# → 4:5 864x1080
ffmpeg -i master.mp4 -vf "crop=864:1080:528:0" ... cut-4x5.mp4

# → 9:16: prefer a re-render at 1080x1920 over a brutal crop;
# fallback: crop=607:1080 then scale, accepting the loss —
# only acceptable if the beat sheet planned the vertical-safe zone.
```

Offsets (`x:y`) are parameters, not constants — when a scene's action sits off-
center, per-scene offsets beat one global crop; `cutdowns.sh` accepts them.
Re-timing (the 1.5s feed hook) is an *edit* decision from the beat sheet's
cutdown tags, not an ffmpeg trim of the master's opening.

## Hero loop

The strictest budget in the bundle, because it loads with the page:

- **Duration** ≤10–15s; **silent** — strip audio entirely (`-an`): an audio
  track, even silent, blocks autoplay policies and wastes bytes.
- **File budget: low single-digit MB** (aim ≤2–4MB at 1080p; use 720p/CRF 23–26
  if the slot is small). The loop competes with the page's LCP — a heavy loop
  is a self-inflicted performance regression on the page it's meant to sell.

```bash
ffmpeg -i loop-master.mp4 -an -c:v libx264 -crf 24 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -vf "scale=1280:-2" hero-loop.mp4
ffmpeg -i loop-master.mp4 -an -c:v libvpx-vp9 -crf 36 -b:v 0 hero-loop.webm
```

**The embed pattern** (any stack — plain HTML):

```html
<video autoplay muted playsinline loop
       poster="poster.webp" preload="metadata"
       width="1280" height="720">
  <source src="hero-loop.webm" type="video/webm">
  <source src="hero-loop.mp4"  type="video/mp4">
</video>
```

- `muted` + `playsinline` are what make `autoplay` actually fire on mobile;
  omit either and iOS shows a dead poster with a play button.
- Explicit `width/height` (or CSS `aspect-ratio`) prevents layout shift.
- **Reduced motion**: honor it — swap to the poster.

```css
@media (prefers-reduced-motion: reduce) {
  .hero video { display: none; }
  .hero .poster-fallback { display: block; } /* the same designed poster */
}
```

(Or in JS: check `matchMedia('(prefers-reduced-motion: reduce)')` before
attaching the video source at all — bytes saved, promise kept.)

Loop seam: the encode must not flash at the wrap — verify the last frame →
first frame transition in an actual looping player, not just the timeline
(`attention.md`, loop re-hook).

## The no-GIF rule

Never ship motion as GIF: 256 colors (murders the brand kit's palette),
no audio, and **10–40× the bytes** of an equivalent MP4. Anywhere a GIF is
requested (docs, READMEs, chat embeds), the muted looping MP4/WebM above is
smaller and better; if a platform truly only accepts GIF, generate it as a
last-resort transcode with an honest palette:

```bash
ffmpeg -i loop.mp4 -vf "fps=12,scale=640:-1:flags=lanczos,split[a][b];\
[a]palettegen[p];[b][p]paletteuse" -loop 0 fallback.gif
```

…and say why it will look worse.

## Per-placement export checklists

**Launch film (site/YouTube)**
- [ ] 16:9 master H.264 CRF 18 + WebM alternate
- [ ] Audio mixed to −14 LUFS, TP ≤ −1 dBTP (`sound.md`)
- [ ] `.vtt` + `.srt` sidecars
- [ ] Designed poster (jpg + webp)
- [ ] End card holds ≥2.5s after any platform end-screen overlays are on

**Feed cutdowns (per aspect)**
- [ ] Hook re-cut to ~1.5s per the beat sheet's cutdown tags
- [ ] Burned captions inside the vertical-safe area
- [ ] Legibility pass at phone size (`qa.md`)
- [ ] CTA restated in post copy (`cta.md`)
- [ ] Uploaded at max quality within platform size limits

**Hero loop**
- [ ] ≤15s, `-an`, within the MB budget
- [ ] Seam checked in a looping player
- [ ] Poster + reduced-motion fallback wired
- [ ] Embed uses `autoplay muted playsinline loop preload="metadata"`
- [ ] Page CTA adjacent and unobstructed (`cta.md`)

**Bumper / keynote**
- [ ] Bumper: 6s exact, end frame = complete ask
- [ ] Keynote: no burned captions, venue loudness spec, 16:9 clean frame,
      destination card held long enough to photograph
