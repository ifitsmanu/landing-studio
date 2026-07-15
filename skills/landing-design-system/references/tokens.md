# Tokens — architecture, file skeletons, and the Acme example

The token files are the only place resolved design values may exist. Components,
specimen, and every page `landing-page-design` later composes consume tokens by
name; a raw hex, px, or bezier anywhere else is a portability bug. A total
rebrand must be a swap of these files and nothing else.

## Contents

1. [The three naming layers](#the-three-naming-layers)
2. [tokens.css — the skeleton](#tokenscss--the-skeleton)
3. [Dark/light wiring](#darklight-wiring)
4. [theme.tailwind.css — the Tailwind block](#themetailwindcss--the-tailwind-block)
5. [Kit → token mapping table](#kit--token-mapping)
6. [Worked example — the complete Acme token set](#worked-example--acme)

## The three naming layers

1. **Kit values** — what the brand supplied (`#5B5BD6`, "Space Grotesk").
   These appear only in comments and in the raw-token declarations.
2. **Raw semantic tokens** — plain custom properties named for their *role*,
   not their value: `--canvas`, `--ink-2`, `--accent-text`, `--elev-1`,
   `--dur-2`. Theme switching happens at this layer. Raw names deliberately
   avoid Tailwind's theme namespaces (`--color-*`, `--font-*`, `--text-*`,
   `--radius-*`, `--shadow-*`, `--ease-*`, `--leading-*`, `--spacing-*`) so
   layer 3 can reference them without collisions — hence `--face-display`
   rather than `--font-display`, `--elev-1` rather than `--shadow-1`,
   `--easing-out` rather than `--ease-out`.
3. **Tailwind theme keys** — `@theme inline` entries that bind utility names
   to layer-2 variables via `var()`. Utilities and hand-written CSS therefore
   resolve to the *same* live value, and a theme switch updates both.

Never name a token after its value (`--indigo-500`, `--gray-100`): value names
can't survive a rebrand and invite components to choose colors instead of roles.

## tokens.css — the skeleton

Generate this file by filling the kit-derived values (marked `←`) and the
derived values the VERIFY stage approved. Keep the comments — they are the
audit trail.

```css
/* tokens.css — generated from the brand kit for <name>.
   Source of truth. Components may reference ONLY these properties. */

:root {
  color-scheme: light dark;            /* or the single scheme the kit declares */

  /* ---- color roles · LIGHT ------------------------------------------ */
  --canvas:         /* ← neutrals: white or barely-warm */;
  --surface:        /* one step off canvas */;
  --surface-raised: /* usually = canvas in light (elevation via shadow) */;
  --ink:            /* ← neutrals: near-black, brand-hue-tinted */;
  --ink-2:          /* secondary text — verify ≥ 4.5:1 */;
  --ink-3:          /* muted text — STILL ≥ 4.5:1; it carries information */;
  --line:           /* ink at 8–14% alpha */;
  --line-strong:    /* ink at ~20% alpha */;
  --accent:         /* ← the ONE accent */;
  --accent-hover:   /* darken (light theme) / lighten (dark theme) one step */;
  --accent-ink:     /* text ON accent — verify ≥ 4.5:1 */;
  --accent-text:    /* accent AS text on canvas — verify ≥ 4.5:1 per theme */;
  --accent-soft:    /* accent at 8–12% over canvas — badges, washes */;
  --focus:          var(--accent);
  --positive: ; --warning: ; --danger:  /* forms only — verify like ink */;

  /* ---- type ---------------------------------------------------------- */
  --face-display: /* ← kit display */, ui-sans-serif, system-ui, sans-serif;
  --face-body:    /* ← kit body */,    ui-sans-serif, system-ui, sans-serif;
  --face-mono:    /* ← kit mono */,    ui-monospace, "SF Mono", monospace;
  /* steps: size / line-height / tracking — see references/type-scale.md */
  --step--1: 0.875rem;                            --lh--1: 1.45;
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.125rem); --lh-0: 1.6;
  --step-1: clamp(1.125rem, 1.07rem + 0.25vw, 1.25rem); --lh-1: 1.55;
  --step-2: clamp(1.375rem, 1.32rem + 0.25vw, 1.5rem);  --lh-2: 1.3;  --tr-2: -0.01em;
  --step-3: clamp(1.75rem, 1.55rem + 0.85vw, 2.25rem);  --lh-3: 1.2;  --tr-3: -0.015em;
  --step-4: clamp(2.25rem, 1.95rem + 1.3vw, 3rem);      --lh-4: 1.12; --tr-4: -0.02em;
  --step-5: clamp(2.75rem, 1.97rem + 3.48vw, 4.75rem);  --lh-5: 1.05; --tr-5: -0.025em;

  /* ---- spacing & layout ---------------------------------------------- */
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem;  --space-6: 2rem;    --space-7: 3rem;    --space-8: 4rem;
  --space-9: 6rem;    --space-10: 8rem;
  --space-section: clamp(5rem, 4rem + 6vw, 10rem);
  --space-gutter:  clamp(1.25rem, 4vw, 2.5rem);
  --container-max: 72rem;
  --measure: 66ch;

  /* ---- radius (ONE family: sharp | soft | pill) ----------------------- */
  --r-control: ; --r-field: ; --r-card: ; --r-pill: 999px;
  /* nested-radius law: inner = outer − gap */

  /* ---- elevation (two layers each: tight key + soft ambient, hue-tinted) */
  --elev-0: none;
  --elev-1: ; --elev-2: ; --elev-3: ;

  /* ---- motion — shared dialect with the motion-video skill ------------ */
  --dur-1: 150ms; --dur-2: 240ms; --dur-3: 400ms; --dur-4: 800ms;
  --easing-out: cubic-bezier(0.16, 1, 0.3, 1);   /* entrances/reveals */
  --easing-ui:  cubic-bezier(0.25, 1, 0.5, 1);   /* micro feedback */
  --easing-io:  cubic-bezier(0.65, 0, 0.35, 1);  /* travels while visible */

  /* ---- stacking -------------------------------------------------------- */
  --z-nav: 100; --z-dropdown: 200; --z-modal: 300; --z-toast: 400;
}

@media (prefers-reduced-motion: reduce) {
  :root { --dur-1: 1ms; --dur-2: 1ms; --dur-3: 1ms; --dur-4: 1ms; }
  /* components must also drop transforms — opacity-only; see components.md */
}
```

Notes on the skeleton:

- **Type steps pair size with line-height and tracking** at the same index —
  a size is never used with a foreign leading. Steps −1 to 1 carry no tracking
  token (body tracking is 0); an eyebrow reuses `--step--1` with its own
  letter-spacing, defined in the component, from a documented value.
- **Fluid steps** use `clamp()` derived from two anchor viewports — the recipe
  and the algebra are in `references/type-scale.md`. Small sizes stay static;
  fluidity is for display.
- `--space-section` is a *rhythm* token, not a spacing step: it is the breath
  between arguments on the page, and `landing-page-design` composes with it.
- **The motion tokens are the page-side twins of `motion-video`'s.**
  `--easing-out` / `--easing-ui` / `--easing-io` and `--dur-1..4` carry the
  *same values* as motion-video's `--mv-ease-*` / `--mv-dur-*` — different names
  only so the page CSS and the video file's variables never collide when both
  live in one project. Ownership boundary: `landing-design-system` defines the
  motion vocabulary and the reveal/stagger laws; simple on-page reveals ride
  these tokens; composed video is `motion-video`.

## Dark/light wiring

The second theme overrides **raw tokens only** — components and Tailwind
utilities never know a theme exists. Support both an explicit switch and the
OS preference:

```css
[data-theme="dark"] {
  --canvas: …; --surface: …; --surface-raised: …;
  --ink: …; --ink-2: …; --ink-3: …;
  --line: …; --line-strong: …;
  --accent-hover: …;        /* lighten in dark, darken in light */
  --accent-text: …;         /* almost always needs a lighter variant — verify */
  --accent-soft: …;
  --elev-1: none;           /* elevation switches medium: borders + lighter    */
  --elev-2: none;           /* surfaces carry it; only modals keep a shadow    */
  --elev-3: 0 24px 64px rgb(0 0 0 / 0.5);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* same block as [data-theme="dark"] */ }
}
```

Author the dark block from the derivation, not by inverting: surfaces get
*lighter* as they rise, ink drops to 92–95% strength, and every contrast pair
re-runs through the validator. If the page ships single-theme (legitimate —
many premium pages do), set `color-scheme` accordingly and skip the blocks,
but keep the role names so a second theme remains a file-level change.

## theme.tailwind.css — the Tailwind block

Tailwind v4. Import order matters: tokens first, then bind. `@theme inline`
makes utilities reference the live `var()` (so `[data-theme]` switching works)
instead of freezing a build-time value.

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  /* color roles → bg-canvas, text-ink-2, border-line, bg-accent, … */
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-ink: var(--accent-ink);
  --color-accent-text: var(--accent-text);
  --color-accent-soft: var(--accent-soft);
  --color-focus: var(--focus);
  --color-positive: var(--positive);
  --color-warning: var(--warning);
  --color-danger: var(--danger);

  /* type → font-display, text-step-3, … (size + paired line-height) */
  --font-display: var(--face-display);
  --font-body: var(--face-body);
  --font-mono: var(--face-mono);
  --text-step--1: var(--step--1); --text-step--1--line-height: var(--lh--1);
  --text-step-0: var(--step-0);   --text-step-0--line-height: var(--lh-0);
  --text-step-1: var(--step-1);   --text-step-1--line-height: var(--lh-1);
  --text-step-2: var(--step-2);   --text-step-2--line-height: var(--lh-2);
  --text-step-3: var(--step-3);   --text-step-3--line-height: var(--lh-3);
  --text-step-4: var(--step-4);   --text-step-4--line-height: var(--lh-4);
  --text-step-5: var(--step-5);   --text-step-5--line-height: var(--lh-5);

  /* radius / elevation / motion → rounded-control, shadow-elev-1, ease-out-brand */
  --radius-control: var(--r-control);
  --radius-field: var(--r-field);
  --radius-card: var(--r-card);
  --radius-pill: var(--r-pill);
  --shadow-elev-1: var(--elev-1);
  --shadow-elev-2: var(--elev-2);
  --shadow-elev-3: var(--elev-3);
  --ease-out-brand: var(--easing-out);
  --ease-ui: var(--easing-ui);
  --ease-io: var(--easing-io);
}
```

Usage downstream: `bg-canvas text-ink`, `text-step-5 font-display
tracking-[var(--tr-5)]`, `rounded-control shadow-elev-1`,
`duration-[var(--dur-2)] ease-ui`. Durations and tracking ride through
arbitrary values on purpose — Tailwind has no first-class namespace for them,
and inventing pseudo-utilities adds surface without adding safety. Tailwind's
own palette (`bg-blue-500` etc.) is out of bounds in landing code; the token-only
grep in the QA gate should also flag Tailwind palette classes.

**Tailwind v3 fallback** (only on request): mirror layer 3 in
`theme.extend` with `colors: { canvas: "var(--canvas)", … }` — the raw-token
layer is identical, so nothing else changes.

## Kit → token mapping

| Kit field | Produces |
|---|---|
| `colors.primary[0]` | `--accent`, then derived `--accent-hover/-ink/-text/-soft`, `--focus` |
| `colors.neutrals` | `--canvas/-surface/-surface-raised`, `--ink/-2/-3`, `--line/-strong` (derived if absent — see color-and-contrast.md) |
| `type.display/body/mono` + `files` | `--face-*` + `@font-face` blocks (subset woff2, `font-display: swap`) |
| `logo` | used verbatim by components (nav, footer) — never a token, never retyped |
| `voice` | no tokens — routes to `landing-copywriter`; specimen placeholder text register |
| `cta` | the primary button's label + href in specimen and `system.md` |
| `proof` | the only permitted content for stat/testimonial/logo-row components |
| `competitors` | the collision check during DERIVE — flag, never silently restyle |

## Worked example — Acme

Acme, an analytics SaaS ("answers questions about your data in plain
English"). Kit: accent `#5B5BD6`; Space Grotesk / Public Sans / JetBrains Mono; dark
primary; CTA "Start free → https://acme.com/signup". The resolved raw layer — every pair
below passed the validator (ratios in comments):

```css
:root {          /* LIGHT (secondary theme for Acme) */
  --canvas: #FFFFFF;
  --surface: #F6F6F8;
  --surface-raised: #FFFFFF;
  --ink: #131316;            /* 18.5:1 on canvas */
  --ink-2: #4E4E55;          /*  8.3:1 */
  --ink-3: #6C6C74;          /*  5.2:1 — a 55% mix measured 4.3, nudged to 64% */
  --line: rgb(19 19 22 / 0.12);
  --line-strong: rgb(19 19 22 / 0.22);
  --accent: #5B5BD6;         /* as UI boundary on white: 5.4:1 */
  --accent-hover: #4C4CC8;   /* white label on hover: 6.6:1 */
  --accent-ink: #FFFFFF;     /* on accent: 5.4:1 */
  --accent-text: #4F4FCF;    /* as text on white: 6.3:1 */
  --accent-soft: rgb(91 91 214 / 0.10);
  --focus: var(--accent);
  --positive: #147A44; --warning: #925A12; --danger: #C0342B;
  --r-control: 10px; --r-field: 10px; --r-card: 16px; --r-pill: 999px;
  --elev-1: 0 1px 2px rgb(19 19 30 / 0.06), 0 1px 3px rgb(19 19 30 / 0.08);
  --elev-2: 0 2px 4px rgb(19 19 30 / 0.05), 0 8px 24px rgb(19 19 30 / 0.10);
  --elev-3: 0 4px 12px rgb(19 19 30 / 0.08), 0 24px 64px rgb(19 19 30 / 0.16);
}

[data-theme="dark"] {        /* DARK (Acme's primary theme) */
  --canvas: #0B0B0F;         /* indigo-tinted near-black, not #000 */
  --surface: #131318;
  --surface-raised: #1A1A21;
  --ink: rgb(244 244 246 / 0.95);  /* ≈16:1 — not pure white; avoids halation */
  --ink-2: #ABABB4;          /* 8.6:1 */
  --ink-3: #8A8A93;          /* 5.7:1 */
  --line: rgb(244 244 246 / 0.10);
  --line-strong: rgb(244 244 246 / 0.18);
  --accent: #5B5BD6;         /* as fill boundary on canvas: 3.7:1 (≥3 ✓) */
  --accent-hover: #6666DE;   /* lighten in dark — but #6E6EE0 dropped the white
                                label to 4.2:1 (FAIL); hover fills are checked
                                pairs too. This value: 4.7:1 ✓ */
  --accent-ink: #FFFFFF;     /* 5.4:1 on accent */
  --accent-text: #8F8FEA;    /* raw accent measured 3.7:1 as text — FAIL; this: 6.8:1 */
  --accent-soft: rgb(143 143 234 / 0.12);
  --positive: #4ECE84; --warning: #E0A94E; --danger: #F27A70;
  --elev-1: none;            /* elevation = lighter surface + line */
  --elev-2: none;
  --elev-3: 0 24px 64px rgb(0 0 0 / 0.5);
}
```

Everything else (type steps, spacing, motion, z) uses the skeleton's values
verbatim — Acme supplied no motion signature, so the shared defaults apply,
disclosed as such. Three instructive moments, all caught at VERIFY, not by
eye: light `--ink-3` needed a 64% mix instead of 55% (4.3 → 5.2); the accent
could not serve as dark-theme link text (3.7) — the per-theme `--accent-text`
exists precisely for that; and the first dark hover candidate lightened the
fill past its white label (4.2). This is the pattern to expect with *any*
mid-saturation brand accent, which is why `accent` and `accent-text` are
separate roles in every derivation, not an Acme quirk.
