# Kinetic Typography — type that carries the film sound-off

Because the muted majority is real (`attention.md`), type is not decoration on
this genre — it is the narration track. Every recipe here exists to prevent one
of two failures: **a card the viewer couldn't finish reading** (attention failure)
or **a reveal that draws attention to itself instead of the words** (quality
failure).

## Contents

1. [Word limits and timing](#word-limits-and-timing)
2. [Reveal recipes](#reveal-recipes)
3. [Type as an object in the scene](#type-as-an-object-in-the-scene)
4. [Legibility floors](#legibility-floors)
5. [Anti-template rules](#anti-template-rules)

## Word limits and timing

- **≤7 words per card.** One idea per card, same law as one idea per shot. If a
  sentence needs 12 words, it's two cards — or, more often, five words after an
  honest edit.
- **Display-time math:** budget ~3 words/second, then require the card readable
  in **two-thirds** of its display time (the final third is comprehension margin,
  and covers slow readers and non-native speakers).
  - 3 words → ≥1.5s on screen
  - 5 words → ≥2.5s
  - 7 words → ≥3.5s
  - The reveal animation counts *against* reading time only for the portion where
    the text isn't yet fully legible — which is why reveals stay short (≤500ms).
- **Numbers read faster than words.** A single large ledger-backed figure can
  hold a 1.5s card where five words could not.
- **Sequence text against action.** Type and critical UI motion never compete in
  the same instant: reveal the card, *then* let the UI act (or vice versa).
  Simultaneity forces the viewer to choose, and whatever loses was wasted.

## Reveal recipes

Four patterns cover the entire genre. Pick ONE as the film's default; the cascade
is reserved for exactly one payoff line per film.

### 1. Mask reveal (the workhorse)
Text rises into view through a clipped line-box — the classic launch-film move.
- Per line: `translateY(110%) → 0` inside an `overflow: hidden` wrapper.
- Duration 400–600ms, expo/quart-out, 60–90ms stagger between lines.
- Reads as: precise, editorial, premium. Default for claims and section cards.

### 2. Blur-up
Whole card resolves from soft to sharp.
- `filter: blur(12px) → 0` + `opacity 0 → 1` + optional `translateY(16px) → 0`.
- Duration 400–500ms, ease-out. No stagger — the card arrives as one thought.
- Reads as: calm, confident. Best for THE claim and the synthesis restatement.
- Cost: blur is expensive at render time on large text — fine for pre-rendered
  video, budget-check it for live capture.

### 3. Translate + fade (the quiet default)
- `translateY(12–24px) → 0` + `opacity 0 → 1`, 300–400ms, ease-out.
- Reads as: neutral, invisible. Correct for lower-thirds, labels, captions —
  anything that shouldn't announce itself.

### 4. Per-word cascade (the payoff — once)
Words arrive individually, 30–60ms apart, each with a small rise or blur.
- Reserved for **exactly one line per film** — usually the claim or the synthesis
  restatement. Used twice, it's a tic; used everywhere, it's a template.
- Cascade in reading order, always. Random-order word arrival is unreadable.
- Total reveal ≤ (word count × 60ms) + 400ms; the line must still meet its
  reading-time budget after fully assembling.

**Exit rule:** exits are faster and quieter than entrances — 200–250ms fade or
small translate, no choreography. The viewer's attention is already moving to the
next thing; an elaborate exit fights the film's own momentum. Never mirror-play
the entrance backwards (reads as a rewind glitch).

**Type-on/terminal reveal:** character-by-character typing is a *diegetic* device
— reserved for text an actor is typing in the story (a prompt, a command). Never
use it for editorial cards; there it reads as a 2010 template. Type at a plausible
human/terminal cadence (30–80ms/char with jitter) and pair with a cursor.

## Type as an object in the scene

Kinetic type isn't a subtitle layer floating over the film — it's staged *in* the
scene with the same camera:

- Type inherits the scene's camera move: if the camera pushes in 4% over the
  scene, the card scales with it (slightly less — 2–3% — for gentle parallax
  that seats it in space).
- Type respects the scene's light: on a canvas with a staged UI, the card sits
  in the composition's negative space, not centered by default.
- Shared-geometry transitions apply to type: a claim's baseline can become the
  top edge of the next scene's UI panel (the Apple inevitability move).
- Never animate letter-spacing/tracking as a reveal (wobbly, dated); never arc
  text along paths; never extrude. The type is set well and *moved* well — the
  craft is in timing, not deformation.

## Legibility floors

Numbers assume a 1080×1920 (9:16) or 1920×1080 (16:9) render; scale
proportionally for other resolutions. These are floors, not targets.

| Element | Floor (16:9 @1080p) | Floor (9:16 @1080×1920) |
|---|---|---|
| Claim / display card | ≥72px | ≥96px |
| Lower-third / feature label | ≥40px | ≥56px |
| Burned captions | ≥42px | ≥64px |
| CTA destination (URL) | ≥48px | ≥72px |
| Any UI text meant to be read | ≥28px effective | zoom the UI until true |

- **Contrast:** text over the kit's bg at ≥4.5:1 (WCAG AA as a video floor —
  feed compression and ambient glare eat margins fast). Over moving footage or
  staged UI, add a scrim or place text in guaranteed negative space; never rely
  on a lucky patch of dark pixels.
- **Safe areas:** keep type inside 5% margins on all sides for 16:9, and clear of
  the top ~12% and bottom ~18% on 9:16 (platform chrome: username overlays, CTA
  bars, captions). Feed crops of a 16:9 master require type inside the 4:5 center
  zone (`delivery.md`).
- **Weight:** display cards at 600+ weight; light weights shimmer under video
  compression at small sizes.
- **The phone test:** watch every cutdown on an actual phone at arm's length —
  it is the only legibility check that never lies.

## Anti-template rules

The fastest way to make a film feel templated is typographic variety. Restraint
rules, derived from the entire canon (`teardowns.md`):

- **One typeface pair** (display + body, from the kit) for the whole film. A mono
  face may join only if the product is developer-facing and the kit supplies it.
- **One reveal family** as the default, the cascade once, done. Mixing mask +
  blur-up + spin + zoom announces "template kit" instantly.
- **One easing family** shared with the film's motion system (`motion-language.md`)
  — type is not exempt from the vocabulary.
- **No preset bounces, elastic overshoots, spins, flips, or 3D swings** on type.
  Ever. A spring belongs to the UI's one emphasis moment, not to words.
- **No gradient fills, glows, or drop shadows on type** unless the brand kit
  explicitly specifies them; type carries the brand through the *typeface*, which
  is why the kit's font files — not lookalikes — are mandatory.
