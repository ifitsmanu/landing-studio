# UI Cinematography — the product as protagonist

In this genre the interface is the lead actor, and it is *directed*: staged,
lit, framed, and choreographed. Raw screen recordings pasted full-bleed are the
genre's equivalent of pointing a phone at a stage play. Every technique here
serves one of the spine's needs: proof density (attention) and credibility
(which is what converts).

## Contents

1. [Rebuild vs record](#rebuild-vs-record)
2. [Staging the UI](#staging-the-ui)
3. [Camera grammar](#camera-grammar)
4. [The cursor as actor](#the-cursor-as-actor)
5. [Deterministic capture — the Playwright recipe](#deterministic-capture)
6. [Recorder-based capture](#recorder-based-capture)
7. [Honesty labels](#honesty-labels)

## Rebuild vs record

The first decision for every UI scene. Both are honest when the demonstrated
capability is real; they trade different things.

| | **Rebuild (staged replica)** | **Record (authentic capture)** |
|---|---|---|
| What it is | Re-create the UI moment as a controlled scene (HTML/Remotion/AE) | Capture the real product running |
| Crispness | Perfect — vector-sharp at any zoom, ideal data, ideal timing | Limited by source resolution and app rendering |
| Control | Total: every ms, every pixel, re-renderable forever | Take-based; re-shoots for every change |
| Credibility | High *if* faithful; risks uncanny perfection | Maximal — realness is visible |
| Cost | Higher upfront, cheap to iterate | Cheap upfront, expensive to iterate |
| Canon | Linear (hero moments) | Anthropic (engineer demos), Framer |

Decision rule:

- **Hero moments** (the apex, close-up capability beats): **rebuild.** These
  frames are the film's posters; they need perfect data, type, and timing.
- **Authenticity beats** (long takes, "it really works" moments, anything the
  audience might doubt): **record** — and keep the imperfections; they're the
  proof (see Anthropic's register in `teardowns.md`).
- Mixing is normal: recorded takes for trust, rebuilt inserts for hero shots.
  Keep the visual grade consistent so the seam doesn't read.
- Rebuilt or recorded, the capability shown must be real and current — the
  honesty contract doesn't distinguish between the two lanes.

Data in staged scenes: plausible, internally consistent, and *synthetic-reading*
(example names like "Q3 pipeline review", not real-customer-shaped names).
Perfect-but-fake-looking beats real-but-NDA'd every time.

## Staging the UI

- **Never full-bleed by default.** Set the app window on a generous canvas
  (the kit's bg), scaled to ~70–85% of frame width, with a soft, large-radius
  shadow for depth. The margin is where type cards and breathing room live.
- **Window chrome**: a minimal browser/app frame signals "real software";
  strip it only for abstract capability close-ups.
- **Zoom to the story.** Show the whole window only to establish; then frame the
  region where the action is. UI text the viewer must read obeys the legibility
  floors in `kinetic-type.md` — if it doesn't, zoom until it does.
- **Light with hierarchy, not effects**: dim or desaturate the UI regions that
  don't matter this instant (a 10–20% dim scrim with a soft-edged cutout around
  the active region), rather than adding spotlights or vignettes.
- **2× assets always**: capture/render UI at 2× target resolution so push-ins
  never soften.

## Camera grammar

The camera is the film clock of the two-tempo grammar (`motion-language.md`) —
slow, semantic, and small:

- **Push-in (3–8% over the scene)** — the default move; adds intention to any
  held shot and directs attention inward to the action.
- **Dolly/pan between regions** — travel from one UI area to the next *in
  reading order or workflow order*; the pan IS the narration ("and then this
  happens here").
- **Match cut on shared geometry** — cut between scenes on an element both
  share (a card, a chart, the claim's baseline becoming a panel edge). This is
  the Apple inevitability move, and it's what makes a film feel like one
  continuous object instead of a slideshow.
- **Origin-aware transitions** — new surfaces grow from the element that caused
  them: the detail panel expands *from* the clicked row. The film obeys the same
  spatial logic good product UI does.
- **Never**: whip pans, zoom blurs, 3D card flips, "camera shake for energy".
  The camera in this genre has a tripod and an opinion, not a Steadicam and a
  Red Bull.

## The cursor as actor

The cursor is the viewer's body in the frame. Choreograph it like an actor:

- **Smooth the path**: real mouse jitter reads as anxiety. Ease cursor travel
  along a gentle curve (spline through waypoints, in-out easing, 600–900ms per
  travel), slightly overshooting-then-settling only if the kit's signature
  wants it.
- **The hesitation beat**: pause 150–250ms *before* the click. Instant clicks
  read as scripted (they are — the beat hides it); the pause reads as a human
  deciding, and gives the viewer time to see the target.
- **Click ripple / keycap overlays**: mark input events visibly — a subtle
  150ms ripple at the click point; keycap chips (from the kit's mono/body face)
  for shortcuts, timed exactly to the event (Raycast's whole rhythm is built on
  this).
- **Scale it up**: cursors at native size vanish at feed size; render at
  1.5–2× and it reads as intentional, not wrong.
- **Cursorless = automation.** When demonstrating something the product does
  *by itself*, remove the cursor entirely — UI acting with no cursor present is
  the visual definition of "automatic". Never fake automation by hiding a
  scripted cursor while implying no human was needed *if a human was needed* —
  that's a Gemini-2023-class edit (`teardowns.md`).

## Deterministic capture

The recipe for filming any live URL frame-perfectly, with no dropped frames, on
any machine — the capture lane of the vendored floor. The full parameterized
script ships in `assets/scene-templates/capture.mjs`; the shape:

1. **Launch headless Chromium via Playwright** at exactly the target resolution
   ×2 (`deviceScaleFactor: 2`), with animations *gated* (the scene templates
   pause everything until told to play).
2. **Take control of the clock.** Two mechanisms, by motion source:
   - **CSS/WAAPI animations** (the scene-template lane): pause every animation
     via `document.getAnimations({subtree: true})`, then for each output frame
     set every animation's `currentTime = frameIndex × (1000/fps)` and
     screenshot. Time becomes an axis you index, not a stream you race.
   - **rAF/JS-driven motion** (arbitrary live apps): use CDP
     `Emulation.setVirtualTimePolicy` — pause virtual time, advance it by one
     frame's budget, screenshot, repeat. The page believes time passed; you
     decide how much.
3. **Wait for readiness before frame 0**: `document.fonts.ready`, network idle,
   and any app-specific "data loaded" signal — the poster frame must never
   catch a skeleton loader.
4. **Screenshot each frame to numbered PNGs**, then assemble with ffmpeg
   (`assets/scene-templates/encode.sh`). PNG frames → encode gives you lossless
   headroom for the grade and re-encodes.

Why frames, not screen recording: recording headless output is subject to frame
drops, vsync jitter, and encoder settings you don't control; frame-by-frame
capture is *deterministic* — same input, identical file, every run, in CI.
The URL is a parameter. Never bake an address, port, or path into the capture
script — the live URL arrives via the brand kit's `product.ui_material.live_url`.

## Recorder-based capture

When the material is a human actually using the product (authenticity beats), a
Screen Studio-class recorder (auto-zoom, cursor smoothing, click effects baked
in) is the pragmatic lane:

- Record at the highest source resolution available; 2× displays preferred.
- Turn OFF the recorder's own cursor effects if you're adding your own — two
  smoothing systems fight.
- Record long, cut short: capture the whole task loosely, choose the 6 honest
  seconds in the edit.
- OS-level raw capture is the fallback; expect to add zoom/cursor treatment in
  the compose stage.

## Honesty labels

Label *in the frame*, at the moment it applies — not in the description, not in
fine print at the end (a disclosure the viewer must find is not a disclosure —
the Gemini lesson):

- **"Sped up"** (with the factor if large: "4×") — any time compression beyond
  trivial trimming of dead time.
- **"Simulated data"** — staged scenes whose data could be mistaken for real
  customer data.
- **"Concept"** — anything not yet shipped. A concept film is legitimate; an
  unlabeled one is a lie with production values.
- Real speed is the default; label the exception. A film that never needs a
  label is the strongest position — the canon's most persuasive demos are the
  ones that visibly didn't cheat (`teardowns.md`, Anthropic entry).
