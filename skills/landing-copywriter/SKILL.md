---
name: landing-copywriter
description: >-
  Write conversion copy for landing pages — headlines, subheads, value
  propositions, proof sections, objection handling, CTA ladders, and microcopy —
  in the modern software idiom (OpenAI, Anthropic, Stripe, Linear, Vercel, Apple,
  Framer, Raycast). Use whenever the user says "write the landing page copy",
  "headline for our site", "hero copy", "value proposition", "our homepage copy
  feels generic", "make this page convert", "CTA copy", "button copy",
  "microcopy", "rewrite our homepage", "product messaging for the site", or wants
  the words for any page whose job is a click. Works for ANY brand and product:
  it takes a brand kit as input (name, one-liner, ICP, voice, one primary CTA,
  sourced claims, competitors) and hardcodes nothing. This is conversion
  COPYWRITING — message hierarchy, word-count discipline, sourced proof, one
  designed ask — NOT visual design (landing-page-design), NOT the design system
  (landing-design-system), NOT video scripts (motion-video), and NOT blog or
  campaign content (marketing-campaign).
---

# Landing Copywriter

Turn any product plus a supplied brand kit into a complete landing-page copy
deck: a headline that stops the scan, a message hierarchy that survives a reader
who might leave at any second, proof that traces to real sources, and exactly
one ask — designed, echoed, and answered.

Three things are load-bearing and everything else serves them: **attention**
(the page must convert readers who give it five seconds, thirty seconds, or
three minutes — each depth is a separate product), **the CTA** (one verb, one
destination; the entire page is an argument for one click), and **truth**
(every number, quote, and promise traces to a source in the brand kit).
Running through all three is the craft bar the reference canon sets: **every
sentence must survive being read aloud to a customer's face** — the page's
analog of a film in which every paused frame is a poster. Quality is not a
fourth pillar to weigh against the other three; it is the standard the other
three are executed to.

## What this writes — and what it is not

The genre: the words on a modern software landing page — hero headline and
subhead, section headers that carry the skim, capability copy, testimonials
and metrics, FAQ and objection copy, button labels, and the microcopy around
forms and risk. The reference canon is how the best software companies sell on
a page: Stripe's plain category claims, Linear's craft-signaling declaratives,
Apple's compression, Vercel's developer-verb directness, Anthropic's sober
precision, Raycast's product-as-proof captions. The idiom is analyzed
pattern-by-pattern in `references/headline-patterns.md` and
`references/voice.md`, and quoted line-by-line — real heroes, real headers,
annotated — in `references/canon-teardowns.md`.

Boundaries — hold them firmly, and route by name:

- **Not page composition.** Which sections exist, their order, and their visual
  hierarchy belong to **landing-page-design**. This skill writes words *into*
  that section plan; when no plan exists yet, write against the canonical
  section spine below and flag it for landing-page-design to confirm.
- **Not the design system.** Type scale, tokens, and components are
  **landing-design-system**. Copy respects its constraints (a headline must fit
  the display scale) but never defines them.
- **Not video.** Launch films, hero loops, and cutdowns — including their
  scripts — are **motion-video**, already built. Never re-implement it; hand it
  the same brand kit.
- **Not search/answer-engine work.** Keyword strategy, metadata, and structured
  data are **seo-audit**; answer-extraction formatting is **aeo-audit**;
  generative-engine visibility is **geo-audit**. Write for the human first,
  then let those audits review — though the FAQ rules here (direct first-
  sentence answers) are deliberately AEO-friendly.
- **Not a campaign.** Ads, emails, and launch sequencing are
  **marketing-campaign**. One page's copy deck, not an editorial calendar.
- **landing-page-build** is the orchestrator that sequences all of the above;
  when the request is "build the whole page", start there.

Deliverable: a **copy deck** — every string on the page, labeled by slot and in
page order, with word counts, the claims ledger, and handoff notes.

## Step 0 — Collect the brand kit

