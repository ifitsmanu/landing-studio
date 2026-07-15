# Proof & Objections — the middle of the page

The hero earns attention; the middle earns belief. Everything here serves two
beliefs: "it works" (belief 3–4) and "clicking is low-risk" (belief 5). The
governing discipline is that **proof is spent, not sprayed** — each proof
element is placed where a specific doubt arises, and every one traces to a
source.

## Contents

1. [The proof hierarchy](#the-proof-hierarchy)
2. [The claims ledger](#the-claims-ledger)
3. [Numbers](#numbers)
4. [Testimonials](#testimonials)
5. [Logo walls](#logo-walls)
6. [The objection map](#the-objection-map)
7. [Pricing copy](#pricing-copy)
8. [FAQ craft](#faq-craft)
9. [Competitors on the page](#competitors-on-the-page)

## The proof hierarchy

Strongest to weakest. Spend from the top; a page leaning on the bottom rungs
has a proof problem no copy can fix.

| Rank | Instrument | Why it ranks here |
|---|---|---|
| 1 | **The product, shown doing the thing** (screenshot/recording + caption) | Unfalsifiable by the reader; nothing to take on faith |
| 2 | **Customer-sourced numbers** ("cut reporting time 60% at <named customer>") | Specific, attributable, checkable |
| 3 | **Named, attributed testimonial** (name, role, company) | A human staked reputation on it |
| 4 | **Aggregate numbers** ("400 teams", "2M queries/month") | Real but anonymous; softer |
| 5 | **Logo wall** | Implies endorsement without a sentence of it |
| 6 | **Self-claims** ("blazing fast", "enterprise-grade") | The reader's discount rate on these is near 100%; usually deletable |

Corollary: when a self-claim appears in a draft, look one rung up — there is
almost always a screenshot, number, or quote that could carry the same point.
Replace, don't decorate.

## The claims ledger

Every number, quote, customer name, and logo that appears **on the page**
gets a row *before* it appears in the copy deck. No row, no claim. This is
the mechanical enforcement of the honesty contract, and it is seeded directly
from the brand kit's `proof` list — the skill itself whitelists nothing.

```markdown
| # | On-page text                     | Source (doc/link/owner)   | Verified by | Date       | Notes                     |
|---|----------------------------------|---------------------------|-------------|------------|---------------------------|
| 1 | "Median time to answer: 11s"     | metrics/q2-latency.md     | <user>      | YYYY-MM-DD | p50, prod, 30-day window  |
| 2 | Quote — J. Rivera, Ops @ <co>    | email thread 2026-04-18   | <user>      | YYYY-MM-DD | approved verbatim         |
| 3 | "400+ teams"                     | CRM export 2026-05        | <user>      | YYYY-MM-DD | 412, rounded down         |
```

Rules: the *user* supplies sources; rounding is conservative and noted;
permission to use names/logos is itself a ledger fact; the ledger ships with
the copy deck so future edits inherit the discipline.

## Numbers

- **Use the precision the evidence supports.** A specific number can be more
  informative than a vague phrase, but false precision reduces trust. Record
  measurement context and round conservatively when the exact value will date.
- **Comparatives need a baseline.** "60% faster" than *what*, measured *how*?
  The baseline goes in the ledger; a compressed version ("vs. their previous
  BI stack") can ride the page as a footnote or caption.
- **One number per sentence.** Two numbers compete; the reader retains
  neither.
- **Numbers in headers and captions, not buried in body.** A skimmer should
  hit every load-bearing number.
- **Superlatives are numbers in disguise.** "Fastest", "first", "only"
  require a defensible ledger basis or they come out — this is also legal
  hygiene in most jurisdictions.

## Testimonials

- **Select for relevance, not volume.** Prefer a quote that names a sourced,
  audience-relevant outcome over a wall of generic praise. Validate placement
  and response rather than claiming a universal lift.
- **Full attribution or don't run it.** Name, role, company (photo helps —
  design's call). "— Happy Customer" reads as fabricated even when real.
- **Edit only for length, with permission, and mark elisions (…).** Never
  reorder meaning. The ledger row records the approved final text.
- **Match the quote to the section.** A security-themed quote belongs beside
  the security objection, not in a generic wall — proof is spent where the
  doubt arises.
- **Pull-quote budget: ≤ 35 words.** Longer quotes get a pull-quote of the
  sharpest sentence with the rest available (design decides the disclosure).
- Never fabricate, "compose from feedback themes", or anonymize-then-embellish.
  A weak true quote beats a strong invented one every time it matters.

## Logo walls

- Run a logo wall only when the kit confirms permission per logo (a ledger
  row each).
- 5–8 logos; past that it reads as a directory. Recognizable-to-the-ICP beats
  big-but-irrelevant — the kit's `audience` field decides recognizability.
- Caption the wall with a sourced, useful claim rather than an empty label such
  as "Trusted by."
- No logos yet? Skip the pattern entirely. An empty-feeling wall or —
  worse — padding with tools the product merely *integrates with* (dressed
  as customers) reads as the lie it is. Early-stage proof lives in ranks 1–2
  instead: show the product working.

## The objection map

Objections are derived from the kit's `audience` field — who they are, what
they already use, what switching costs them. Do not import a generic list;
*derive*, then check coverage against the recurring classes:

| Objection class | The reader's inner sentence | Where to answer |
|---|---|---|
| **Trust / security** | "Is my data safe with these people?" | Inline near the CTA (badge/line) + FAQ detail |
| **Capability doubt** | "It'll break on *my* messy case" | Product section — show the hard case, not the demo case |
| **Switching cost** | "Migrating will eat a quarter" | FAQ + a time-to-value number if the ledger has one |
| **Price** | "This will be expensive" | Pricing section or FAQ; plain, no games ([Pricing copy](#pricing-copy)) |
| **Time-to-value** | "How long until this pays off?" | Hero microcopy ("in minutes") *only* if ledger-true; else product section |
| **Legitimacy** | "Is this real or a demo-ware landing page?" | Ranks 1–3 proof; real screenshots with real-looking (clearly synthetic) data |
| **"Do I need this?"** | "My current workflow limps along fine" | The problem/turn section — name the cost of the status quo |

Placement rule: **high-frequency objections get answered inline** (a line of
microcopy under the CTA, a security badge row, a caption); long-tail
objections go to the FAQ. An objection answered two scrolls after it arises
was answered too late.

## Pricing copy

Most decks hand pricing to a table and stop writing — which abandons the
page's highest-doubt moment to its least-written section. The register goes
plainest here (see voice.md's tone table: cleverness near money reads as
misdirection), and every string follows the same craft:

- **Plan names describe the buyer, not a flattery ladder.** "Free / Team /
  Enterprise" lets readers find themselves by team shape; "Basic / Premium /
  Ultimate" makes them price their self-image. Name each plan something the
  ICP can say out loud without wincing — "we're on the Team plan" is a fact;
  "we're on Basic" is a demotion.
- **Inclusion framing beats exclusion framing.** Lead with what every plan
  includes, then name the one dimension that scales: "Every plan includes
  every feature; pricing scales with seats" (Acme's FAQ-3-A). A grid of
  grayed-out ✕ marks sells the gaps, not the product. When features do gate,
  gate on a dimension the reader accepts as fair (seats, volume, compliance
  needs) and say so plainly — features scattered across tiers to force
  upgrades read as exactly that.
- **The "talk to sales" tier is a real tier, not a dead end.** Give the
  enterprise column real information: what is actually different (SSO, audit
  logs, custom terms — kit-verified like any claim) and what the click does
  ("book a 30-minute call" → a calendar, per cta-copy.md's scent-trail rule).
  A contact-us column with no content reads as "we price by how rich you
  look."
- **Per-seat vs usage, in words.** Per-seat: state the unit and the period
  together ("per editor, per month, billed annually") — never make the reader
  do billing math. Usage: name the unit in the product's own noun ("per
  1,000 queries", not "per credit") and answer the overage flinch in the same
  breath ("you're alerted before you hit the cap" — only if kit-true). The
  objection under both models is predictability; the copy's job is to make
  next month's bill imaginable.
- **Every price-adjacent string is a ledger claim.** The price itself, the
  trial length, "no hidden fees", "cancel anytime" — rows, all of them,
  checked like the numbers they are.

## FAQ craft

The FAQ is the conversion tool for the full-read visitor — the one who is one
unanswered question from clicking — and, as a side effect, the page's most
answer-engine-extractable section (aeo-audit will audit it; write it right
the first time).

- **Real questions, phrased as the reader asks them.** Source from the kit,
  sales calls, or support logs — "Can I still write SQL when I need to?" not
  "What about advanced querying capabilities?"
- **First sentence answers directly.** "Yes — every answer comes with the SQL
  it ran, and you can edit it." Explanation follows the answer, never
  precedes it.
- **4–8 questions.** More means the page above failed to land its beliefs;
  fold the overflow back into sections or cut it.
- **No softballs.** "How amazing is Acme?" -style plants destroy the trust
  the section exists to build. Include the uncomfortable question (pricing,
  lock-in, limits) — answering it plainly is the single strongest trust move
  available to the page.
- **End the section with the CTA echo** — the reader who reached the FAQ's
  end is the warmest reader on the page.

## Competitors on the page

The kit names competitors so the copy can *position*, not so the page can
attack.

- **Default: position without naming.** The outcome-contrast headline
  ("Answers, not dashboards") does the work implicitly; the named-competitor
  test happens in QA, not on the page.
- **Name competitors only in a dedicated comparison section/page**, and only
  when the kit's audience is actively comparison-shopping (high-intent SEO
  terms like "<competitor> alternative" — coordinate with seo-audit).
- **Comparison honesty:** every row of a comparison table is a ledger claim
  about *someone else's* product — verify against their current public
  materials, date the verification, and concede the rows they win. A table
  the competitor could screenshot and debunk is a liability, and a concession
  is itself rank-3 proof of honesty.
- Never punch down, never mock, never use a competitor's trademark in the
  hero. Confidence is the register; contempt reads as insecurity.
