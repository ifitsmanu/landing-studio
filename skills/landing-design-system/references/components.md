# Components — the inventory, states, and token bindings

The parts list every downstream skill composes from. Each component is
specified as anatomy + token bindings + states, bound to an emphasis level
(E1–E5, SKILL.md) so the page's attention budget is enforced by construction.
This file specifies *parts*; section order, hero composition, and page
hierarchy belong to `landing-page-design`, and every visible word belongs to
`landing-copywriter`.

## Contents

1. [Global component laws](#global-component-laws)
2. [Buttons](#buttons)
3. [Text links](#text-links)
4. [Inputs & the email-capture combo](#inputs--the-email-capture-combo)
5. [Nav bar](#nav-bar)
6. [Cards — feature, pricing, testimonial](#cards)
7. [Stat](#stat)
8. [Badge & eyebrow](#badge--eyebrow)
9. [Logo row](#logo-row)
10. [Section header](#section-header)
11. [FAQ / accordion](#faq--accordion)
12. [Footer](#footer)

## Global component laws

- **Token-only.** Every color, size, radius, shadow, duration, and curve is a
  `tokens.css` reference. A raw value is a portability bug (and the QA grep
  will find it).
- **Five states, always:** default / hover / focus-visible / active /
  disabled. A component missing a state isn't done — hover-only interactivity
  excludes every keyboard user, and landing pages get audited.
- **Focus ring, one spec everywhere:**
  `outline: 2px solid var(--focus); outline-offset: 2px;` on
  `:focus-visible` (never bare `:focus` — mouse users see phantom rings). The
  ring must clear 3:1 wherever focus can land (AA matrix row 7).
- **Hit areas ≥ 44×44px** for anything tappable — a landing page is mostly
  read on phones.
- **Transitions:** `--dur-1`/`--easing-ui` for hover and press;
  `--dur-2`/`--easing-out` for open/close. Transition specific properties
  (`color, background-color, border-color, box-shadow, transform, opacity`),
  never `all`.
- **Reduced motion:** with `prefers-reduced-motion`, transforms collapse to
  opacity-only; the durations already collapse via tokens.
- **Real content or none.** Stats, quotes, names, and logos come from the
  kit's `proof` list with sources — a component with no sourced content ships
  empty or is cut. Specimen placeholders must be unmistakably placeholder
  ("[Quote pending — needs proof row]"), never plausible fakes.

## Buttons

The primary button is the most designed element in the system — it is where
the entire page cashes out (emphasis level E2).

**Anatomy:** label (+ optional trailing arrow/icon at 1em). No leading icons
on the primary CTA; the verb is the design.

**Variants and bindings:**

| | Primary (E2) | Secondary (E4) | Ghost (E4/E5) |
|---|---|---|---|
| Fill | `accent` | `surface` or transparent | transparent |
| Text | `accent-ink` | `ink` | `ink-2` |
| Border | none | 1px `line-strong` | none |
| Hover | `accent-hover` fill | border → `ink`-strength, fill `surface` | text → `ink` |
| Active | fill + `transform: translateY(1px)` | same | same |
| Disabled | 40% opacity, no pointer events | same | same |

**Sizes:** md 40px / lg 48px height (lg for the hero CTA), padding-inline
`--space-5`/`--space-6`, radius `--r-control`, font `--face-body` at
`--step-0`, weight 500–600.

**Laws:**

- Solid `accent` fill exists on exactly one variant. If a design wants two
  solid-accent buttons side by side, the answer is demotion, not a second
  fill — this is the emphasis ladder enforced in CSS.
- Label = the kit's CTA verb; destination = the kit's CTA URL. One verb, one
  destination — if the user supplies two asks, route the choice back to them
  (and to `landing-copywriter` for wording).
- No gradient fills, no glow, no animated sheen. The premium CTA is calm; it
  wins by contrast and isolation, not by effects.

**Reference implementation** (tokens only — restyle by swapping the kit):

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-2); min-height: 44px; padding: 0 var(--space-5);
  border-radius: var(--r-control);
  font: 500 var(--step-0)/1 var(--face-body);
  cursor: pointer; border: 1px solid transparent;
  transition: background-color var(--dur-1) var(--easing-ui),
              border-color     var(--dur-1) var(--easing-ui),
              color            var(--dur-1) var(--easing-ui),
              transform        var(--dur-1) var(--easing-ui);
}
.btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
.btn:active { transform: translateY(1px); }
.btn[disabled] { opacity: 0.4; pointer-events: none; }

.btn--primary   { background: var(--accent); color: var(--accent-ink); }
.btn--primary:hover { background: var(--accent-hover); }
.btn--secondary { background: transparent; color: var(--ink);
                  border-color: var(--line-strong); }
.btn--secondary:hover { border-color: var(--ink); background: var(--surface); }
.btn--ghost     { background: transparent; color: var(--ink-2); }
.btn--ghost:hover { color: var(--ink); }
```

## Text links

`accent-text` color; underline appears on hover at minimum (always-underlined
inside body copy — color alone is not an affordance);
`text-underline-offset: 0.2em`. In chrome (nav, footer) links are `ink-2` →
`ink` on hover, reserving accent for content links. External links get no
decoration beyond convention — arrow glyphs everywhere read as template.

## Inputs & the email-capture combo

**Input:** height ≥ 44px; `surface` fill (or `canvas` + `line-strong`
border); radius `--r-field`; text `ink` at `--step-0`; placeholder `ink-3`
(which the color system keeps ≥ 4.5:1 — placeholders are text too); focus =
ring spec, plus border → `focus`.

**Error state:** border `danger` + a `--step--1` message in `danger` below
the field + `aria-invalid` + `aria-describedby`. Never color alone; never a
tooltip-only error.

**Email-capture combo** (the conversion workhorse): input + primary button in
one row, sharing `--r-field` geometry (nested-radius law if the button sits
inset); stacks vertically under ~480px with the button full-width; label may
be visually hidden but must exist (`aria-label` minimum); the button label is
the kit's CTA verb — "Submit" converts nobody. Success state replaces the
form ("Check your inbox") — no dead-end alerts.

## Nav bar

E5 chrome — the nav's job is to not compete with the hero while keeping the
CTA one glance away.

- Height 64px desktop / 56px mobile; content on the `--container-max` grid.
- Left: the kit's wordmark asset at its natural proportions (link to `/`,
  accessible name = brand name). Never retype the wordmark in the display
  face — real marks carry custom kerning and cuts.
- Center/right: 3–5 links (`--step--1`/`--step-0`, `ink-2` → `ink`). More
  than 5 links is an information-architecture problem, not a styling one.
- Far right: one ghost link (e.g. sign in) + **the primary button, md size**
  — the CTA's persistent echo.
- Scrolled state: transparent at top → `canvas` at ~85% opacity +
  `backdrop-filter: blur(12px)` + bottom `line` hairline after ~24px scroll,
  transitioned at `--dur-2`. No shrinking logos or morphing nav — that
  spends motion budget on chrome.
- Mobile: collapse to a menu that uses the same tokens; the primary CTA
  stays visible *outside* the collapsed menu whenever width allows.

## Cards

Shared skeleton: `surface` fill, 1px `line` border, `--r-card` radius,
`--space-6` interior padding, `--elev-0/1` at rest.

**Feature card (E4):** icon or small product crop, `--step-2` title (display
face), 2–3 lines of `--step-0` body in `ink-2`. Hover elevation (`--elev-2`,
translateY(−2px), `--dur-2`) only if the card is a link; decorative hover on
non-interactive cards is a false affordance.

**Pricing card (E4):** plan name (`--step-2`), price (`--step-4`, display
face, `tabular-nums`), feature list with `--space-3` row gaps, one button per
card — primary variant on the recommended tier only, secondary on the rest.
The highlighted tier gets an `accent` *border* + a `accent-soft` badge —
never a solid accent card, which would out-shout the CTA itself.

**Testimonial card (E4):** quote at `--step-1` in `ink`, name + role at
`--step--1` in `ink-3`, optional avatar (24–32px, `--r-pill`). Real quote,
real name, kit-sourced — an invented testimonial is the one component bug
that becomes a legal bug.

## Stat

E3 — the number at `--step-4`/`--step-5` in the display face with
`tabular-nums`, label at `--step--1` in `ink-3`. Every stat maps to a kit
`proof` row (claim + source); rounding conservative. No source, no stat — an
empty stat row is a missing input, a fabricated one is a lie with good
typography.

## Badge & eyebrow

- **Badge/chip:** `--step--1`, `accent-soft` fill, `accent-text` text,
  `--r-pill`, padding `--space-1 --space-3`. For "New"/announcement chips
  above the headline.
- **Eyebrow:** `--step--1`, uppercase, +0.08em tracking, weight 500–600,
  `ink-3` or `accent-text`. Opens sections; part of the section-header unit.

## Logo row

Social proof strip: 4–8 customer logos, rendered **monochrome in `ink-3`**
(SVGs with `fill: currentColor`, or a grayscale+opacity filter), equal
*optical* height ≈ 24–28px (optical: a wide wordmark runs shorter than a
square mark), gaps ≥ `--space-7`, optional `--step--1` `ink-3` header. Logos
come from the kit with permission noted in `proof`; full-color logo salads
read as ad-network placements, which is the opposite of proof.

## Section header

The page's repeating rhythm unit (E3): eyebrow → `--step-3` heading (display
face, `text-wrap: balance`) → optional `--step-1` subhead in `ink-2`, capped
at `--measure`. Gaps: `--space-3` eyebrow→heading, `--space-4`
heading→subhead, `--space-8` header→section body. Left-aligned or centered —
pick once per page, never mixed.

## FAQ / accordion

Real `<details>/<summary>` or a `button[aria-expanded]` pattern — a landing
FAQ may also be a search/answer surface (`seo-audit`/`aeo-audit` will review
its visible clarity and any currently supported markup). Rows separated by `line`
hairlines; summary at `--step-1` weight 500 with a chevron rotating 180° at
`--dur-2`/`--easing-out`; panel opens at `--dur-2` (grid-template-rows or
height animation), body in `ink-2` at `--step-0`. One panel open at a time is
optional; scroll-hijacking is not.

## Footer

E5 — the calm end. `surface` or `canvas` with a top `line` hairline,
`--space-9` padding-block, wordmark + one-liner, 2–4 link columns at
`--step--1` (`ink-3` → `ink-2` hover), legal line last. Echo the CTA once —
a heading (`--step-3`) + the primary button above the link columns — because
a reader who reached the footer read everything and deserves the ask without
scrolling back. This echo and the hero CTA are the same verb, same
destination, same component.
