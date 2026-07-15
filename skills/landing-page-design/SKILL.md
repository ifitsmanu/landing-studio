---
name: landing-page-design
description: >-
  Compose landing pages and marketing homepages section by section — hero anatomy,
  section order, visual hierarchy, whitespace, staging real product UI, and where
  social proof, pricing, FAQ, and the final CTA live — in the premium-SaaS idiom
  (OpenAI, Anthropic, Stripe, Linear, Vercel, Framer, Apple, Raycast). Use whenever
  the user says "design the landing page", "landing page layout", "what sections
  should the page have", "page structure", "hero section", "homepage design",
  "wireframe the marketing site", "compose the page", "make it feel like
  Stripe/Linear", or wants any marketing page planned, restructured, or critiqued.
  Works for ANY brand and product: it takes a shared brand kit as input (name,
  colors, type, logo, screenshots, voice, one CTA, sourced proof) and hardcodes
  nothing. Output is a section-by-section LAYOUT SPEC a builder can implement —
  this skill decides structure and hierarchy; it routes tokens/components to
  landing-design-system, words to landing-copywriter, and video to motion-video.
---

# Landing Page Design

Turn any product plus a supplied brand kit into a section-by-section layout spec
for a landing page with the "inevitable" premium feel: one promise delivered in
five seconds, real product UI staged as the hero, sections ordered as an argument,
and one visually primary CTA carried from first viewport to last.

Three things are load-bearing and everything else serves them: **quality** (every
viewport is a poster), **attention** (the page survives a visitor who might leave
at any scroll depth), and **the CTA** (one verb, one destination, present in every
chapter of the page — conversion is the organizing spine, not an appendix).

## What this makes — and what it is not

The deliverable is a **layout spec**: a markdown document that names every section
in order and, for each, its job, layout, content slots with word budgets, visual
material, CTA carriage, responsive behavior, and motion notes — precise enough
that a builder can implement it without asking questions, and abstract enough that
it contains no copy, no hex codes, and no component code. The reference canon is
how the best software companies compose their pages: OpenAI's product-input-as-hero,
Anthropic's editorial trust register, Stripe's dual-audience density, Linear's
screenshots-as-art, Vercel's workflow-as-proof, Framer's recursive self-demo.
Beat-by-beat teardowns of all six live in `references/teardowns.md`.

Boundaries — this skill is one instrument in the **landing-studio** packet; route
by name instead of duplicating:

- **Tokens, type scale, grid, spacing values, components** → `landing-design-system`.
  This skill says "display headline, ~2× body scale, one accent"; that skill says
  which pixel values and builds the buttons.
- **The actual words** → `landing-copywriter`. This skill defines every content
  slot and its word budget ("headline ≤8 words, names the outcome"); that skill
  fills them. Placeholder copy in a spec is fine; shipping it is not.
- **Any video or motion file** — launch film, hero video loop, social cutdowns —
  → `motion-video`. Never re-implement it; this skill only decides *where* a loop
  lives on the page and what its carriage rules are (poster, size budget,
  reduced-motion still).
- **SEO / answer-engine / generative-engine structure** → `seo-audit`, `aeo-audit`,
  `geo-audit`. This skill bakes in the structural affordances they need (a clear page-topic heading,
  semantic sections, a real-text FAQ) and stops there.
- **Sequencing the whole build** → `landing-page-build`, the orchestrator. When it
  is running, this skill is its page-composition stage.

If some sibling skills are absent, proceed anyway — each boundary above degrades
gracefully into "note it in the spec and flag it as out of scope."

## Step 0 — Collect the brand kit

Nothing in this skill carries a brand. Every color, typeface, logo, screenshot,
sentence of voice, competitor name, and CTA arrives through the packet's shared
**brand kit**, gathered before any layout work — this reads the packet's canonical
`brand-kit.md` (see the packet root template), the same file every landing-studio
skill reads. Store it as one file in the working directory so every packet skill
reads the same source of truth. Consume the packet-root canonical paths `brand`,
`product.one_liner`, `product.audience`, `product.ui_material`, `voice`, `cta`,
`proof`, `competitors`, `research`, and `constraints`. Do not create a second
schema in this skill.

