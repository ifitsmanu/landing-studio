# CTA Copy — the ask, the ladder, and the microcopy around it

A landing page without a designed ask is a brochure. The CTA is the page's
thesis — written first, argued for by every section, echoed at conviction
peaks, and de-risked at the moment of commitment. The verb and destination
arrive from the brand kit; this file governs how they are worded, laddered,
placed, and surrounded.

## Contents

1. [The one-CTA rule](#the-one-cta-rule)
2. [The CTA ladder](#the-cta-ladder)
3. [Verb taxonomy by traffic temperature](#verb-taxonomy)
4. [Button label spec](#button-label-spec)
5. [Placement rhythm](#placement-rhythm)
6. [Risk-reversal microcopy](#risk-reversal-microcopy)
7. [Form microcopy](#form-microcopy)
8. [The scent trail](#the-scent-trail)
9. [Measurement hygiene](#measurement-hygiene)

## The one-CTA rule

**Default to one visually primary CTA: one imperative verb + one destination.**
Complex journeys may add an approved subordinate route. The reasoning:

- Two equal asks can obscure hierarchy and make message match harder. Treat the
  primary/subordinate structure as a hypothesis to validate with the actual journey.
- One destination is the only way to attribute the page's effect (see
  [Measurement hygiene](#measurement-hygiene)).
- The verb + destination come from the kit. If the user supplies two, force
  the choice at kit time — never resolve it yourself by stacking buttons.
- If the product genuinely has two audiences with two asks (self-serve +
  enterprise), consider separate pages or one page with a routed subordinate
  path. Choose from user journeys and traffic evidence, not a universal rule.

## The CTA ladder

The ladder is the disciplined exception to "one ask": a **secondary CTA that
is a lower-commitment step on the same path** — not a fork to a different
destination.

| Rung | Commitment | Examples | Rule |
|---|---|---|---|
| **Primary** | The conversion itself | "Start free", "Get access", "Book a demo" | From the kit; identical wording at every placement |
| **Secondary** | A step *toward* the primary | "See how it works" (scroll/short demo), "Watch the 90-second film" (motion-video's output), "Read the docs" (developer) | Visually and verbally subordinate; must feed back into the primary path |
| **Microcopy** | De-risks the primary | "No credit card required" | Under the button, only if kit-true |

Tests for a legitimate secondary:

- **Same-path test:** does completing the secondary make the primary *more*
  likely (a demo, the docs, the film)? Then it's a rung. Does it complete a
  different goal (newsletter signup, "follow us")? Then it's a leak — cut it
  or move it to the footer.
- **Subordination test:** the secondary never gets the accent treatment, never
  outweighs the primary in the hero, and reads as an invitation, not an ask
  ("See how it works" vs "Sign up for updates").
- One secondary, maximum. A three-button hero is a form with extra steps.

## Verb taxonomy

Match the verb to **traffic temperature** — how much the arriving reader
already knows and trusts. The kit's `audience` plus the page's traffic
sources (ask, or check with marketing-campaign) set the temperature; a
mismatch reads as either pushy or timid:

| Temperature | Reader state | Verbs that fit | Verbs that misfire |
|---|---|---|---|
| **Cold** (ads, social, first touch) | Doesn't know the product exists | "See how it works", "Try the demo", "Explore <product>" | "Buy now", "Book a call" — proposing marriage on hello |
| **Warm** (launch page, referral, newsletter) | Knows the category, arrived curious | "Start free", "Try <product>", "Get early access" | "Learn more" — too weak for earned intent; it's what a page says when it has nothing to offer |
| **Hot** (pricing page, retargeted, invited) | Actively deciding | "Start free", "Book a demo", "Get started — free" | Soft verbs that add a step the reader already took mentally |
| **Developer** (any temperature) | Wants the artifact, not the pitch | "Read the docs", "npm install <pkg>", "Deploy", "Get an API key" | Marketing verbs; developers convert on commands, docs, and a working example |

The destination must honor the verb (see [scent trail](#the-scent-trail)).
"Start free" pointing at a demo-request form is a broken promise in four
words.

## Button label spec

- **2–4 words**, verb first. "Start free" — verb + qualifier — is the shape.
- **Specificity converts.** "Start analyzing free" > "Get started" > "Submit".
  A label that could sit on any product's button carries no information;
  borrow a noun or verb from the product's own domain when it fits the
  budget.
- **Say the cost when the cost is the selling point.** "Start free" does
  double duty: ask + price objection handled, two words.
- **Sentence case** by default ("Start free", not "START FREE" or "Start
  Free") — it reads as speech, not signage. The kit's voice/design system may
  override; defer if it does.
- **No punctuation, no ellipsis, no "now"** unless urgency is real and
  ledger-defensible. Manufactured urgency ("Only 3 spots left!") is a trust
  withdrawal.
- **First person vs second person** ("Start my trial" vs "Start your trial"):
  first person tests well on high-commitment forms, but plain imperative
  ("Start free") beats both when the budget is tight. Choose one grammar and
  keep it page-wide.

## Placement rhythm

The ask appears at conviction peaks, worded identically each time — echoes of
one ask, never new asks:

1. **Hero** — primary + optional secondary. The reader arriving pre-sold
   (hot traffic) must never have to scroll to convert.
2. **Post-proof echo** — immediately after the strongest proof section
   (belief 4 just landed; conviction is at page-maximum). A quiet inline
   placement: button, or one-line ask + button.
3. **Final section** — the full designed close: value proposition restated in
   one line + the primary button + risk-reversal microcopy. The reader who
   reached the bottom read everything; this is the warmest moment on the
   page. Never end a page on the FAQ or the footer.

Sticky-header buttons and mid-scroll behavior are landing-page-design's
placement decisions — supply the strings and the identical-wording rule;
let design place them.

## Risk-reversal microcopy

The line under the button answers the reader's last-second flinch. It is the
highest-converting sentence-per-word on the page and it is **a factual claim,
checked like one**:

- Standard *shapes* — the shapes are inventory; the values never are. Every
  bracket is filled from the kit, or the line doesn't run: "No credit card
  required" · "Free `<trial-length>`-day trial" · "Cancel anytime" · "Set up
  in `<kit-verified time>`" · "`<compliance certification the kit
  documents>`" · "`<data-ownership promise the kit makes>`".
- **≤ 8 words per line, ≤ 2 facts**, separated by a middot. Three facts under
  a button reads as protesting too much.
- Match the microcopy to the objection the ICP actually has (see
  `proof-and-objections.md`): a security-sensitive ICP gets the compliance
  fact; a price-sensitive ICP gets the credit-card fact.
- Number-shaped fills (`<trial-length>`, `<kit-verified time>`) need a ledger
  row like any other number — and the two unbracketed lines are factual
  claims too, kit-checked before they ship.

## Form microcopy

When the CTA opens a form (signup, demo request, waitlist), the copy's job is
to keep the momentum the button created. Field *count* is design's fight
(fewer wins); every string is ours:

- **Labels are visible, plain nouns** ("Work email"), never replaced by
  placeholders — placeholders vanish on focus and fail accessibility
  (coordinate with landing-design-system).
- **Placeholders show format**, not instructions: `you@company.com`, not
  "Enter your email address…".
- **The submit button repeats the primary verb** — "Start free", not
  "Submit". The form is the same ask, not a new one.
- **Error messages: what happened + what to do**, in the brand's voice,
  never blaming: "That email doesn't look complete — check for a typo?" not
  "Invalid input." The error state is the one moment the reader is
  guaranteed to be reading; write it like it matters.
- **Success states advance the story**: "Check your inbox — your workspace
  link is on its way" beats "Form submitted successfully". Tell them what
  happens next, because "what happens next" is the objection of the moment.
- **Privacy line where the email is asked**: one plain sentence ("We'll only
  email you about your account"), true per the kit, linked to the policy.

## The scent trail

The verb is a promise about the destination; the destination must keep it.

- "Start free" → a signup that is actually free, no card wall unless the
  microcopy said so.
- "See how it works" → a demo/product view, never a pricing page or a form.
- "Book a demo" → a calendar, not a "sales will contact you" black hole.
- The destination page's own header should echo the promise ("Create your
  free workspace") — if the destination is out of scope, flag the mismatch
  in the handoff notes rather than shipping a broken trail; scent-trail
  mismatch quietly kills conversion the page gets blamed for.

## Measurement hygiene

- One destination → one measurable path. Distinct placements (hero vs final
  echo) can carry distinct UTM/anchor params so the analytics separate them —
  same wording, different tags.
- Keep label wording stable during a test window; changing the button text
  mid-experiment poisons the data. A/B candidates come from the ranked
  headline/label sets, one variable at a time — hand the experiment design to
  marketing-campaign.
- After launch, read the funnel together: strong traffic + weak clicks is a
  page problem (this skill's QA gate, rerun); strong clicks + weak completion
  is a destination/scent problem (flag it); weak traffic is upstream
  (seo-audit / marketing-campaign).