Nothing in this skill carries a brand. Every name, claim, sentence of voice,
and CTA arrives through the packet's shared **brand kit** — one kit, collected
once, read by every landing-studio skill (motion-video included). This reads the
packet's canonical `brand-kit.md` (see the packet root template) — it is the same
file every landing-studio skill reads, organized in six canonical sections
(1 Brand · 2 Product · 3 Voice · 4 Proof & Claims · 5 CTA · 6 System). The fuller
intake schema and field definitions live in **landing-page-build**'s
`../landing-page-build/references/brand-kit.md`; read them there rather than re-declaring them, so the
contract can't fork across the packet. Running standalone — no orchestrator, no
kit file yet — collect the same fields directly from the user. The
copy-critical canonical paths are `brand.name`, `product.one_liner`,
`product.audience`, `product.ui_material`, `voice`, `cta`, `proof`,
`competitors`, `research.customer_language_sources`, and `constraints`. Do not
declare a local alternate schema.

The kit also carries colors, type, logo, and assets — design's domain. Copy
touches those only as constraints: confirm with landing-design-system how many
display-size words a hero headline can hold before writing ten of them.

Rules of engagement:

- When a field is missing, **ask** — batched, not dripped. Never invent an
  audience, a stat, a testimonial, or a CTA; guessing a CTA invents strategy.
- **Keep one visually primary CTA by default.** A subordinate secondary route
  is valid when the buying journey requires it. Treat the hierarchy as a
  hypothesis to verify, not a universal numerical law.
- **Every claim needs a source row.** The kit's `proof` list seeds the claims
  ledger (`references/proof-and-objections.md`). No row, no number on the page.
- **Defer-to-project rule:** if the project ships a brand-voice skill, a
  design-system file, or a tone document, defer to it for vocabulary, register,
  and any brand gates — those outrank this skill's defaults wherever they
  overlap. But never *require* one: the built-in register in
  `references/voice.md` must carry a project that has nothing. On conflict,
  surface it and let the user decide.
- A total rebrand of the copy deck must be achievable by swapping the kit
  alone. If you catch yourself typing a brand fact into a template, stop and
  parameterize it.

## The spine: three read depths, one belief chain

A landing page is not read; it is *scanned, then sampled, then — rarely —
read*. Write for all three depths deliberately, because each one converts a
different reader:

| Depth | What gets read | Share of the persuasion budget |
|---|---|---|
| **5-second read** | Headline, subhead, primary button, first image | Most of it. If this fails, nothing below exists. |
| **30-second skim** | Section headers, button labels, bolded leads, captions | The skim path must be a *complete argument on its own*. |
| **Full read** | Body copy, FAQ, testimonials | Exists to close the reader who is one objection from clicking. |

Before writing a word of copy, write the **belief chain** — the ordered list
of things the reader must come to believe to click the CTA. This is the
approval unit; nothing proceeds until the user signs off on it. The canonical
chain, which maps one-to-one onto the page's sections:

| # | Belief | Section that lands it | Copy job |
|---|---|---|---|
| 1 | "This is for someone like me" | **Hero** (headline + subhead) | Name the reader's world in their words |
| 2 | "I understand what it is" | **Hero** (subhead) + first product section | Category + mechanism, zero abstraction |
| 2.5 *(optional)* | "The status quo is costing me" | **Problem / turn** | Name the cost of today, in the reader's own terms — never perform the pain |
| 3 | "I believe it works" | **Product / capabilities** | Show, then say: screenshot carries the claim, copy points at it |
| 4 | "It works for people like me" | **Proof** (testimonials, metrics, logos) | Sourced, specific, attributed |
| 5 | "Clicking is low-risk" | **Objections / pricing / FAQ** | Answer the real objections, plainly |
| 6 | "Now, not later" | **Final CTA** | Restate the value prop; same verb, same destination |

Why this shape: readers bail in order — they leave because the page isn't for
them before they leave because they doubt it, and they doubt it before they
worry about price. Sequence the copy to answer objections in the order they
arise, and a reader who bails at *any* scroll depth still leaves knowing what
the product is and what the ask was.

Belief 2.5 is the chain's one optional link. Add a problem/turn section when
the ICP *tolerates* the status quo rather than resents it — the "do I need
this?" objection in `references/proof-and-objections.md` — and its copy job
is one or two dry sentences that name what today actually costs, then pivot.
Skip it when the pain is already vivid: a page performing pain the reader
doesn't feel reads as manipulation. When present, its header joins the skim
chain like any other, and its tone row lives in `references/voice.md`.

