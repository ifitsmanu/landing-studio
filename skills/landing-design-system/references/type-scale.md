# Type Scale — ratios, fluidity, and display craft

Type is most of a landing page's pixels, so it is most of the design. The
premium pages this skill aims at (Stripe, Linear, Vercel, Apple) share one
typographic property: **few decisions, total consistency** — one body size,
one ratio, one display slope, and nothing set outside the scale. This file is
the machinery for getting there from any kit.

## Contents

1. [Why a modular scale](#why-a-modular-scale)
2. [Choosing the ratio](#choosing-the-ratio)
3. [The fluid recipe](#the-fluid-recipe)
4. [The step table](#the-step-table)
5. [Role assignments](#role-assignments)
6. [Display craft](#display-craft)
7. [Body craft](#body-craft)
8. [Mono](#mono)
9. [Weights](#weights)
10. [Loading discipline](#loading-discipline)

## Why a modular scale

A scale replaces N font-size decisions with two: a base and a ratio. Every
size then *belongs* to every other size, which is what viewers read as
"designed" without being able to say why. The failure mode it prevents is
drift — 15px here, 17px there, a 34px heading next to a 36px one — which
reads as cheap even when each choice was individually fine. The scale is the
law: if a design "needs" a size between steps, it needs the step below with
more weight, or the step above with less.

## Choosing the ratio

| Ratio | Name | Character | Choose when |
|---|---|---|---|
| 1.125 | major second | Dense, quiet | Product-UI-heavy pages, dashboards-as-hero |
| **1.2** | **minor third** | **Calm, editorial — the workhorse** | **Default for landing pages** |
| 1.25 | major third | Confident, spacious | Type-led pages with little UI chrome |
| 1.333 | perfect fourth | Loud, poster-like | Single-message pages; risky beyond 5 steps |

Landing pages need a **two-slope system**: a modest ratio for text sizes
(captions through h3) and a steeper reach for display, because no single
ratio walks politely from 16px body to the 44–76px hero a marketing page
wants. Implement the second slope with fluid `clamp()` on the top steps
rather than a second ratio — the viewport does the stretching, and the scale
stays one family.

If the kit's display face is inherently wide or loud (heavy grotesks,
slab-ish faces), step the ratio *down*, not the weight — a loud face on a
loud scale shouts twice.

## The fluid recipe

A fluid step is a line through two anchor points: (viewport `v1`, size `s1`)
and (viewport `v2`, size `s2`), clamped at both ends:

```
slope      = (s2 − s1) / (v2 − v1)          — in px per px of viewport
vw-term    = slope × 100                     — as a vw coefficient
intercept  = s1 − slope × v1                 — in px, convert to rem
→ clamp(s1rem, {intercept}rem + {vw-term}vw, s2rem)
```

Worked (the Acme display step): 44px at a 360px viewport → 76px at 1280px.
slope = 32/920 = 0.0348 → `3.48vw`; intercept = 44 − 0.0348×360 = 31.5px =
1.97rem. Result: `clamp(2.75rem, 1.97rem + 3.48vw, 4.75rem)`.

Rules: anchor to your real design viewports (mobile ≈ 360–390, desktop ≈
1200–1440); **clamp both ends** (unbounded vw text breaks on ultrawide and on
zoom); keep steps −1 and 0 static or barely fluid — body text that visibly
changes size while resizing reads as instability; verify the min end still
holds hierarchy (a display that clamps down to h2's size flattens the ladder
exactly on the devices where attention is scarcest).

## The step table

The default seven-step system (rename nothing — downstream skills bind to
step indices). Size, line-height, and tracking travel together: a size is
never used with a foreign leading.

| Token | Size | Line-height | Tracking | Default role |
|---|---|---|---|---|
| `--step--1` | 0.875rem | 1.45 | 0 (+0.08em when set as caps eyebrow) | Captions, labels, footer, eyebrow |
| `--step-0` | clamp(1rem → 1.125rem) | 1.6 | 0 | Body |
| `--step-1` | clamp(1.125 → 1.25rem) | 1.55 | 0 | Lead paragraph, hero subhead |
| `--step-2` | clamp(1.375 → 1.5rem) | 1.3 | −0.01em | h3, card titles |
| `--step-3` | clamp(1.75 → 2.25rem) | 1.2 | −0.015em | h2, section heads |
| `--step-4` | clamp(2.25 → 3rem) | 1.12 | −0.02em | h1 on interior pages, big stats |
| `--step-5` | clamp(2.75 → 4.75rem) | 1.05 | −0.025em | The display headline — one per page |

Two structural patterns worth internalizing: **line-height is inverse to
size** (1.6 at body, 1.05 at display — big type with body leading is the
single most common amateur tell), and **negative tracking grows with size**
(display faces are drawn for large sizes but still benefit from −0.02em-ish
tightening; body gets none). Seven steps is the budget; an eighth requires
deleting one.

## Role assignments

- **Display (`--step-5`)** — exactly one per page (emphasis level E1). Set in
  the display face, weight 600–700, `text-wrap: balance`, max ~12 words.
- **Section heads (`--step-3`)** — the page's repeating rhythm; display face;
  `text-wrap: balance`.
- **Lead (`--step-1`)** — the hero subhead and section intros; body face,
  often `ink-2`; this is hierarchy through *strength*, not another size.
- **Body (`--step-0`)** — body face, `ink` or `ink-2`, measure ≤ `--measure`,
  `text-wrap: pretty` where supported (kills widows cheaply).
- **Caption (`--step--1`)** — labels, legal, logo-row headers; `ink-3` (which
  the color system keeps ≥ 4.5:1 — muted, not illegible).
- **Eyebrow** — `--step--1`, uppercase, +0.08em tracking, weight 500–600,
  `ink-3` or `accent-text`. The classic Stripe/Linear section opener.

## Display craft

Where the "inevitable" feel is won:

- **Leading first.** Before any other polish, set display leading 1.02–1.12.
  This one change does more than any font purchase.
- **Tracking −0.01 to −0.03em**, tuned per face: geometric and grotesk faces
  take more negative tracking; humanist faces take less. Trust your eye at
  the real rendered size, then freeze the value into the token.
- **Optical sizing:** if the face is variable with an `opsz` axis, let it run
  (`font-optical-sizing: auto`). If the kit ships separate Display/Text cuts,
  use the Display cut at steps 4–5 only.
- **Real weights only.** Faux bold (a weight the file doesn't contain)
  smears; it is instantly visible at display sizes. If the kit lacks a 600+,
  say so and use the heaviest real weight — don't synthesize.
- **`text-wrap: balance`** on all headings — ragged two-line headlines with a
  one-word second line are a solved problem.
- **Contrast pairing:** if display and body are the same family, separate
  them by weight and tracking, not just size, or the page reads monotone.

## Body craft

- 16–18px. Under 16 is a legibility and (on iOS, zoom-on-focus) usability
  bug; over 18 for body starts reading as a children's book unless the
  measure grows with it.
- Line-height 1.5–1.65; measure 60–75ch via the `--measure` token. Reading
  comfort is a conversion feature — the proof section only works if people
  actually read it.
- Paragraph spacing over indentation; one `--space` step between paragraphs.
- Links inside body text: `accent-text` + underline (see components.md) —
  color alone fails colorblind users and low-quality displays alike.

## Mono

Include only when the product is technical (code, CLI, data, API): mono set
as decoration on a non-technical product is costume jewelry. Rules when it
earns its place:

- Set at **0.9em relative** to the surrounding text — mono faces run visually
  larger at equal nominal size.
- `tabular-nums` (`font-variant-numeric: tabular-nums`) on every stat,
  metric, table, and countdown — proportional figures wobble as they change
  and misalign in columns.
- Inline code spans: `--step--1`-ish size, `surface` background, `--r-field`
  radius, 0.15em horizontal padding.

## Weights

Budget: **2–3 total** across the whole page. Typical premium split: 400
(body), 500 or 600 (UI labels, buttons, h3), 600–700 (display and section
heads). Hierarchy comes from the *pair* of size and weight moving together —
never express emphasis by weight alone at body size when a step exists, and
never load a weight for a single element.

## Loading discipline

A hero that reflows on font load spends the first impression on a layout
jump — attention is the budget, and CLS spends it before a word is read.

- **Subset woff2** of the kit's real files, self-hosted (no third-party font
  CDN dependency for a landing page), preloaded:
  `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the
  display face's hero weight only.
- `font-display: swap` **plus metric-matched fallbacks**: declare a fallback
  `@font-face` pointing at a local stack with `size-adjust`,
  `ascent-override`, and `descent-override` tuned so the swap doesn't move
  the layout. Tune once per face, keep in tokens.css beside the real
  `@font-face`.
- Variable font if the kit provides one (one file, all weights); otherwise
  load only the 2–3 weights in the budget.
- The mono face loads lazily — it is never in the hero's critical path.
