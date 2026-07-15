# QA Gate — quality, CTA, and attention verified, not asserted

This gate is built-in and self-contained: it runs on every film, on any project,
with no external skill required. If the project ships its own brand/design
review skill, run that **in addition** and let it outrank this gate on brand
matters — but never treat its absence as a blocker.

The gate exists because the three things that matter — quality, attention, CTA
— are all *empirically checkable*. Opinions about whether the film "feels
great" are replaced by tests a second person could reproduce.

## Contents

1. [The three-watch protocol](#the-three-watch-protocol)
2. [The frame-step scrub](#the-frame-step-scrub)
3. [The attention tests](#the-attention-tests)
4. [The CTA test](#the-cta-test)
5. [Legibility and conformance](#legibility-and-conformance)
6. [Honesty audit](#honesty-audit)
7. [Definition of done](#definition-of-done)

## The three-watch protocol

Watch the film three times, in this order, before any other check:

1. **Muted, at feed size** (a phone, or a window scaled to phone width).
   This is the majority product (`attention.md`). Ask: does the full argument
   land with zero audio? Is every card readable? Would *you* stop scrolling?
2. **Sound-on, at full size.** The reward layer: do cuts land on the grid, does
   the apex drop hit, is the CTA's quiet actually quiet, does any foley land
   off-frame?
3. **At 2× speed.** Pacing X-ray: at 2× the eye catches repeated ideas, dead
   stretches, and scenes that overstay — anything that feels slow at 2× feels
   slow to a second-time viewer at 1×. Also the fastest way to spot easing
   inconsistencies (mismatched curves "wobble" at speed).

Any failure returns to the relevant stage — usually the beat sheet, not the
compositor. Fixing pacing in the edit that's broken in the sheet just hides
the bug.

## The frame-step scrub

Step through frame-by-frame (or at 0.25×) across every transition and stagger:

- [ ] Entrances use the film's declared curves — no stray defaults
      (`motion-language.md` vocabulary check)
- [ ] Staggers run in reading order with consistent offsets; one focal element
      per instant — no accidental simulcasts
- [ ] No half-rendered frames, font-swap flashes, skeleton loaders, or cursor
      teleports at scene boundaries
- [ ] Match cuts actually share geometry (element within a few px across
      the cut)
- [ ] Every *held* frame passes the poster test — pause anywhere motion rests:
      could this frame ship as a still?
- [ ] Loop deliverables: wrap the loop in a player and watch the seam three
      times

## The attention tests

- **3-second hook test.** Show second 0–3 (only) at feed size, muted, to
  someone (or honestly to yourself, fresh eyes): would you stop scrolling?
  A hedged "maybe" is a no — re-cut the hook (`attention.md`, hook
  architectures).
- **Bail-at-any-second test.** Pick three random timestamps. A viewer who
  leaves at each must still know (a) the product's name or category and (b) at
  least one capability. If any bail point fails, information is back-loaded —
  redistribute per the beat sheet.
- **Poster test on frame one.** Export frame one as an image. Poster-grade
  still? It is the thumbnail, the share card, and the reduced-motion
  experience — the largest audience the film has.
- **Change-cadence check.** Scrub with a timer: any stretch >3s with no
  perceptible change (that isn't a designed hold on the apex or CTA)? Any
  metronomic stretch of identical shot lengths?

## The CTA test

- **CTA-within-1s test.** Show a fresh viewer the end card for one second.
  Can they repeat the verb and the destination? If not: contrast, size, or
  word count (`cta.md`, end-card spec).
- [ ] Exactly one verb + one destination in the entire film (mid-roll echo uses
      identical wording)
- [ ] End card held ≥2.5s of genuine stillness
- [ ] Destination is live, correct, and its landing page matches the verb
      (scent trail — `cta.md`)
- [ ] Loop placements: the ask lives in the rest state
- [ ] Post copy / page button carries the same ask where the placement
      requires it

## Legibility and conformance

- **Smallest-screen pass**: every cutdown watched on a real phone at arm's
  length; every card, caption, and the destination readable
  (`kinetic-type.md` floors).
- **Brand-kit conformance**: colors, typefaces, and logo *exactly* as supplied
  — no near-miss hexes from compression previews, no substituted weights, no
  retyped wordmark; accent used as punctuation, not wash. Diff the end card
  against the kit's values programmatically if in doubt (eyedropper on the
  rendered frame).
- **Word-count audit**: no card exceeds 7 words; each card meets its
  reading-time budget (words ÷ 3/sec, readable in two-thirds of display).
- **Safe areas**: feed cuts keep type clear of platform chrome zones.

## Honesty audit

- [ ] Every on-screen number/quote/name maps to a claims-ledger row
      (`brand-kit.md`) — walk the film card by card against the ledger
- [ ] Nothing in `constraints.forbidden_claims` appears or is implied
- [ ] All speed-ups, simulations, and concepts labeled **in-frame** at the
      moment they apply (`ui-cinematography.md`)
- [ ] Synthetic data reads as synthetic; no real-customer-shaped fabrications
- [ ] Music license documented

## Definition of done

Done means ALL of:

1. **Beat sheet approved** by the user before render (and re-approved after
   any structural change).
2. **Every gate section above passes** — three-watch, frame scrub, attention
   tests, CTA test, legibility/conformance, honesty audit.
3. **Delivery bundle handed off** per `delivery.md`: masters (MP4 + WebM),
   per-placement cutdowns, designed poster, caption sidecars (+ burned feed
   variants), and the embed snippet where a web placement exists.
4. **Project review honored**: if a project-local brand/design review skill
   exists, it has run and its findings are resolved.

Quality, CTA, and attention span **verified, not asserted** — the film ships
with evidence, or it doesn't ship.