## Copy-fit defaults (verify in the approved design)

- **Keep the headline as short as the precise claim allows.** Start with the
  approved slot budget, then test the actual type, viewport, localization, and
  comprehension. Move supporting clauses to the subhead when clarity improves;
  do not cut a necessary qualifier to hit a universal word count. Patterns,
  budgets, and the anti-pattern list:
  `references/headline-patterns.md`.
- **Word budgets are coordinated design constraints.** Use the approved slot
  budgets, test realistic long/short and localized content, and resolve overflow
  with design and copy together. Never shrink type below accessibility/readability
  requirements to preserve an arbitrary count.
- **Headers must chain.** Read only the section headers plus the button label,
  top to bottom: that sequence must state the full argument. If a header is a
  label ("Features") instead of a claim ("Ask in English, get an answer"), the
  skim path has a hole in it.
- **One belief per section, one idea per sentence.** A section trying to land
  two beliefs lands neither; split it (and tell landing-page-design why).
- **Front-load every unit.** First word of the headline, first sentence of
  every block, first line of every FAQ answer does the work — scanners read
  beginnings. Cut the warm-up sentence; it is always cuttable.
- **The page must survive a bail at any scroll depth.** After the hero, every
  section is optional to someone. No section may be a load-bearing setup for a
  payoff two sections later.

## CTA laws (condensed — depth in references/cta-copy.md)

- **One visually primary CTA by default**: one imperative verb + one destination,
  straight from the kit, with message-matched wording at every placement. Equal
  competing asks can obscure hierarchy; validate exceptions from the actual journey.
- **The CTA ladder, not a fork.** A secondary CTA is allowed only as a
  *lower-commitment step on the same path* — "See how it works" (scroll or
  demo) beneath "Start free", or "Read the docs" for developer audiences —
  visually and verbally subordinate, never a second destination of equal
  weight. If the kit implies two audiences with two asks, that is two pages;
  say so.
- **Write the button before the page.** The button label is the page's thesis
  statement; every section either argues for that click or gets cut.
- **Placement rhythm:** hero, an echo after the strongest proof (peak
  conviction), and the final section. Same verb every time — an echo, not a
  new ask.
- **De-risk in microcopy, not in the verb.** "Start free" stays two words; "No
  credit card required · Free `<trial-length>`-day trial" lives beneath it —
  every value filled from the kit, and only if the kit confirms every word is
  true.
- **Honor the scent trail.** The button's verb must match what the destination
  actually does. "Start free" → a signup that is free. A mismatch burns the
  trust the page just built; flag it rather than paper over it.

## Value proposition — the one sentence

The value proposition is belief 1 + 2 in a single sentence: **who it's for +
what it is + the outcome + why this one**. Draft it before the headline (the
headline is usually a compression of it) and test it two ways:

- **Competitor-swap test:** replace the brand name with each named competitor
  from the kit. If the sentence still reads true, it isn't a value proposition
  yet — it's a category description. Sharpen the differentiator.
- **Bar test:** say it aloud to an imagined member of the ICP. If it would
  earn "wait, how?" you have a hook; if it would earn a polite nod, cut the
  abstraction and add the mechanism.

## Proof & objections (condensed — depth in references/proof-and-objections.md)

- **The proof hierarchy**, strongest first: the product shown doing the thing
  → customer-sourced numbers → named, attributed testimonials → logo walls →
  self-claims. Spend proof from the top; a self-claim ("blazing fast") is the
  weakest instrument on the page and usually deletable.
- **The claims ledger is mechanical honesty.** Every on-page number, quote,
  customer name, and logo gets a ledger row (claim → source → owner → date)
  before it appears in the deck. The user supplies sources; the skill
  whitelists no stat.
- **Map objections from the ICP, not from imagination.** The kit's `audience`
  field implies the objection set — price, trust/security, switching cost,
  "will it work for my case", time-to-value. Answer high-frequency objections
  inline near the CTA; long-tail ones in the FAQ.
- **FAQ answers lead with the answer.** First sentence answers the question
  directly; explanation follows. This is better for the skimming human and,
  as a side effect, exactly what aeo-audit will ask for.

