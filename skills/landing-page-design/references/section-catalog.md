# Section Catalog — everything below the hero

The page is an argument; sections are its moves. This catalog gives every section
type a job, an anatomy with budgets, layout variants, skip-rules, and failure
modes — so composition is a set of deliberate choices, not a template fill-in.
All content slots are filled by `landing-copywriter`; all token values come from
`landing-design-system`; every number/quote/logo shown must trace to a brand-kit
`proof` row.

## Contents

1. [The conviction sequence — ordering logic](#the-conviction-sequence)
2. [Rhythm rules](#rhythm-rules)
3. [Navigation](#navigation)
4. [Proof strip (logos)](#proof-strip)
5. [Product proof sections](#product-proof-sections)
6. [How it works](#how-it-works)
7. [Integrations](#integrations)
8. [Social proof](#social-proof)
9. [Metrics band](#metrics-band)
10. [Comparison](#comparison)
11. [Security & compliance strip](#security--compliance-strip)
12. [Pricing](#pricing)
13. [FAQ](#faq)
14. [Final CTA](#final-cta)
15. [Footer](#footer)
16. [Assembly recipes by business model](#assembly-recipes)
17. [QA walkthrough](#qa-walkthrough)

## The conviction sequence

Order sections by the objection they answer, in the order a skeptical visitor
raises them:

1. *"What is this?"* → hero (see `hero-patterns.md`)
2. *"Says who?"* → proof strip
3. *"Show me."* → flagship proof section
4. *"But does it handle my case?"* → supporting proof sections
5. *"How would it fit my workflow?"* → how it works / integrations
6. *"What do people like me think?"* → social proof
7. *"What does it cost?"* → pricing
8. *"What's the catch?"* → FAQ
9. *"Okay — where do I sign?"* → final CTA

Treat section order as a triage hypothesis: some visitors leave early while
others seek detailed evaluation material. Actual depth and conversion behavior
must come from first-party analytics and research. Two consequences:

- **Front-load the irreplaceable.** If only one proof section will be seen, it
  must be the flagship. Never open the proof run with the weakest capability
  "to build up" — most readers won't stay for the crescendo.
- **Never delegate a hero-critical answer downward.** If the audience's #1
  objection is price (e.g., replacing a free tool), a pricing signal belongs in
  the hero's CTA caption, not only in section 8.

Deviate from the canonical order only with a stated reason in the spec ("pricing
promoted above social proof because the kit's audience is price-anchored against
<competitor>"), so the deviation survives review.

## Rhythm rules

- **One idea per section** — the section's job should be statable in one sentence
  (that sentence goes in the spec). Two ideas = two sections, or one cut.
- **7–10 sections** for a full page; 4–6 for a focused campaign/launch page.
- **Vary density like music.** Sparse claim → dense proof → breath. If three
  consecutive sections have the same visual weight and the same split layout, the
  page has a metronome problem; break it at the flagship and before the close.
- **Background bands mark chapters (2–3 per page), not sections.** A band change
  says "new movement" — spend it on the transitions that matter: typically
  entering the deep-dive/how-it-works chapter and entering the close.
- **Section intros are a system**: eyebrow (≤4 words) + section heading (≤8
  words, h2) + optional one-line lead (≤20 words). Same geometry every time —
  the repetition is what makes the page feel composed.
- **CTA at chapter boundaries**: hero → after flagship proof → final CTA. Same
  verb, same destination, every time. Between chapters, the nav CTA carries.

## Navigation

**Job**: an always-available exit to the CTA; orientation second.

- ≤5 links + primary CTA at the right edge, styled as the same button system as
  the hero CTA but one size down. The CTA never goes inside a dropdown.
- Logo left (the kit's real asset), links center or left-adjacent, CTA right.
- Sticky nav is the default for long pages — it keeps the ask one glance away at
  every depth. Shrink on scroll (less padding, optional bg blur/surface) rather
  than hiding.
- Mega-menus are for multi-product companies; a single-product landing page with
  a mega-menu is advertising its own indecision.
- Mobile collapse rules live in `responsive.md` — the one law worth repeating:
  **the primary CTA stays outside the hamburger.**

**Failure modes**: nav links that outnumber reasons to stay; a "Login" styled as
loudly as the CTA; anchor links that hijack scroll with slow smooth-scrolling.

## Proof strip

**Job**: borrowed trust, immediately after the claim, before any feature talk.

- 4–8 logos, monochromed to a kit neutral, uniform optical size (normalize by
  visual mass, not bounding box), one row. Optional caption ≤8 words ("Trusted by
  teams at…" — phrasing per `landing-copywriter`).
- Every logo needs a kit `proof` row (permission/verification noted). No proof
  rows → **skip the section entirely**; a thin or faked logo row is worse than
  none. Pre-launch alternatives: a rating, an accelerator/backer chip (ledgered),
  or nothing.
- Variants: static row (default); two-row grid for 9–12 logos (enterprise pages);
  marquee/scroll only when logos exceed 10 and motion restraint is observed
  (slow, pausable, reduced-motion → static).

**Failure modes**: full-color logo soup fighting the CTA; 3 logos stretched to
fill a row (reads as exactly 3 customers); logos of companies where one person
once used a free tier (a lie with a source is still a lie — the ledger records
permission, not just existence).

## Product proof sections

**Job**: show, one capability at a time, that the hero's claim is true. These
sections are the body of the argument — typically 2–4 of them.

**Anatomy** (per section): section intro (eyebrow + h2 ≤8 words + optional lead
≤20 words) · one visual (staged UI per `hero-patterns.md` §staging, or a
motion-video loop with poster + reduced-motion still) · 0–3 supporting points
(each ≤15 words, icon or plain) · optional inline CTA after the flagship.

**Layout variants** — choose per section, and vary across the run:

- **Split media/text** (default): 50/50 or 60/40, text column ≤45ch. Alternate
  sides across consecutive sections *at most twice in a row* before breaking the
  pattern with a different variant.
- **Full-width showcase**: intro centered, visual full-container below — the
  flagship treatment; spend it once, maybe twice.
- **Bento grid**: one 2×-size flagship cell + 3–5 supporting cells, each cell one
  capability with a micro-visual. Dense, modern, scannable — good for "and it
  does all this too" mid-page compression; bad as the flagship (it fragments
  focus by design). Cells must share the intro system and one visual language.
- **Tabbed / segmented showcase**: 3–5 tabs swapping one large visual — compresses
  breadth without page length. Tab labels ≤3 words; first tab must be the
  strongest because the default state must communicate even if nobody changes tabs.
- **Sticky-scroll walkthrough**: visual pinned while step text scrolls past.
  High-craft when smooth, high-regret when janky; requires a flawless
  reduced-motion/mobile fallback (it becomes stacked steps). Use for genuinely
  sequential stories only.

**Escalation**: order the run so it ends on strength — flagship first (for the
half who see only one), second-strongest last (for readers who reach the end of
the chapter), connective capabilities between.

**Failure modes**: feature-grid-of-nine-icons instead of proof (icons assert,
screenshots demonstrate); body text repeating the visual's caption; a "capability"
that is actually two (split it); all sections the same variant at the same weight
(the metronome).

## How it works

**Job**: let the visitor rehearse adoption — collapse "this looks powerful" into
"I could be using this by Friday."

- 3–4 steps, numbered, each: label (≤4 words) + one line (≤15 words) + optional
  micro-visual. If it takes 5+ steps, the product has an onboarding problem the
  landing page can't fix — compress to the visitor-visible milestones.
- Developer products: step visuals are code. Real, runnable, syntax-highlighted
  in the kit's mono face, ≤12 lines per block, copy button. A fake code snippet
  is a claims violation like any fake stat.
- Skip when the product is self-evident (a to-do app doesn't need "how it works")
  — the section earns its place in proportion to perceived adoption cost.

**Failure modes**: steps that are marketing phases ("1. Sign up 2. Transform your
business"); code that wouldn't run; a diagram so abstract it could describe any
product.

## Integrations

**Job**: answer "does it work with my stack?" — a compatibility claim, shown.

- Logo grid or orbit of 8–24 integration marks, optionally grouped; one line of
  copy; link to a full directory if one exists. Integration logos are
  compatibility claims — ledger them like everything else.
- Skip when integrations aren't a real objection for the kit's audience.

## Social proof

**Job**: human voice after machine proof. Testimonials answer a different
question than screenshots — not "can it?" but "did it, for someone like me?"

**Placement**: after the proof run, before pricing — capability first, then
corroboration, then cost. (A single short quote may also appear earlier as a
pull-quote between proof sections — one, not a scatter.)

**Formats**, by strength of material in the kit:

- **Spotlight**: one substantial quote (≤40 words), full attribution (name, role,
  company, face if permitted), optionally paired with one outcome metric. The
  premium format — use when one genuinely strong quote exists. One spotlight
  beats six weak cards.
- **Wall/grid**: 3–9 shorter quotes (≤25 words each) in a masonry/grid. Use when
  breadth of roles/industries is itself the message.
- **Case tile**: logo + one metric + one line + link to the case study. The
  enterprise format; metrics make it — and every metric is ledgered.

**Rules**: full attribution or don't run it ("— Happy Customer" is an anti-proof);
edit quotes for length only, never for substance; the kit's `proof` rows carry
permission and source for each. No usable testimonials in the kit → skip the
section; never scaffold "placeholder testimonials" that risk shipping.

## Metrics band

**Job**: scale as proof — 3–4 large numbers (uptime, volume, customers, time
saved) in one quiet band.

- Number in display face at hero-adjacent scale, label ≤4 words beneath. 3–4
  stats, no more; each ledgered, each rounded conservatively (the ledger notes
  the rounding).
- Placement: after social proof, or fused into it. Skip entirely until the
  numbers are genuinely impressive *to the kit's audience* — "137 users" is
  honest and harmful; "namable-scale" is the bar.

## Comparison

**Job**: win the shortlist the visitor is already holding. Uses the kit's
`competitors` field — never invent the shortlist.

- **Table**: rows = decision criteria (5–8, chosen because the product wins them
  *and* the audience cares), columns = product + 1–3 named competitors. Product
  column visually elevated (band/border, not a circus).
- **Honesty discipline**: every checkmark is a claim — ledger anything
  non-obvious; concede a row where the competitor legitimately wins (one honest
  concession buys credibility for every other row); date-stamp the comparison in
  fine print, because competitor facts rot.
- **Switcher variant**: "Coming from <competitor>?" — a migration-focused strip
  (import path, what maps to what). Often stronger than a table when the
  audience is dominated by one incumbent's users.
- Skip when the product is category-creating (comparison would introduce
  competitors the visitor hadn't considered) — in that case the enemy is the
  status quo, and that comparison ("the old way / with <product>") is a proof
  section, not this table.

## Security & compliance strip

**Job**: clear the procurement gate for B2B audiences.

- One quiet band: certification badges (only ones actually held — ledgered, with
  audit dates), 1 line on data handling, link to a trust page. Badges are
  claims; an aspirational SOC 2 badge is fraud, not optimism.
- Placement: near pricing or the footer — it answers a late-stage objection.
  Skip for consumer products where it would introduce anxiety rather than
  resolve it.

## Pricing

**Job**: turn interest into a decision. For self-serve products this section
does the closing; give it the same design attention as the hero.

**Anatomy**: section intro · billing toggle (annual/monthly — annual default,
discount stated and ledgered) · 2–4 tier cards · fine-print reassurance line ·
(enterprise) "Talk to us" as the last card or a strip below.

**Tier card**: name (≤2 words) · price (display face, big; the "/mo" and billing
condition legible, never hidden) · one-line who-it's-for (≤12 words) · 5–8
feature lines (differences only — shared features collapse to "Everything in
<lower tier>, plus…") · CTA per tier: the kit's verb on self-serve tiers, "Talk
to sales" only on enterprise.

**Structural rules**:

- **2–4 tiers.** Beyond 4, choice paralysis wins; a comparison table below the
  cards absorbs the detail overflow for complex products.
- **Anchor deliberately**: highlight exactly one recommended tier (band, border,
  "Most popular" chip — one device, not three); order cheap→expensive
  left-to-right; an enterprise column anchors the recommended tier as reasonable.
- **Free tier / trial**: state its true limits plainly — an over-generous-looking
  free tier attracts the wrong users and the right users' distrust equally.
- **Sales-led products**: don't fake tier cards with three "Contact us" columns.
  Run a value-framing band (what an engagement includes) + one demo CTA, and let
  the FAQ handle "how is it priced?" honestly.
- Every discount percentage, comparison figure, and "save $X" is a claim →
  ledger.

**Failure modes**: hidden billing conditions (the classic dark pattern — and a
credibility hit when noticed); 5+ tiers; all tiers highlighted; feature lists so
symmetrical the tiers seem identical; pricing FAQ contradicting the cards.

## FAQ

**Job**: objection handling in the visitor's own voice — the last mile of
conviction for the most-skeptical, highest-intent readers.

- **5–8 questions**, each a real objection phrased as the visitor would ask it
  ("What happens to my data if I cancel?"), not marketing setups ("Why is
  <product> so amazing?"). Source them from the kit's audience knowledge, sales
  objections, and the named competitors ("How is this different from <X>?" is
  almost always question #1 or #2).
- **Answers ≤80 words**, honest, specific, first sentence self-sufficient.
  Written by `landing-copywriter`; designed here.
- **Layout**: single column accordion, measure ≤70ch, first item optionally
  expanded. **Answers must be real text in the DOM** — rendered, not fetched on
  click — because `aeo-audit` and `seo-audit` depend on machine-readable Q&A
  (FAQ structured-data markup is their call to make; this spec's job is to leave
  them real text to mark up).
- Placement: after pricing (it mops up pricing objections), before the final CTA.

**Failure modes**: softball questions; ten-line answers (that's a docs page);
an FAQ that contradicts pricing or hero claims (reviewers check).

## Final CTA

**Job**: the close. The visitor who reached here is the most convinced person on
the page — give them a calm, unmissable door.

- **Anatomy**: restated claim (≤8 words — echo, don't repeat, the hero; the
  echo is what makes the page feel composed) · optional one reassurance line
  (≤12 words, ledgered if it contains a claim) · the kit's CTA, largest button
  on the page · nothing else. No link lists, no "or read our blog."
- **Design**: its own band — the calmest, highest-contrast moment on the page
  (mirror of a film's end card): often the inverse polarity of the page or the
  accent at full commitment. Generous padding above and below; the surrounding
  whitespace *is* the design.
- **One verb.** The same verb and destination as the hero and nav. If a
  secondary audience truly needs a different door (e.g., "or talk to sales"), it
  appears as one quiet text link below the button — never a second button.

## Footer

**Job**: utility, long-tail navigation, legal, and residual trust — after the
argument is complete. The footer is not a section of the argument; nothing
load-bearing may live only here.

- Columns of links (product, company, resources, legal), the wordmark, social,
  optional compliance badges, optional newsletter capture (quiet — it must not
  compete with the page's one CTA).
- A one-line brand restatement above the columns is the premium touch; keep it
  ≤10 words.

## Assembly recipes

Three worked spines — adapt, don't transplant:

**Self-serve / product-led SaaS** (the Acme case — full spec in `SKILL.md`):
Nav → Hero (archetype 1 or 2) → Proof strip → Flagship proof → Proof ×2 → How it
works → Social proof → Pricing → FAQ → Final CTA → Footer. ~10 sections; CTA
"start/try" carried throughout.

**Sales-led / enterprise**: Nav → Hero (archetype 2 or 3; CTA "Book a demo") →
Proof strip (enterprise logos) → Flagship proof → Proof ×2 → Case tiles + metrics
band → Security & compliance → Comparison or switcher (if a named incumbent
dominates) → Value-framing band + demo CTA → FAQ → Final CTA → Footer. Pricing
cards omitted honestly.

**Developer tool**: Nav → Hero (archetype 1 or 4; secondary CTA = docs) → Proof
strip → Quickstart as flagship (real code, ≤12 lines, copy button) → Proof ×2 →
Integrations → Social proof (dev-voice quotes) → Pricing (generous free tier
stated plainly) → FAQ → Final CTA → Footer. Mono face earns its kit slot here.

## QA walkthrough

The runnable version of SKILL.md's gate. Walk the page three times:

**Pass 1 — cold, 5 seconds** (fresh eyes or honestly simulated): hero only.
What is it? Who's it for? What do you click? Any hesitation → hero rework, not
page rework.

**Pass 2 — scroll-through, desktop, squinting**: stop at every viewport-sized
step. One focal point each? Any dead viewport (all whitespace, no idea)? Any
two-idea section? Does density vary, or is it a metronome? Do band changes land
at chapter boundaries? Is a CTA visible or one glance away at every stop?

**Pass 3 — 390px, slowly, reading everything**: full argument intact? Stack
order sensible (text before visual, flagship cells first)? Nothing hover-only?
Tap targets comfortable? (Full mobile matrix: `responsive.md`.)

**Then audit mechanically**:
- CTA count and consistency (one verb, one destination; nav + hero + mid + close).
- Clear page-topic heading and logical section outline; FAQ answers in the DOM.
- Claims sweep: every number, quote, logo, badge, checkmark → kit `proof` row.
- Brand sweep: any color/face/asset not from the kit is a portability bug.
- Section census: count ideas, not sections — every section states its one job.
