# Responsive Behavior — one argument, every width

A landing page is one argument that must survive every viewport, not a desktop
design that degrades gracefully. Use the project's device and traffic data when
available; regardless of the split, the mobile rendering must remain complete.
Specify responsive behavior
per-section in the layout spec (the `Responsive:` line), using the rules here.

Token values — exact breakpoints, fluid type curves, spacing steps — belong to
`landing-design-system`. This file owns *structural behavior*: what stacks, what
reorders, what crops, what collapses, and what must never be lost.

## Contents

1. [Philosophy & breakpoints](#philosophy--breakpoints)
2. [The mobile hero](#the-mobile-hero)
3. [Navigation collapse](#navigation-collapse)
4. [Section transforms](#section-transforms)
5. [Type, touch, and motion](#type-touch-and-motion)
6. [Performance is design](#performance-is-design)
7. [The sticky mobile CTA](#the-sticky-mobile-cta)
8. [Test matrix](#test-matrix)

## Philosophy & breakpoints

- **Design the mobile and desktop hero in parallel, not in sequence.** A desktop
  design "made responsive" afterward always shows the seams: orphaned visuals,
  absurd type scales, six screens of stacked cards. The layout spec writes both
  renderings for every section from the start.
- **Breakpoints are content-driven, not device-driven.** The canonical set —
  roughly 'one column' (<~640), 'two columns possible' (~640–1024), 'full
  layout' (>~1024), plus a container max-width cap (~1100–1280px is the genre
  norm) — exists because that's where layouts *break*, not because devices live
  there. If a section's layout breaks elsewhere, add a section-local breakpoint
  rather than distorting the global set. Exact values: `landing-design-system`.
- **Cap the container.** Uncapped full-width text and heroes on 27″ displays is
  a top-three template tell. Content measures stay 45–75ch at every width.
- **Nothing disappears silently.** Hiding content on mobile is a decision about
  the argument, not a layout convenience: if a section can be dropped at 390px
  without weakening the argument, question whether it earns its desktop place.
  Prefer compression (tighter crops, collapsed accordions, fewer grid cells
  shown + "see all") over deletion — and never hide the proof strip, pricing
  conditions, or any CTA.

## The mobile hero

The 5-second promise must survive a 390 × ~660px first paint:

- **Stack order**: eyebrow (if kept) → headline → subhead → CTA → proof line →
  visual. Text before visual, always — the visual becomes the reward for the
  first swipe rather than a tax before the promise.
- **The CTA lands in the first screenful.** This is the hard constraint the
  whole stack serves; if it doesn't fit, cut the eyebrow, tighten the subhead —
  never push the button down.
- **Headline budget tightens**: what set as 2 lines at desktop may set as 3 at
  mobile — acceptable; 4+ lines is a wall, so prefer the shorter headline
  variant if the spec defined one. Fluid type handles the size (tokens via
  `landing-design-system`); the spec handles the line-count intent.
- **Art-direct the visual, don't scale it.** A desktop-wide product shot scaled
  to 358px is an eye test. Supply a tighter crop of the money feature for
  narrow viewports (art-directed source switching, not just resolution
  switching). If no legible crop exists, run the mobile hero text-first and let
  the flagship proof section carry the first visual.
- **Full-width CTA button** at mobile (inside container padding), comfortably
  in thumb reach.
- **Proof line compresses**: 4–6 logos become 3–4, or one line of rating/stat;
  never a horizontally-scrolling logo row in the hero.

## Navigation collapse

- **The primary CTA stays outside the hamburger.** Collapsed mobile nav =
  logo left, CTA button right, menu trigger beside it. Burying the page's one
  conversion action inside a drawer is the single most common mobile conversion
  bug.
- The drawer itself: the ≤5 links, full-screen or sheet, close affordance
  obvious, CTA repeated at the drawer's bottom.
- Sticky behavior carries to mobile but shrinks harder (thinner bar); never let
  a sticky nav plus a sticky CTA bar plus an OS bar eat a third of the screen —
  if the sticky CTA bar is in play (below), the nav CTA may hide while it shows.

## Section transforms

Default transforms per catalog section — the spec's `Responsive:` line states
exceptions:

| Section | Desktop → mobile transform |
|---|---|
| **Split media/text** | Stack, text first — even when the desktop visual sits left. Alternating sides collapse to identical stacks, which is why alternation alone can't be the page's rhythm (`section-catalog.md` §rhythm). |
| **Full-width showcase** | Intro stacks above a tighter-cropped visual; visual may bleed to screen edges (ignore container padding) for scale. |
| **Bento grid** | Single column, **cells reordered by priority** (flagship cell first) — never DOM order if DOM order was arranged for a 2D grid. Cut tail cells behind a "see all" if >6. |
| **Tabbed showcase** | Tabs become an accordion, or a stacked run of the top 2–3 panels; the strongest tab's content must remain the first thing visible. |
| **Sticky-scroll walkthrough** | Falls back to plain stacked steps (text + visual per step). The fallback is the mobile design, not an apology — spec it explicitly. |
| **Logo strips / integration walls** | Wrap to 2 rows or reduce count; equal optical sizing matters more at small sizes. Marquees pause-on-touch and honor reduced motion. |
| **Testimonial wall** | Single column, best quote first; or spotlight-only with the wall behind "more stories." |
| **Metrics band** | 2×2 grid or vertical stack; numbers keep their display-scale jump. |
| **Comparison table** | Never shrink to fit. Either: product column pinned while competitor columns scroll horizontally (scroll affordance visible — a cut-off column edge), or restructure as per-criterion cards. Row labels must stay visible while scrolling. |
| **Pricing tiers** | Stack with the **recommended tier first** (not left-to-right DOM order); or a swipeable row with the recommended card initially centered and edges peeking. Billing toggle stays above the first card; per-card feature lists may collapse behind "see features." |
| **FAQ** | Already single-column; ensure whole question row is tappable, not just a chevron. |
| **Final CTA** | Unchanged in structure; full-width button; padding stays generous — do not let the close compress into a footer-adjacent afterthought. |
| **Footer** | Columns become accordions or stacked groups; legal/compliance lines stay visible. |

## Type, touch, and motion

- **Measure holds 45–75ch at every width**; body size never drops below the
  system's readable floor to "fit" — reflow instead (values:
  `landing-design-system`).
- **Touch targets ≥44px** in both dimensions, ≥8px apart — buttons, accordion
  rows, tabs, nav links, carousel controls.
- **No hover-only meaning.** Tooltips, hover-revealed feature detail, and
  hover-swapped images must have a visible-by-default or tap equivalent. Hover
  states remain as *enhancement* on pointer
  devices.
- **Motion de-escalates on mobile**: entrance reveals shorten or drop (scroll
  velocity on phones outruns choreography); parallax and scroll-linked effects
  default off; `prefers-reduced-motion` honored globally — every loop shows its
  poster, every reveal renders settled. A page that requires motion to make
  sense fails its reduced-motion and no-motion states regardless of audience share.

## Performance is design

Perceived speed is part of the premium feel — the reference canon's pages feel
expensive partly because they render *instantly*. Structural rules the layout
spec controls (deep technical auditing → `seo-audit`):

- **The LCP element is almost always the hero visual or headline.** Hero image:
  preloaded, modern format, tightly compressed, correctly sized per breakpoint
  (the art-directed crops double as weight savings); never lazy-loaded. Hero
  headline: display font preloaded, `font-display` strategy chosen so the claim
  doesn't flash invisible.
- **Everything below the first viewport lazy-loads**; everything inside it
  doesn't.
- **Motion loops**: poster image loads first and *is* the LCP candidate; video
  loads after; few-MB budget per `motion-video` carriage rules.
- **No layout shift in the first viewport**: reserve space for the hero visual,
  logos, and any embed — a CTA that jumps as fonts/images land is a conversion
  bug and a CLS penalty in one.
- **Third-party weight** (chat widgets, analytics, embeds) loads after
  interaction-readiness; a support bubble must never beat the hero to paint.

## The sticky mobile CTA

A persistent bottom bar with the kit's verb, for long mobile pages:

- **Use when** the page runs >6 screens on mobile and the audience converts on
  mobile (self-serve, app-install, event). Skip for sales-led pages where the
  ask is a considered demo booking.
- **Anatomy**: one full-width button (the kit's verb), thin bar, safe-area
  padding; optionally one line of reassurance. Nothing else — a sticky bar with
  competing links is a nav, and there already is one.
- **Behavior**: appears after the visitor scrolls past the hero CTA (before
  that it's redundant), hides when the final CTA or pricing CTAs are on screen
  (never stack two identical asks in view), never overlaps form inputs or the
  keyboard.

## Test matrix

Run the page through, minimum:

| Width | Represents | Check |
|---|---|---|
| 360–390px | Baseline phones | Full QA pass 3 (`section-catalog.md`): argument intact, CTA in first screenful, stack orders, tap targets, no horizontal scroll anywhere |
| 768px | Tablet / split-screen | The awkward middle: two-column layouts that half-fit; nothing stretched or stranded |
| 1024px | Small laptop | Full layout engages sanely; hero fold math at ~650px usable height |
| 1280–1440px | Standard desktop | The design-target rendering; container caps engaged |
| ≥1920px | Large desktop | Caps hold; backgrounds/bands extend gracefully; no uncapped hero text |

Plus, at any one width: reduced-motion pass (everything renders settled),
keyboard-only pass (CTA reachable, accordion/tabs operable, focus visible), and
a slow-network first paint (poster/headline first, no CTA jump).

Cross-check every section's spec entry: its `Responsive:` line names its
transform from the table above or states its exception — a section with no
responsive intent written down is a section that will be improvised at build
time, and improvised responsiveness is where premium pages go to die.