## Microcopy — where trust is won

Microcopy is every string that isn't a headline or body block: button subtext,
form labels and placeholders, error and success states, eyebrow labels, image
captions and alt text, nav items, the footer ask. It converts (or leaks) at
the exact moment of commitment, so it gets a dedicated pass, not leftovers:

- **Every microcopy line must be literally true.** "No credit card required"
  is a legal statement, not a vibe. Verify against the kit.
- **Errors say what happened and what to do next**, in the brand's voice —
  the error state is the one moment the reader is guaranteed to be reading.
- **Placeholders never replace labels** (accessibility; coordinate with
  landing-design-system) and never waste the slot ("Enter your email…" says
  nothing; "you@company.com" sets the expected format).
- **Captions carry claims.** A screenshot's caption is prime skim real estate:
  state what the reader is looking at as a benefit, ≤ 12 words.
- Full slot-by-slot rules live in `references/cta-copy.md` (form + button
  microcopy) and the worked example.

## Pipeline — five stages, each emitting a reviewable artifact

1. **KIT** — collect/confirm the brand kit; batch the questions for anything
   missing. Seed the claims ledger from `proof`.
2. **MESSAGE MAP** — the belief chain mapped to the page's sections (use
   landing-page-design's section plan if one exists), with each section's one
   belief and word budget. *This is the approval unit* — cheap to change here,
   expensive after design has built around the copy.
3. **COPY DECK** — every string, labeled by slot (`H1`, `SUB`, `CTA-P`,
   `CTA-S`, `EYEBROW-n`, `HDR-n`, `BODY-n`, `QUOTE-n`, `CAP-n`, `FAQ-n`…),
   in page order, with word counts against budget. Headline candidates come
   in a ranked set of 3–5 with the pattern each uses named
   (`references/headline-patterns.md`).
4. **MICROCOPY PASS** — buttons, forms, errors, captions, alt text, footer.
5. **QA GATE** — the checklist below; then handoff notes to
   landing-page-design / landing-page-build (which strings are fixed, which
   may reflow, where copy length constrains layout).

## Craft digest — ten rules

1. **Write the button before the page** — one verb, one destination; every
   section argues for that click or gets cut.
2. **Specific beats clever.** "Answers in plain English" outsells wordplay;
   cleverness is allowed only after clarity is already paid for.
3. **The skim is the page** — headers alone must chain into the complete
   argument.
4. **Show, then say** — point copy at the screenshot; let the product carry
   the claim and the sentence merely name it.
5. **One belief per section, one idea per sentence.**
6. **Cut the warm-up** — the first sentence of a first draft is usually the
   second draft's first deletion.
7. **Verbs from the product's world**, not marketing's: readers trust "query,
   flag, ship, deploy" and discount "empower, unlock, elevate"
   (`references/voice.md` has the blacklist and the why).
8. **Every number has a ledger row** — no row, no number.
9. **Read it aloud.** If you wouldn't say the sentence to a customer's face,
   it doesn't ship.
10. **Competitor-swap everything important.** Headline, value prop, section
    headers: if a named competitor could run it unchanged, it isn't yours yet.

## Honesty contract

Conversion copy is the easiest place on the internet to lie fluently, and
polish amplifies whatever it wraps. The discipline is mechanical:

- Every number, quote, customer name, and logo traces to a claims-ledger row
  sourced by the user. Round conservatively and note the rounding.
- Never fabricate testimonials, edit quotes beyond length (and only with
  permission), or imply endorsement a logo owner didn't give.
- Risk-reversal microcopy ("cancel anytime", "no credit card") is checked as
  a factual claim, not copy.
- Superlatives ("fastest", "first", "only") require a defensible basis in the
  ledger or they come out.
- If the honest version of a claim is weaker, ship the honest version — a
  page that overpromises converts once and churns forever.

## QA gate & definition of done

Built-in and self-contained. If the project has its own brand-voice or review
skill, run it *in addition* — never require one. Run every check empirically:

- **5-second test** — show a stranger (or role-play one honestly) the hero
  alone: can they say what it is, who it's for, and what to click?
