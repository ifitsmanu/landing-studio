# The Audit Runbook — from question set to Search Console

SKILL.md defines *what* the audit checks; this file is *how a run proceeds* —
the worksheet formats, the SERP diagnosis that turns assumptions into evidence,
the standard every finding must meet before it ships, and the post-ship
measurement loop that proves extraction, attribution, and the click actually
happened. Craft depth stays where it lives: span writing in
`answer-formatting.md`, markup in `structured-data.md`. This file owns the
process that strings them together.

## Contents

1. [Working order](#working-order)
2. [The question-set worksheet](#the-question-set-worksheet)
3. [SERP diagnosis — reading what currently wins](#serp-diagnosis--reading-what-currently-wins)
4. [Evidence and severity](#evidence-and-severity)
5. [Assembling AEO-AUDIT.md](#assembling-aeo-auditmd)
6. [Post-ship measurement — the Search Console loop](#post-ship-measurement--the-search-console-loop)

## Working order

Seven steps; each produces an artifact the next one consumes. Skipping ahead is
how audits become opinion pieces.

1. **Kit intake.** Read every field SKILL.md's Step 0 table names. List what's
   missing and ask in **one batch** — a second round of questions costs the user
   more than a thorough first one. Never proceed by inventing a definition,
   price, or profile URL.
2. **Question set.** Fill the worksheet below from the kit. This is the audit's
   beat sheet; nothing else starts until it exists.
3. **SERP diagnosis.** Per question, record what currently wins (method below).
   With no SERP or Search Console access, run in degraded mode — audit structure
   only and mark every "current winner" cell *unverified*.
4. **The five passes.** Run them in SKILL.md's order against the served page —
   `curl` output and rendered DOM side by side, because the gap between them is
   itself a finding class. Capture evidence as you go (standard below); a pass
   you can't quote from didn't happen.
5. **Draft the two artifacts.** The schema patch (recipes in
   `structured-data.md`) and the ranked restructures (rules in
   `answer-formatting.md`), every wording flagged *draft* for
   landing-copywriter or the project's voice skill.
6. **QA gate.** SKILL.md's gate, self-administered, before the user sees
   anything. The validation workflow in `structured-data.md` is the schema
   half; the lift test and three-A pass are the content half.
7. **Report + post-ship loop.** Assemble `AEO-AUDIT.md` (notes below) with a
   verification runbook the user can execute alone, then hand over the
   measurement loop from the last section.

## The question-set worksheet

One row per question, 8–15 rows. Columns, in order:

| Col | Content | Feeds |
|---|---|---|
| `#` | Stable row id — findings cite it | Traceability |
| `question` | Verbatim, in the ICP's phrasing (mining rules in `answer-formatting.md`) | The heading text |
| `shape` | definition / process / comparison / boolean / factual / enumerative | The format law |
| `owning block` | Selector or heading of the block that answers it — or `MISSING` / `ROUTED → skill` | The coverage check |
| `status` | answered / malformed / missing / routed | The scorecard |
| `current winner` | From SERP diagnosis: `us:{selector}` / `competitor:{who}` / `third-party:{who}` / `none` / *unverified* | Steering findings |
| `finding` | Ref into the restructure list, if any | The report |

Filled excerpt for **Acme** (analytics SaaS; kit as in SKILL.md):

| # | question | shape | owning block | status | current winner | finding |
|---|---|---|---|---|---|---|
| Q1 | What is Acme? | definition | MISSING | missing | third-party: a review site, stale copy | F2 |
| Q2 | How much does Acme cost? | factual | MISSING | missing | none | F4 |
| Q3 | Acme vs BoardCo? | comparison | MISSING | missing | competitor: BoardCo's page | F6 |
| Q4 | How does Acme connect to your warehouse (e.g. Snowflake)? | process | `#integrations` (prose) | malformed | none | F7 |
| Q5 | Is Acme SOC 2 compliant? | boolean | `#faq` h3:nth(4) | answered | us: `#faq` | — |
| Q6 | Best BI tools for startups | enumerative | ROUTED → geo-audit + marketing-campaign | routed | third-party: editorial listicle | — |

Q1's "current winner" is the audit's sharpest argument: a third party is
already answering the brand's definitional query, with stale data. That row
sells the whole engagement better than any adjective could.

## SERP diagnosis — reading what currently wins

For each worksheet row, search the query (logged-out / incognito — results are
personalized, and one clean observation beats three polluted ones) and record
four facts:

1. **Does the target page appear at all?** If not, coverage is moot for now —
   note it and check indexation routed via seo-audit.
2. **Does an answer surface exist** — snippet, PAA entry, answer box, rich
   result? No surface = lower reach for that row; adjust severity accordingly.
3. **Who owns it, and which span?** If it's your page, identify the exact
   quoted span — the wrong span winning (a testimonial as the definition) is a
   steering finding, not a victory.
4. **What format won?** The winner's format is the engine's revealed preference
   for that query — if a table owns "acme vs boardco", the format question is
   already answered; match it, don't argue with it.

Cross-check against **Search Console** when the user grants access: Performance
report, filter queries against the question set's phrasings. It shows queries
the page *almost* wins (impressions high, position 4–10) — the cheapest
findings in the whole audit, because the content nearly ranks and only the
format or adjacency is wrong.

Diagnosis rows produce exactly three finding types: **wrong-span-wins** (steer
with `data-nosnippet` + a sharper designed span), **format mismatch** (rebuild
the block in the winning shape), **absent coverage** (add the block, or route
the row honestly). Anything else diagnosis suggests belongs to a sibling —
log it as a handoff note, not a finding.

Degraded mode, stated plainly: with no live SERP and no Search Console, every
"current winner" cell reads *unverified*, the report says so in the scorecard,
and steering findings (which depend on knowing the current winner) are marked
*conditional — verify before applying*. Never fabricate a SERP observation;
an invented winner is worse than an empty cell.

## Evidence and severity

A finding ships with five parts or it doesn't ship:

1. **Location** — selector or verbatim heading text; "the FAQ area" locates
   nothing.
2. **Rule** — name the law it violates, from SKILL.md or the references, so the
   user can weigh the rule rather than trust the auditor.
3. **Evidence** — the quoted span, the `curl` output, the validator message.
   If you can't paste the evidence, downgrade to a note.
4. **Fix** — paste-ready: full before → after for content, the patched node for
   schema. A fix that's a project, not a paste, gets an effort label and a
   routing (which sibling skill owns the heavy part).
5. **Severity** — from the model below, so ranking is reproducible.

**Rank impact-first, then break ties by fix cost.** Order findings by reach
descending; *within* a reach tier, put the cheapest fixes first, so the quick
wins surface at the top of the list. Reach tiers: **high** — the
definitional, pricing, and comparison rows (they gate the brand's first
impression and the money questions); **medium** — the objection long-tail
(security, integrations, migration); **low** — everything else. Fix cost,
cheapest first: text edit < new block < template/SSR change. Two overrides: the
prerequisite gate outranks everything (a `nosnippet` meta or client-only
JSON-LD is always finding #1 regardless of cost), and any claims-discipline
violation (an unsourced number in markup or a span) is an automatic
fail-severity finding — it's a trust bug, not a formatting bug.

## Assembling AEO-AUDIT.md

The five-section contract is fixed in SKILL.md; these are the assembly notes
that keep it sharp:

- **Scorecard** rows name the *single highest-value fix* per pass — a verdict
  plus one action, not a paragraph. A pass with no findings says what was
  checked, so "pass" reads as evidence, not absence.
- **Question coverage map** is the worksheet, verbatim — it already carries
  status, winners, and finding refs.
- **Schema patch** is one `@graph` block with the kit-provenance comments *in*
  (the report is documentation), plus the instruction to strip comments before
  shipping and the per-node visibility preconditions.
- **Restructures** run in severity order; each is the five-part finding above.
  Resist merging findings to look concise — one finding, one fix, one paste.
- **Verification runbook** = the five validation steps from
  `structured-data.md` + the post-ship loop below, written so someone who has
  never read this skill can execute every step. Test that claim by rereading
  it cold: every step names its tool, its input, and what pass/fail looks like.

## Post-ship measurement — the Search Console loop

The audit's claims are falsifiable; this loop is where they get falsified or
confirmed. Hand it to the user with the report.

- **Ship day.** URL Inspection on the page: confirm indexed, and confirm the
  rendered-HTML view carries the JSON-LD graph (the SSR check, now on
  production). Re-run the Rich Results Test against the live URL.
- **Weeks 1–2.** Search Console's enhancement reports pick up the eligible
  types from the eligibility table. New errors appearing here later are almost
  always template drift breaking parity or syntax — treat them as regressions,
  not noise.
- **Ongoing (monthly).** Performance report filtered to the question set's
  phrasings. Per row, watch: impressions (are you in the game), position
  (snippet wins typically report as ~1), CTR. Read CTR by intent, not
  globally: on definitional and brand rows, owning the snippet is *defensive* —
  low CTR is acceptable, misattribution is not. On high-intent rows (pricing,
  comparison, integration how-tos) the click is the point: a snippet win with
  flat clicks means re-run the three-A test on that span — usually the bridge
  is weak or the CTA destination mismatches the question's intent.
- **Surface spot-check.** For explicitly targeted answer surfaces, run the top
  approved questions and record the date, locale, exact result, cited source,
  and whether the brand is represented accurately. Treat this as a volatile
  observation, not proof of a durable ranking rule.
- **The chain that matters.** Question → impression → snippet win → click →
  page → the kit's ONE CTA. Everything upstream is instrumental; when the user
  has analytics on the CTA, report movement there. When they don't, say so
  plainly rather than letting snippet counts stand in for conversions.
- **Re-audit triggers.** Template or framework migration (SSR regressions are
  silent); any change to kit claims or pricing (parity breaks the moment the
  page and the kit disagree); a competitor taking a snippet you owned;
  quarterly, refresh the question set from new PAA/autocomplete phrasings.
