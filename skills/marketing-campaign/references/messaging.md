# Messaging — positioning, the message house, and per-channel compression

The campaign says one thing. This file is the method for deciding what that
thing is, proving it, and expressing it at every length a channel demands —
without it drifting into a different thing. Every value here comes from the
brand kit; nothing brand-specific may originate in this file.

## Contents

1. [Positioning statement](#positioning-statement)
2. [The message house](#the-message-house)
3. [The compression ladder](#the-compression-ladder)
4. [Hooks — the taxonomy](#hooks--the-taxonomy)
5. [Voice: defer or fall back](#voice-defer-or-fall-back)
6. [Message match](#message-match)
7. [Objection map](#objection-map)
8. [Claims discipline](#claims-discipline)
9. [Worked example — Acme](#worked-example--acme)

## Positioning statement

One internal sentence that forces every hard choice at once. It is never
published verbatim — it is the test every published sentence must pass.

> For **[ICP, from the kit]** who **[problem, in the ICP's own words]**,
> **[name]** is **[category the ICP already understands]** that
> **[the one differentiated outcome]**. Unlike **[named competitor(s), from the
> kit]**, it **[the sharpest defensible difference]**.

Rules that make it work:

- **The category must already exist in the ICP's head.** Inventing a category
  ("the first RevIntelOps platform") outsources your explanation to nobody.
  Position inside a known category and differentiate hard within it.
- **The competitor slot uses the kit's named competitors** — including "the
  spreadsheet" or "doing nothing," which are usually the real incumbents.
  Never invent or imply competitors the user didn't name.
- **One differentiated outcome.** If the "unlike" clause needs "and," the
  positioning isn't done. Force the choice now; the calendar can't rescue a
  compound position.

## The message house

The campaign's argument as a structure, frozen at stage 2 and quoted by every
asset thereafter:

```
ROOF     — the claim: one idea, concise enough for the approved placement
PILLARS  — 2–4 proof pillars: the capability themes that make the roof true
EVIDENCE — under each pillar, 1–3 evidence rows: a demonstrable capability,
           a stat (ledger-traced), or a named-customer proof (ledger-traced)
```

- **The roof is a claim, not a description.** "Answers, not dashboards." claims;
  "AI-powered analytics platform" describes. A claim can be disagreed with —
  that's what makes it memorable.
- **Use only as many pillars as the argument needs.** Give each asset one dominant
  proof job, while allowing a fuller format to combine pillars when necessary.
  Consistency comes from the shared roof and evidence, not a fixed count.
- **Evidence rows are the only place numbers live.** Each carries its ledger
  citation inline. An asset may only use a number that appears in an evidence
  row; this makes claims-QA a lookup, not an investigation.
- **Demonstrable beats declarative.** "SSO in one screen" is a pillar's
  evidence; "enterprise-grade" is not, because it cannot be shown. If the
  campaign includes a film, evidence rows should map to beats `motion-video`
  can shoot.

## The compression ladder

The same message at every length the channels demand. Write the ladder once, at
message-house time; assets then *select* a rung, never re-derive the message.

| Rung | Length | Where it's used | Construction |
|---|---|---|---|
| **Claim** | Placement budget | Film claim card, page H1 territory, social image text | The concise roof, adapted only when the approved format requires it |
| **Hook** | 1 line (~12–15 words) | First line of posts, email subject, video first-frame text | Roof + tension or specificity (see hooks below) |
| **Post** | 30–80 words | X post, LinkedIn opener, community comment | Hook → one pillar's strongest evidence → CTA |
| **Announcement** | 120–200 words | Email body, LinkedIn long-form opener, press one-pager lede | Hook → roof → all three pillars, one sentence each → CTA |
| **Essay** | 400–900 words | The announcement post on the site (the master asset) | The full house: story of the problem → roof → each pillar with evidence → CTA. Written to docs quality — this page outlives the launch in search/answer engines (coordinate with `seo-audit` / `aeo-audit` / `geo-audit`). |
| **Film** | 45–90s | Launch film | Route to `motion-video`; hand it the roof as the film's claim and the evidence rows as candidate beats |

The test for every rung: a reader who sees *only that rung* comes away with the
same one idea. If a rung introduces a new idea to fill space, cut the space.

## Hooks — the taxonomy

The hook is the first visible line/frame and must earn the next moment without
assuming how far people will continue. Write
5–10 candidates per asset, pick by reading them cold. The forms that work in
the premium idiom (and the failure each avoids):

1. **Demo-first** — "Watch [product] [do the thing] in [n] seconds." Leads with
   proof; strongest when a clip follows immediately.
2. **The named problem** — the ICP's pain in the ICP's exact words (from the
   kit's audience field). Recognition stops the scroll; generic pain doesn't.
3. **Before/after** — "It took X. Now it takes Y." Both halves concrete; the Y
   ledger-traced if it's a number.
4. **The contrarian roof** — the claim phrased against the category's default
   ("Answers, not dashboards."). Only works if the rest delivers the argument.
5. **The specific number** — one stat with its context in the same line. Must
   be an evidence row; a number without a source is a lie waiting to be quoted.
6. **The build story** — "We built X because Y kept happening." First-person,
   founder-posted only; brand accounts telling build stories read as ghostwritten.

Banned openers, because they burn the only guaranteed line on zero information:
"We're excited/thrilled to announce," "Big news!", "Introducing [name]" as the
*whole* hook, rhetorical engagement-bait ("What if I told you…"), and any
emoji-and-hashtag garnish doing the work the sentence should do.

## Voice: defer or fall back

- If the kit's `voice` field points to a project brand-voice skill or document,
  **defer to it completely** — its vocabulary, register, and banned-words list
  outrank everything in this section.
- Otherwise use the built-in register of the premium launch idiom: declarative,
  present tense, short sentences, concrete nouns, zero hype adjectives
  ("revolutionary," "seamless," "supercharge"), no exclamation points, and the
  product as the subject of sentences that show rather than assert.
- Render the brand's name exactly as the kit spells it, everywhere, including
  capitalization. A campaign that misspells its own brand fails QA at line one.

## Message match

The chain a visitor experiences must not break: **hook (channel) → headline
(page) → CTA (page)** say the same thing in nearly the same words.

- The promise in each channel's hook appears in the landing page's above-the-fold
  copy. If a channel needs a different promise to perform, that channel is
  running a different campaign — fix the mix, not the page.
- The CTA is verbatim from the kit at every link's origin *and* destination.
- Verify mechanically at QA: for each channel asset, read its hook, click its
  link, and check the promise is on screen without scrolling. This is the
  cheapest conversion fix that exists; mismatch is where campaigns silently
  leak most of their spend of attention.

## Objection map

For each pillar, write the ICP's strongest objection and the campaign's answer
(each answer evidence-row-traced). Two uses:

1. **Pre-emption** — the essay-rung announcement and the landing page FAQ
   answer the top 2–3 objections before they're asked (hand these to
   `landing-copywriter`).
2. **Response doctrine** — on launch day, comments and community threads WILL
   raise them. Pre-written, honest answers in the brand voice let the team
   respond in minutes, in one voice, without inventing claims under pressure.
   An objection with no honest answer is a claim the campaign shouldn't make.

## Claims discipline

- Every number, quote, customer name, benchmark, or comparison in any asset
  traces to a kit claims-ledger row. No row, no publish — enforce at the QA
  sweep by grepping assets for digits and names.
- Rounding is conservative and noted in the ledger.
- Competitor comparisons name only kit-listed competitors, compare only
  verifiable properties, and date the comparison — competitor products change.
- Superlatives ("fastest," "first," "only") are claims requiring sources, not
  seasoning. Unsourced, they're cut.

## Worked example — Acme

**Positioning**: For heads of data at 50–500-person SaaS companies who spend
their week answering ad-hoc questions instead of doing data work, Acme is an
analytics tool that answers plain-English questions from your data directly.
Unlike legacy BI dashboards, it returns a sentence, not another dashboard to
maintain.

**Message house**:

- ROOF: **"Answers, not dashboards."**
- PILLAR 1 — Ask in English: type the question, get the answer with its query
  shown. *Evidence: live demo of "Why did churn spike in March?" (screenshots
  in kit).*
- PILLAR 2 — Finds what you didn't ask: anomalies flagged automatically with
  plain-English explanations. *Evidence: auto-flagged anomaly demo; stat "3.2x
  faster to insight" — ledger row #1 (benchmarks/q3-report.md).*
- PILLAR 3 — Answers travel: any answer becomes a shareable, living report in
  one click. *Evidence: one-click share demo; "trusted by 400 teams" — ledger
  row #2 (CRM export).*

**Ladder rungs**: Hook (X, demo-first): "Watch Acme answer 'why did churn spike
in March?' in 11 seconds — no dashboard involved." Post rung adds pillar-1
evidence and "Start free → https://acme.com/signup". Announcement rung = the email. Essay
rung = the site announcement post, one section per pillar, FAQ from the
objection map ("Is my data used for training?", "What about SQL I already
have?"). Film = routed to `motion-video` with the roof as claim and the three
pillars' demos as beats.