- **Skim test** — read only headers + button labels top to bottom: complete
  argument, no holes, no label-headers.
- **Competitor-swap test** — headline and value prop, against every named
  competitor in the kit.
- **One-CTA audit** — count the destinations on the page. The answer is one
  (plus a subordinate same-path secondary at most).
- **Scent-trail check** — every button verb matches its destination's actual
  behavior.
- **Claims traceability** — every number/quote/name/logo maps to a ledger row.
- **Slop scan** — grep the deck against the blacklist in
  `references/voice.md`; each hit is replaced with the specific thing it was
  hiding.
- **Budget check** — every slot within its word budget; overages are cut, not
  excused.
- **Read-aloud pass** — full deck, out loud, in one sitting; mark every
  sentence you stumbled on or wouldn't say to a customer.
- **Voice conformance** — against the kit's voice field or the defer target.

**Done =** message map approved + copy deck complete with ledger + all gate
checks pass + handoff notes delivered. Attention, the CTA, and truth are
*verified*, not asserted.

## Worked example — Acme, an analytics SaaS

A compressed end-to-end run on a generic product (the full copy deck, ledger,
and QA pass live in `references/acme-example.md`):

- **Kit**: Acme — "answers questions about your data in plain English"; ICP =
  heads of ops/data at 20–500-person SaaS companies who own reporting but
  aren't analysts; CTA = **Start free → https://acme.com/signup**; proof = three
  sourced claims (median time-to-answer, a named customer quote, seat count);
  competitors = Dashly (dashboard suite), QueryCo (SQL notebook); voice =
  plain, confident, no exclamation points.
- **Belief chain → sections**: hero lands 1+2; a three-block product section
  lands 3 (ask → answer, auto-flagged anomaly, one-click shared report — each
  block ≤ 40 words, captioned screenshots doing the proving); proof section
  lands 4 (the sourced quote + the sourced metric); a four-question FAQ lands
  5 (data security, SQL escape hatch, pricing, migration); final CTA lands 6.
- **Hero**: H1 `Answers, not dashboards.` (3 words — outcome-contrast
  pattern); SUB `Ask questions about your data in plain English. Acme answers
  in seconds — no SQL, no dashboard hunting.` (17 words); CTA-P `Start free`;
  CTA-S `See how it works` (anchor to the product section — same path, lower
  commitment); button microcopy `Free 14 days · No credit card` (both facts
  kit-verified).
- **Skim test**: *Answers, not dashboards. → Ask anything, in English. →
  Anomalies flag themselves. → Share the answer, not the query. → Teams like
  yours already switched. → Questions, answered. → Two minutes to your first
  answer. → Start free.* — eight links, each a labeled deck slot (H1 →
  HDR-1…3 → HDR-4 → HDR-FAQ → HDR-5 → CTA-F); the headers alone carry the
  argument.
- **QA**: competitor-swap fails Dashly and QueryCo on the H1 (neither can
  claim *answers over dashboards* — one sells dashboards, one sells SQL);
  every number in the deck maps to the three-row ledger; slop scan clean.

## Reference index

Read SKILL.md first; open a reference when its trigger applies.

| File | Read this when… |
|---|---|
| `references/headline-patterns.md` | Writing or fixing the hero — word budgets, the pattern library, subhead and section-header patterns, the anti-pattern list. |
| `references/canon-teardowns.md` | You want the idiom in your ear before drafting — real, quoted hero + header lines from the canon (Stripe, Linear, Vercel, Apple, OpenAI, Anthropic, Framer, Raycast), each tagged with its pattern and why it works. |
| `references/proof-and-objections.md` | Building the middle of the page — the proof hierarchy, claims ledger, testimonial and metric rules, the objection map, pricing copy, FAQ craft. |
| `references/cta-copy.md` | Designing the ask — the one-CTA rule, the ladder, verb taxonomy by traffic temperature, button/form microcopy, scent trail, measurement. |
| `references/voice.md` | Choosing register and vocabulary — the default voice, the defer rule, the slop blacklist with reasoning, tone by section, read-aloud QA. |
| `references/acme-example.md` | You want the finished artifact in your ear — Acme's full kit, message map, complete copy deck with every microcopy string, ledger, and QA results. |