Rules of engagement: when a field is missing, ask — batched, not dripped — or
apply a documented genre default and say so (e.g., "no accent supplied: using fg
at full strength for the CTA until you pick one"). Never fabricate logos, stats,
testimonials, or customer names: **a proof element without a `source` row does not
get a slot on the page.** If the project ships its own brand-voice or
design-system skill or file, defer to it wherever they overlap — but never require
one; this skill must produce a complete spec from the kit alone. A total reskin of
the spec must be achievable by swapping the kit; if you catch yourself typing a
brand value into the spec body, stop and reference the kit field instead.

## The spine: the 5-second promise

A landing page is really three nested products, exactly like a film's poster,
hook, and argument:

1. **The first viewport** — a static poster that answers, in ~5 seconds: *what is
   this, who is it for, why believe it, what do I do next?*
2. **The first scroll** — the promise plus decisive proof for visitors who need
   confidence before committing more attention.
3. **The full page** — a conviction sequence for the skeptical minority who scroll,
   ordered so that each section answers the objection the previous one raised.

Scroll exposure varies by traffic source, intent, device, page length, and product.
Order sections by argumentative necessity and the strongest available evidence,
then measure actual exposure and conversion after launch. Design the page to pass
a **bail-at-any-depth test**: a visitor who leaves at any scroll position should
still understand the product and the primary next action.

### Hero anatomy — five parts, in reading order

| Part | Budget | Job |
|---|---|---|
| **Headline** (the h1, the only one on the page) | ≤10 words, ideally 4–8 | Name the outcome or the category-defining claim — not the feature list. Largest type on the page. |
| **Subhead** | ≤25 words, 1–2 lines | Say literally what the product is and for whom; the headline earns attention, the subhead earns comprehension. |
| **CTA** | 1 primary (the kit's verb), ≤1 quiet secondary | The kit's verb + destination, in the accent, highest-contrast interactive element in the viewport. |
| **Proof line** | 1 row: 4–6 logos, a rating, or one sourced stat | Borrowed trust within the first viewport — every element traced to a kit `proof` row. |
| **Visual** | one staged product image, live embed, or motion-video loop | The product *shown doing the claim* — see "Staging real product UI" below. |

An optional eyebrow (≤4 words, above the headline) sets category or announces
news; it is the first thing cut when the viewport is tight. Full geometry, six
hero archetypes, and when to choose each: `references/hero-patterns.md`.

## Section order & rhythm — the canonical spine

The default order for a premium SaaS landing page, with the reasoning that lets
you deviate deliberately (full catalog with variants, budgets, and skip-rules in
`references/section-catalog.md`):

| # | Section | Job — the question it answers |
|---|---|---|
| 0 | **Nav** | Always-available exit to the CTA. Sparse (≤5 links), primary CTA at the right edge, never inside a hamburger on desktop. |
| 1 | **Hero** | "What is this and why do I care?" — the 5-second promise. |
| 2 | **Proof strip** | "Who else trusts this?" — logos/rating immediately after the claim, before any feature talk. |
| 3 | **Proof section 1 — flagship** | "Show me." The single strongest capability, biggest visual on the page after the hero. |
| 4–5 | **Proof sections 2–3** | "What else?" Supporting capabilities, one idea per section, escalating or complementary — never a feature dump. |
| 6 | **How it works / deep dive** | "How would this fit my life?" 3–4 steps, or code for developer products. Optional. |
| 7 | **Social proof** | "What do people like me say?" Human voice *after* machine proof — testimonials land harder once capability is established. |
| 8 | **Pricing** | "What does it cost?" On-page for self-serve; a link plus a demo CTA for sales-led. |
| 9 | **FAQ** | "What's stopping me?" 5–8 real objections answered honestly, as real text in the DOM (the aeo/seo audits depend on this). |
| 10 | **Final CTA** | The close: the hero's promise restated over the calmest, highest-contrast band on the page; one verb, zero competing links. |
| 11 | **Footer** | Utility and long-tail trust. The page's argument must be complete before it. |

**Rhythm rules** — order is the argument; rhythm is what makes it feel composed:

- **One idea per section.** If a section demonstrates two things, it's two sections
  — or one of them isn't worth a section.
- **7–10 sections total** for a full page. Below 5 the argument has holes; above
  ~11 the page is a feature dump wearing a nice grid.
- **Vary density like music**: a big sparse claim, then a denser proof passage,
  then a breath. Metronomic left/right alternating media-text sections read as
  template — break the alternation at the flagship and at the close.
- **Background bands mark chapters, not sections.** 2–3 band changes across the
  page (e.g., canvas → subtle surface → high-contrast close); a new color per
  section reads as a quilt.
- **The CTA recurs at chapter boundaries** — hero, after the strongest proof,
  final CTA — always the same verb and destination. Different verbs are different
  actions. Keep one visually primary path unless the buying journey supplies a
  documented reason for a subordinate alternative.

## Visual hierarchy & whitespace — the laws

- **One focal point per viewport.** At any scroll position, the eye should land in
  exactly one place. Test by squinting: if two elements fight, demote one.
- **Hierarchy is built in this order of power: size → weight → color → position.**
  Reach for the next tool only when the previous one is exhausted; pages that do
  hierarchy with color alone look like dashboards.
- **Whitespace is the premium signal.** Space *between* sections must comfortably
  exceed space *within* them (proximity is grouping); generous vertical padding
  around sparse content is what separates the reference canon from template kits.
  Exact scale values belong to `landing-design-system` — this spec says "hero
  breathes ~2× a proof section," not "128px."
- **Text measure 45–75 characters.** Full-width paragraphs are the single most
  common tell of an unconsidered page.
- **The accent is punctuation, not wash.** It marks the CTA and at most one focal
  moment per viewport. An accent-colored everything means nothing is important.
- **Contrast carries meaning**: headline at full fg strength, body slightly
  quieter, captions quieter still — all pairs AA-verified per the kit's notes.

## Staging real product UI as the hero

The product is the protagonist; illustration where a screenshot could live is an
admission the product isn't worth looking at.

- **Real UI, art-directed** — cropped to the money feature, not the whole app;
  a screenshot pasted full-bleed is a bug report, a screenshot *staged* (generous
  canvas, deliberate crop, soft elevation, optional minimal window chrome) is
  evidence. Linear's pages treat screenshots as lit, masked images — that is the
  bar (`references/teardowns.md`).
- **Perspective restraint**: flat or barely-tilted. Heavy 3D tilts and floating
  isometric collages read as 2019-era template.
- **Data honesty**: synthetic data must be plausible, internally consistent, and
  must never impersonate a real customer; any real number visible in the UI needs
  a kit `proof` row like any other claim.
- **Export at 2× and art-direct per breakpoint** — the mobile hero gets a tighter
  crop, not a shrunk desktop image (`references/responsive.md`).
- **If the hero moves**, it is a motion-video deliverable: route production there
  and carry it here with a designed poster frame, a few-MB budget, silent
  autoplay-loop rules, and a reduced-motion static fallback. On-page scroll/entrance
  motion stays restrained: reveal once, short distances, small staggers, one moving
  thing at a time, honoring `prefers-reduced-motion` — and no meaning may live
  *only* in motion, because half the audience scrolls past before it fires.

## Output format — the layout spec

The layout spec is the approval unit: write it, get sign-off, and only then does
building begin. Use this exact structure:

```markdown
# <kit: brand.name> — landing page layout spec
## 0. Foundation
- Goal: <primary cta.verb → cta.destination>; audience: <product.audience>
- Page shape: <N sections>, chapters: <band plan>, references: <archetype chosen + why>

## Section <n> — <name>
- **Job**: <the one question this section answers>
- **Layout**: <structure, alignment, focal point, band; token values → landing-design-system>
- **Content slots**: <each slot + word budget; copy → landing-copywriter>
- **Visual**: <which kit screenshot/recording, staging notes; video → motion-video>
- **CTA**: <present/absent; always the kit verb if present>
- **Responsive**: <stack order, crop changes, what collapses — per references/responsive.md>
- **Motion**: <entrance/loop notes, reduced-motion fallback>
- **Claims**: <kit proof rows used — none used, none shown>
```

Every section entry must be implementable without asking a question, and the whole
spec must contain zero brand values that don't trace to the kit.

## QA gate & definition of done

Run before calling the spec (or the built page) done — full checklist and
walkthrough script in `references/section-catalog.md` §QA:

- **5-second test** — show a fresh reader the hero for 5 seconds: can they say
  what it is, who it's for, and what to click?
- **Squint test per viewport** — scroll the page stopping at every viewport; one
  focal point each, no dead viewports, no two-idea sections.
- **CTA audit** — count primary CTAs: one verb, one destination, present in nav,
  hero, mid-page, and close; secondary actions visibly demoted.
- **Bail-at-any-depth test** — leave at any scroll position: name, claim, and
  action all known?
- **390px scroll-through** — the entire argument survives a phone width with no
  horizontal scroll and no hover-only meaning.
- **Structure audit** — clear page-topic heading and logical outline; sections semantic; FAQ is real text.
- **Claims traceability** — every number, quote, and logo maps to a kit proof row.
- **Brand-kit conformance** — colors, type, logo exactly as supplied; nothing else.

**Done =** spec approved + all gate checks pass + open questions routed to the
right sibling skill by name. Quality, attention, and the CTA are *verified*, not
asserted.

## Worked example — Acme, an analytics SaaS

Compressed; the full spec appears as the running example across the references.

- **Kit**: Acme — "Acme answers questions about your data in plain English";
  audience: data-curious product teams who currently wait on analysts; near-black
  bg / off-white fg / one accent + three neutrals with AA notes; geometric display
  face + neutral body + mono (developer-adjacent); SVG wordmark; four product
  screenshots + one screen recording; voice: plain, confident, zero hype;
  CTA **Start free → https://acme.com/signup**; proof: 5 customer logos, one latency
  metric, two testimonials — each with a source row; competitors: two named
  dashboard-era incumbents.
- **Archetype**: centered claim + staged UI below (the product's answer view *is*
  the argument) — chosen over a split hero because the screenshot is landscape and
  the claim is short.
- **Spine (9 sections)**: Nav (4 links + Start free) → Hero (h1 "Answers, not
  dashboards." ≤4 words; subhead names the product literally; Start free + quiet
  "View docs"; logo proof row; staged answer-view screenshot, tight crop, soft
  elevation, dark UI on near-black canvas with a single accent glow) → Proof strip
  folded into hero → Flagship proof: ask → answer, the recording as an ≤8s silent
  loop produced by **motion-video**, poster + reduced-motion still → Proof 2:
  anomaly auto-flagged (static, denser band) → Proof 3: one-click shared report →
  How it works: 3 steps, mono type for the connect step → Social proof: one
  spotlight testimonial + metric tile (both ledgered) → Pricing: 3 tiers,
  middle pre-selected, annual toggle → FAQ: 6 objections (security, data access,
  accuracy, migration from the named incumbents, pricing edge, team size) → Final
  CTA: claim restated on the calmest band, Start free, nothing else → Footer.
- **Rhythm**: two band changes (canvas → surface at How-it-works → canvas at the
  close); density peaks at proof 2, breathes before pricing; CTA at hero,
  post-flagship, close.
- **Routing out**: token values → landing-design-system; all slot copy →
  landing-copywriter; the hero loop and a 30s feed cutdown → motion-video; FAQ
  markup → aeo-audit.

## Reference index

Read SKILL.md first; open a reference when its trigger applies.

| File | Read this when… |
|---|---|
| `references/hero-patterns.md` | Designing the first viewport — the 5-second promise in depth, six hero archetypes, above-the-fold math, UI staging craft, background systems, failure gallery. |
| `references/section-catalog.md` | Choosing, ordering, or designing any section below the hero — the full catalog with anatomies, budgets, variants, skip-rules, assembly recipes per business model, and the QA walkthrough. |
| `references/teardowns.md` | You want the idiom in your ear — viewport-by-viewport teardowns of OpenAI, Anthropic, Stripe, Linear, Vercel, and Framer, plus the cross-cutting patterns. |
| `references/responsive.md` | Specifying behavior across breakpoints — the mobile hero, section transforms, nav collapse, touch and performance rules, and the test matrix. |
