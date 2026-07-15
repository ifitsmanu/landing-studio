# Voice — register, vocabulary, and the slop problem

Voice is a brand-kit input, not a house style. This file defines how to read
the kit's voice field, the default register when the kit is silent, and the
vocabulary discipline that separates the canon (Stripe, Linear, Anthropic,
Apple, Vercel) from the median AI-written landing page — which is now the
thing readers are actively pattern-matching against.

## Contents

1. [Where voice comes from](#where-voice-comes-from)
2. [The default register](#the-default-register)
3. [Sentence mechanics](#sentence-mechanics)
4. [The slop blacklist](#the-slop-blacklist)
5. [The replacement procedure](#the-replacement-procedure)
6. [Tone by section](#tone-by-section)
7. [Conventions](#conventions)
8. [Voice QA](#voice-qa)

## Where voice comes from

Resolution order — first hit wins:

1. **A project brand-voice skill or document** (tone guide, brand book,
   design-system voice section). Defer to it for register, vocabulary,
   capitalization, and taboos; it outranks everything below wherever they
   overlap. Never *require* one — the default register must carry a project
   that has nothing.
2. **The kit's `voice` field** — rules, adjectives, example sentences the
   user supplies ("plain, confident, no exclamation points").
3. **The default register below.**

On conflict between a project voice document and the kit's voice field,
surface it and let the user decide; don't pick silently. Voice adjectives
from the kit ("bold", "warm") are interpreted through the mechanics below —
"bold" means shorter sentences and stronger verbs, never more exclamation
points.

## The default register

The register shared by the reference canon, stated as rules with reasons:

- **Declarative, present tense.** "Acme answers in seconds" — not "Acme can
  answer", "will answer", or "is able to answer". Hedged tense reads as
  hedged confidence; present tense reads as a product that exists.
- **Second person for the reader, product name for the product.** "You ask;
  Acme answers." Avoid "we" except in honesty-critical moments (pricing,
  security, apology) — "we" sentences are about the company, and the page is
  about the reader.
- **Concrete nouns and verbs from the product's domain.** Query, flag, ship,
  merge, sync — words that mean one thing. Abstraction is where trust leaks.
- **Zero hype adjectives.** The claim's strength comes from its specificity
  and its ledger row, not its modifiers. "Powerful" has appeared on every
  software page ever shipped; it carries exactly no information.
- **Short.** Not as a style, but because every extra word is scan-tax. The
  canon's sentences average well under 15 words on page surfaces.
- **Confident, never breathless.** No exclamation points on the page surface
  (a success state may earn one — once). Excitement is the reader's job; the
  page's job is to be worth it.

## Sentence mechanics

- **Average sentence < 15 words on skim surfaces** (heroes, headers,
  captions, buttons); body copy may breathe to ~20. One idea per sentence,
  always.
- **Rhythm is variation.** A page of uniformly short sentences reads as
  staccato marketing; follow a four-word sentence with a twenty-word one.
  Read aloud to hear it — the ear catches what the eye forgives.
- **Front-load.** The first three words of any sentence carry it for
  scanners; never open on a subordinate clause ("While many teams
  struggle…" — cut to the claim).
- **Reading ease target: roughly 7th–9th grade** on prose surfaces (any
  standard readability measure will do). This is not dumbing down —
  Stripe explains payment infrastructure at this level. Domain terms the ICP
  uses daily are exempt; *syntax* complexity is not.
- **Parallelism across siblings.** Three capability cards share one
  grammatical shape; a broken parallel reads as a typo at page scale.
- **No stacked qualifiers.** "Really quite significantly faster" — one
  qualifier maximum, and prefer zero plus a number.

## The slop blacklist

These words are banned not because they are wrong but because they are
*everywhere* — ubiquity has stripped them of information, and post-LLM
readers now read them as machine-generated filler, which taxes the page's
credibility directly:

| Banned | What it was hiding | Say instead (the specific thing) |
|---|---|---|
| supercharge, turbocharge | an unnamed speed/scale claim | the number, with its ledger row |
| unleash, unlock, empower | an unnamed capability | the capability: "query without SQL" |
| seamless, frictionless | an unnamed integration/setup story | "connects to Postgres in one step" |
| effortless | an unnamed time-to-value | "first answer in two minutes" |
| revolutionize, game-changing, disrupt | a new-way claim with no evidence | the before/after, shown |
| elevate, next-level, take X to the next level | nothing; pure filler | delete; the sentence usually survives |
| cutting-edge, state-of-the-art, blazing(-fast) | an unnamed benchmark | the benchmark, or silence |
| robust, powerful, flexible | unnamed limits | the actual limits: "handles 10M rows" |
| leverage (as a verb) | "use" | "use" |
| solutions | the product's actual category | the category noun |
| AI-powered (as a benefit) | the mechanism's ingredient list | what the AI *does* for the reader |
| journey, ecosystem, holistic | vagueness at the concept level | the concrete workflow |
| best-in-class, world-class | an unledgered superlative | a ledgered comparative, or cut |

Also banned as *patterns*: "It's never been easier to…", "Say goodbye to X,
say hello to Y", "In today's fast-paced world…", "Whether you're a startup
or an enterprise…", "We've got you covered", em-dash-chained triads of
abstract nouns ("speed, scale, and simplicity"). Each is a fill-in-the-blank
template the reader has seen ten thousand times; templates read as effort
withheld.

## The replacement procedure

A blacklist hit is never just deleted — it marks buried treasure. Each banned
word is a compression of a specific claim the writer didn't dig out:

1. Ask: *what fact was this word gesturing at?* ("Seamless" → what does setup
   actually involve?)
2. Get the fact (from the kit, the screenshots, or the user — it may need a
   ledger row).
3. Write the fact in the word's place. It is almost always shorter-per-unit-
   of-persuasion than the adjective it replaces.
4. If no fact exists behind the word — the claim was empty — delete the
   sentence and check whether anything was lost. Usually nothing was.

## Tone by section

One voice, modulated — the way one person speaks differently when promising,
explaining, and apologizing:

| Section | Modulation | Example (Acme) |
|---|---|---|
| Hero | Maximum confidence, minimum words | "Answers, not dashboards." |
| Problem/turn | Empathy without melodrama — name the pain, don't perform it | "Somewhere in dashboard forty, the question got lost." |
| Product/capabilities | Plain demonstration; the screenshot leads | "Type the question. The answer arrives with the SQL that produced it." |
| Proof | Step back; let customers and numbers speak | attribution lines, sourced metrics |
| Pricing/objections | Plainest register on the page; zero cleverness | "Every plan includes every feature. Pricing scales with seats." |
| FAQ | Direct, first-sentence answers; human, unhurried | "Yes — you can export everything, any time." |
| Errors/empty states | Human, specific, blame-free | "That email doesn't look complete — check for a typo?" |
| Final CTA | Calm restatement; the quietest confident moment | "Ask your first question in two minutes. Start free." |

The pricing/objections row is load-bearing: cleverness anywhere near money or
risk reads as misdirection. The plainer the register there, the more the
reader trusts everything above it.

## Conventions

Defaults — the kit or a project design system overrides any of them:

- **Sentence case** for headlines, headers, and buttons. Title Case reads as
  signage; ALL CAPS is reserved for eyebrows/badges if the design system uses
  them.
- **Product and brand names exactly as the kit writes them**, every time —
  casing included. Grep the deck for drift before handoff.
- **Serial commas on; contractions on** ("you're", "it's") — the register is
  speech-plain, not legal.
- **Numerals for all numbers on skim surfaces** ("14-day", not
  "fourteen-day") — digits stop the scanning eye; that's the point.
- **No emoji on the page surface** unless the kit's voice explicitly calls
  for them.
- Punctuation minimalism: one exclamation point per page *maximum* (prefer
  zero); question marks only in FAQ questions and deliberate
  provocation-pattern headlines; semicolons almost never — split the
  sentence.

## Voice QA

- **Read-aloud pass** — the full deck, out loud, one sitting. Mark every
  stumble and every sentence you wouldn't say to a customer's face; both are
  rewrites.
- **Slop scan** — grep the deck against the blacklist (words *and* patterns);
  run the replacement procedure on every hit.
- **One-writer test** — read hero, a capability block, the FAQ, and an error
  message back to back. Same person talking? Modulation is fine; a different
  author per section is not.
- **Name-drift grep** — brand/product casing identical everywhere.
- **Register check against the kit** — reread the kit's voice field last,
  then skim the deck; note anywhere the deck's tone contradicts a supplied
  adjective, and fix toward the kit.
