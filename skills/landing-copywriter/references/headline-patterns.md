# Headline Patterns — the hook, engineered

The headline has one job: stop the scan and buy the subhead three seconds of
attention. It is the highest-leverage string on the page and the one most
often written last and worst. Write 3–5 candidates, name the pattern each one
uses, and rank them — never present a single take as inevitable. Real, quoted
instances of these patterns from the canon live in `canon-teardowns.md` —
read them to get the idiom in your ear before drafting.

## Contents

1. [Word budgets by slot](#word-budgets-by-slot)
2. [Why the budget exists](#why-the-budget-exists)
3. [The pattern library](#the-pattern-library)
4. [Subhead patterns](#subhead-patterns)
5. [Section headers — the skim spine](#section-headers)
6. [The anti-pattern list](#the-anti-pattern-list)
7. [Selection procedure](#selection-procedure)

## Word budgets by slot

| Slot | Budget | Notes |
|---|---|---|
| H1 (hero headline) | **≤ 8 words** (aim 4–7; the canon runs as short as 2) | The budget is a ceiling — one or two fixation groups; past 8 it reads as body text |
| Subhead | ≤ 22 words | Two lines max at display scale; confirm the wrap with landing-design-system |
| Eyebrow / badge | ≤ 5 words | Optional context line above the H1 ("For ops teams", "New: v2") |
| Section header | ≤ 6 words | Must be a claim, not a label — it carries the skim |
| Capability block header | ≤ 6 words | Same rule |
| Button label | 2–4 words | See `cta-copy.md` |
| Caption | ≤ 12 words | States what the screenshot proves |

Overages are cut, never accommodated. The clause that won't fit in the H1 is
the subhead's opening; the clause that won't fit in the subhead is the first
product section's job.

## Why the budget exists

- Short display copy is easier to fit, translate, and scan, but there is no
  universal word count. Test the actual type, viewport, audience language, and
  claim clarity; a longer precise headline can beat a shorter vague one.
- Compression forces the choice. A 15-word headline is usually three claims
  that nobody picked between; the budget is how the choice gets made.

## The pattern library

Each pattern: the formula, when it may fit, an Acme rendering, and the trap.
Acme = the packet's generic worked example ("answers questions about your
data in plain English"; ICP = non-analyst ops/data leads; competitors sell
dashboards and SQL notebooks).

### 1. Category claim (the Stripe pattern)

**Formula:** `<Category noun phrase> for <domain>` — plainly stating what it
is, at maximum altitude the product can honestly hold.
**Wins when:** the product genuinely defines or leads a category and the
brand has (or wants) infrastructure-grade gravity. The confidence *is* the
persuasion.
**Acme:** `Data answers for every team.`
**Trap:** altitude the product can't cash. A seed-stage tool claiming
"infrastructure for X" reads as costume. Also fails the competitor-swap test
by default unless the category framing itself is novel — check it.

### 2. Outcome contrast (the "X, not Y" pattern)

**Formula:** `<Outcome the reader wants>, not <thing they tolerate today>.`
Positions against the status quo in one breath.
**Wins when:** the ICP has a named, resented incumbent behavior (dashboard
hunting, ticket queues, YAML). The contrast does the differentiation work
that a paragraph otherwise would.
**Acme:** `Answers, not dashboards.` (3 words; the Acme deck's pick.)
**Trap:** the Y must be something the reader actually resents, not a straw
man; and the X must be believable within one subhead of support.

### 3. Verb-first imperative

**Formula:** `<Verb> <object> <qualifier>.` — the reader addressed directly,
already doing the thing.
**Wins when:** the product's core action is its differentiator and the verb
is concrete ("Ship", "Deploy", "Ask"). Natural fit for developer and
prosumer tools.
**Acme:** `Ask your data anything.`
**Trap:** weak verbs ("Manage", "Optimize", "Streamline") make this pattern
generic instantly — those verbs describe every product ever built.

### 4. Mechanism reveal (the "how" pattern)

**Formula:** `<Outcome> <via distinctive mechanism>.` The differentiator is
*how* it works, said plainly.
**Wins when:** the mechanism is genuinely novel and legible in a phrase —
"in plain English", "without leaving your editor", "on your own hardware".
The mechanism is what survives the competitor-swap test.
**Acme:** `Your data, in plain English.`
**Trap:** mechanisms that need explaining ("with retrieval-augmented…") don't
belong in an H1; that's subhead or product-section material.

### 5. Audience call-out

**Formula:** `<The thing>, built for <the ICP>.` or an eyebrow carrying the
audience + a pattern-2/3 H1.
**Wins when:** the category is crowded and the differentiation *is* the
audience ("for non-analysts", "for compliance teams"). Belief 1 ("this is
for me") lands in the first fixation.
**Acme:** eyebrow `For teams without an analyst` + H1 `Ask your data anything.`
**Trap:** calling out an audience excludes everyone else — deliberate, but
confirm with the kit that the ICP is really that narrow.

### 6. Provocation / question

**Formula:** a question the ICP already asks themselves, verbatim.
**Wins when:** the pain is vivid and universally recognized in the ICP;
opens a loop the subhead must close.
**Acme:** `Why did churn spike in March?` (with subhead: "Ask Acme. Get the
answer in seconds — no SQL.")
**Trap:** questions with an easy "no" ("Tired of dashboards?" — "not
really") bounce the reader. Use the *reader's own* question, never a
marketing question about the reader.

### 7. New-way declaration

**Formula:** `<Old workflow> is over.` / `Meet <the new way>.` — announcing a
generational shift.
**Wins when:** launch moments with real novelty; pairs with motion-video's
launch film making the same claim.
**Trap:** the highest burn-rate pattern. If the product is an increment, the
page writes a check the demo bounces. Requires the strongest proof section
of any pattern here.

## Subhead patterns

The subhead's job: convert the H1's attention into comprehension — belief 2
("I understand what it is") in ≤ 22 words. Reliable shapes:

- **Mechanism + outcome:** "Ask questions about your data in plain English.
  Acme answers in seconds — no SQL, no dashboard hunting." (what you do →
  what you get → what you skip)
- **Category anchor:** when the H1 is abstract, the subhead says the plain
  thing: H1 `Answers, not dashboards.` → SUB opens "Acme is an analytics
  tool that…" Never let both H1 *and* subhead be abstract; one of the two
  must state the category outright.
- **Proof-forward:** open with the strongest ledger claim if it's
  self-explanatory ("Median time to answer: 11 seconds…"). Only with a
  ledger row.

Rules: no colons chaining three clauses; one period is fine, two is the max;
the last phrase should hand off naturally to the button that sits below it.

## Section headers

The skim reads *only* headers and buttons — so headers are claims that chain
into the page's full argument, in order. Write them as a set, read them as a
set.

- **Claim, not label.** "Anomalies flag themselves" (claim) vs "Features"
  (label). A label header is a hole in the skim path.
- **Each header advances the belief chain** — the header for a
  belief-3 section demonstrates capability; a belief-5 section header
  de-risks ("Your data stays yours").
- **Parallel construction across sibling blocks** (three capability cards
  should share a grammatical shape) — parallelism reads as design.
- The chain test, verbatim from SKILL.md: read headers + button labels top
  to bottom; the sequence must state the complete argument.

## The anti-pattern list

Each is banned for a reason, not a taste:

| Anti-pattern | Example | Why it fails |
|---|---|---|
| Generic-verb slop | "Supercharge your workflow" | Describes nothing; fails competitor-swap against literally every product |
| Compound claim | "Fast, secure, and collaborative analytics" | Three headlines nobody chose between; each third gets a third of the belief |
| Insider abstraction | "The semantic layer for revenue intelligence" | The ICP (per the kit) has to already know the jargon; belief 2 never lands |
| Wordplay-first | puns, rhymes before clarity | Clever is a tax on comprehension; pay it only after clarity is bought |
| Feature-as-headline | "AI-powered natural language querying" | Names the mechanism's ingredients, not the outcome; "AI-powered" is the era's emptiest modifier |
| Vague superlative | "The best way to understand your data" | "Best" carries no information and no ledger row can back it |
| Reader flattery | "You deserve better analytics" | Reads as manipulation; the canon never does it |

## Selection procedure

1. Draft 3–5 candidates spanning at least three different patterns.
2. Kill any that fail the **competitor-swap test** against every named
   competitor in the kit.
3. Kill any the subhead can't fully support in 22 words.
4. Read the survivors aloud in front of the (imagined, honest) ICP; keep the
   one that would earn "wait — how?"
5. Present the ranked set with pattern names and one-line reasoning; the user
   picks. If the page will be A/B tested, hand the runner-up to
   marketing-campaign as the variant — one variable (the H1), never several.
