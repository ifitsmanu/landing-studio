# Color & Contrast — roles, ramps, and the AA gate

Color is where brand kits are richest and systems go wrong fastest. The
method: map whatever the kit supplies onto a **fixed role set**, derive the
few values the kit doesn't supply, then pass every role pairing through a
**programmatic contrast gate** before a single token is emitted. Contrast is
verified with numbers, never by squinting — the classic failures (muted text
at 4.3:1, an accent that can't be link text in dark mode) are invisible to a
designer's eye on a good monitor and obvious to half the audience.

## Contents

1. [The role set](#the-role-set)
2. [Deriving neutrals from the kit](#deriving-neutrals)
3. [Accent discipline](#accent-discipline)
4. [The AA matrix](#the-aa-matrix)
5. [The validator](#the-validator)
6. [Dark-mode derivation](#dark-mode-derivation)
7. [Semantic colors](#semantic-colors)
8. [Gradients and washes](#gradients-and-washes)
9. [Beyond AA](#beyond-aa)

## The role set

Roles, not colors, are the API. Components bind to these names and nothing else:

| Role | Definition | Notes |
|---|---|---|
| `canvas` | The page | White/barely-warm (light) · brand-tinted near-black (dark) |
| `surface` | First elevation step | Cards, code blocks, alternate sections |
| `surface-raised` | Second step | Dropdowns, popovers; = canvas in light themes that elevate by shadow |
| `ink` | Primary text | Near-black / 92–95%-strength near-white |
| `ink-2` | Secondary text | Leads, descriptions — hierarchy by strength, one hue |
| `ink-3` | Muted text | Captions, labels — still ≥ 4.5:1; "muted" ≠ "optional to read" |
| `line` / `line-strong` | Hairlines | Ink at 8–14% / ~20% alpha — never a solid mid-gray, so they hold on any surface |
| `accent` | The E2 fill | Exactly one; the primary CTA's color |
| `accent-hover` | Its hover | One step darker (light) / lighter (dark) |
| `accent-ink` | Text ON accent | Usually white or near-black — measured, not assumed |
| `accent-text` | Accent AS text | A per-theme variant; the raw accent frequently fails this job |
| `accent-soft` | 8–12% wash | Badges, eyebrow chips, subtle section tints |
| `focus` | Focus ring | Usually = accent; must clear 3:1 against what it sits on |
| `positive/warning/danger` | Feedback | Forms only on a landing page |

## Deriving neutrals

Kits often supply one or two neutrals and no ramp. Build the rest:

- **Tint the neutrals with the accent's hue** at very low chroma (~0.005–0.02
  in oklch). Pure gray next to a saturated accent looks dead; hue-tinted
  neutrals are why Stripe's grays feel warm and Linear's feel cool. In oklch:
  hold the accent's hue, drop chroma to near-zero, walk lightness.
- **Ink steps by strength, not by picking grays:** derive `ink-2`/`ink-3` as
  mixes of `ink` toward `canvas` (`color-mix(in oklab, var(--ink) N%,
  var(--canvas))`), then *resolve and verify* — mixes are a derivation
  method, not a guarantee. Typical passing zones: `ink-2` ≈ 70–75% mix,
  `ink-3` ≈ 60–65% (55% classically fails at 4.3:1 on white — the exact bug
  the validator exists to catch).
- **Surface steps are small.** Light: canvas → surface is a 2–4% lightness
  move. Dark: each step up is +3–5% lightness. Big jumps read as zebra
  striping, not elevation.
- **Hairlines are alpha, not hex:** `rgb(<ink> / 0.12)` sits correctly on
  every surface without per-surface border colors.

## Accent discipline

- **One accent.** A second brand color, if the kit has one, becomes
  `accent-soft`-style washes or illustration-only — it never gets a solid
  fill role. Two competing solids and the CTA loses the squint test.
- **Four derived jobs, measured separately:** fill (vs `accent-ink`), text
  (vs each canvas — per theme), wash (`accent-soft`), and focus. A
  mid-saturation accent typically passes as a fill and fails as dark-theme
  text; that is why `accent-text` is a distinct role, not an alias.
- **Hover moves lightness one step** toward the theme's canvas-opposite —
  darker in light, lighter in dark. Never rotate hue on hover.
- **Competitor collision check:** compare the accent (and the overall
  canvas-plus-accent impression) against the kit's named competitors. Close
  enough to confuse at a glance → flag it with a side-by-side and let the
  user decide. Never silently restyle a brand.

## The AA matrix

The pairs to verify, per theme. WCAG 2.x thresholds: **4.5:1** for normal
text, **3:1** for large text (≥ 24px, or ≥ ~18.7px bold — steps 3–5 qualify)
and for non-text UI (boundaries, icons, focus indicators).

| # | Foreground | Background | Min | Why |
|---|---|---|---|---|
| 1 | `ink` | `canvas`, `surface`, `surface-raised` | 4.5 | Body text on every surface it touches |
| 2 | `ink-2` | same three | 4.5 | Secondary text is still text |
| 3 | `ink-3` | same three | 4.5 | Muted text carries information (captions, labels) |
| 4 | `accent-ink` | `accent` and `accent-hover` | 4.5 | The CTA label — the most-read text on the page |
| 5 | `accent-text` | `canvas`, `surface` | 4.5 | Links and accent-colored words |
| 6 | `accent` (as boundary) | `canvas` | 3 | The CTA must separate from the page |
| 7 | `focus` | `canvas`, `surface`, `accent` | 3 | Ring must be visible wherever focus lands |
| 8 | `line-strong` | `canvas` | 3 | Input borders are functional UI |
| 9 | `danger`/`positive`/`warning` (as text) | `canvas`, `surface` | 4.5 | Validation messages |
| 10 | display text at `ink` | any decorative wash/gradient it sits on | 3 | Heroes love washes; check the worst pixel |

Alpha colors composite over their actual background before checking (the
validator below includes the helper). For row 10, check against the wash's
*least* contrasting stop.

## The validator

Small, dependency-free, runnable anywhere Node exists. Generate `checks` from
the resolved theme, run per theme, wire into the QA gate — exit code 1 blocks
EMIT.

```js
// contrast.mjs — node contrast.mjs
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// composite "#RRGGBB" at alpha over bg — for line/ink-alpha tokens
const over = (fg, alpha, bg) => "#" + [1, 3, 5].map(i => Math.round(
  parseInt(fg.slice(i, i + 2), 16) * alpha +
  parseInt(bg.slice(i, i + 2), 16) * (1 - alpha)
).toString(16).padStart(2, "0")).join("");

const checks = [
  // [name, fg, bg, min] — generate from the resolved theme(s)
  ["dark ink/canvas",        over("#F4F4F6", 0.95, "#0B0B0F"), "#0B0B0F", 4.5],
  ["dark ink-3/canvas",      "#8A8A93", "#0B0B0F", 4.5],
  ["dark accent-ink/accent", "#FFFFFF", "#5B5BD6", 4.5],
  ["dark accent-text/canvas","#8F8FEA", "#0B0B0F", 4.5],
  ["dark accent-boundary",   "#5B5BD6", "#0B0B0F", 3],
  ["light ink-3/canvas",     "#6C6C74", "#FFFFFF", 4.5],
  // …complete from the AA matrix, both themes
];

let failed = 0;
for (const [name, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(28)} ${r.toFixed(2)} (min ${min})`);
}
process.exit(failed ? 1 : 0);
```

When a pair fails, fix the *token* (walk lightness until it passes, or split
the role as with `accent-text`) — never fix the check, and never downgrade a
text role to "decorative" to dodge the threshold.

## Dark-mode derivation

Author it; never invert. The sequence:

1. **Canvas:** near-black carrying the brand hue (`#0B0B0F`-class, chroma
   barely nonzero). Pure `#000` makes every surface step feel like floating
   gray cards in a void.
2. **Surfaces lighten as they rise** (+3–5% lightness per step) — this *is*
   the dark elevation system, since shadows can't do the job on dark.
3. **Ink at 92–95% strength**, steps derived and re-verified — dark-theme
   contrast is usually easier to pass but easier to *overshoot* into harsh
   pure-white-on-black.
4. **Accent:** keep the fill (brand recognition), lighten the hover, and
   derive a lighter `accent-text` — assume the raw accent fails as dark text
   until proven otherwise.
5. **Shadows → borders:** `elev-1/2` become `none`; `line` brightens
   slightly; only `elev-3` keeps a deep soft shadow.
6. **Re-run the whole matrix.** Dark is a full theme, not a discount.

Product screenshots from the kit: frame light-UI shots on `surface` with a
hairline (a white rectangle glowing on a dark page reads as a hole), and
prefer theme-matched captures when the kit has them.

## Semantic colors

Landing pages need them almost nowhere — form validation and the odd status
badge. Derive one set per theme (text-grade, 4.5:1), and never let semantic
green/red leak into marketing decoration; "green because growth" is how
palettes turn into fruit salad. If the accent is itself red/green-adjacent,
shift the semantic hues far enough to stay distinguishable.

## Gradients and washes

The premium idiom uses color fields *quietly*:

- **Two stops, neighbors in hue** (accent → accent shifted ≤ 30° or →
  transparent). Rainbow multi-stop heroes date instantly and fight the CTA.
- Interpolate in `oklch`/`oklab` (`linear-gradient(in oklch, …)`) — sRGB
  interpolation muddies the middle.
- **Banding:** large soft gradients on dark canvases band visibly; overlay
  1–2% noise (tiny tiled PNG or SVG turbulence) or keep the lightness travel
  small.
- Text over a wash obeys matrix row 10 at the worst stop.
- The wash never sits behind the primary CTA — the button's contrast with
  its *immediate* surroundings is part of its salience budget.

## Beyond AA

AA is the floor, not the target — body text on these reference-grade pages
usually measures 7:1+ (AAA) simply because near-black-on-white is the idiom.
If the team wants a stricter gate, APCA (the WCAG 3 draft model) models
polarity and size better, and matters most exactly where landing pages live:
thin display weights and dark themes. Run it as an additional advisory check,
not a replacement — AA remains the compliance line and the one this skill
enforces mechanically.
