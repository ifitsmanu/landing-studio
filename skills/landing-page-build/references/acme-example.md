# Worked Example — Acme, an analytics SaaS, end to end

The packet's standing example on a generic product, so nothing depends on a
real brand. This file shows the *orchestration*: what was routed where, what
artifact crossed each seam, what each gate caught. It is deliberately not a
design tutorial — the craft lives in the sibling skills; this shows the seams
working.

The request: *"Build us a landing page for Acme's launch — something at the
level of Stripe or Linear."*

## Contents

1. [Stage 0 — research](#stage-0--research)
2. [Stage 0a — launch brief](#stage-0a--launch-brief)
3. [Stage 1 — design system](#stage-1--design-system)
4. [Stage 2 — page design (approval gate)](#stage-2--page-design)
5. [Stage 3 — copy (approval gate)](#stage-3--copy)
6. [Stage 4 — motion](#stage-4--motion)
7. [Stage 5 — implementation](#stage-5--implementation)
8. [Stage 6 — audits](#stage-6--audits)
9. [Stage 7 — conversion measurement](#stage-7--conversion-measurement)
10. [Stage 8 — browser QA](#stage-8--browser-qa)
11. [Stage 9 — quality gate](#stage-9--quality-gate)
12. [What the seams caught](#what-the-seams-caught)

## Stage 0 — research

One batched questionnaire completed the project-root `brand-kit.md`; the filled
example in `references/brand-kit.md` illustrates the artifact. Two intake
moments worth showing:

- The user initially wanted two primary CTAs: "Start free" and "Book a demo."
  The orchestrator asked for a primary path so the hierarchy stayed clear.
  Decision: **Start free → https://acme.com/signup** as the single
  primary; "Book a demo" demoted to a subordinate secondary in the final
  section only.
- The user offered "10x faster than dashboards" as a claim. No source existed
  in that form — the benchmark doc supported a narrower query-speed claim.
  The ledger got the narrower claim with its source; the 10x phrasing went on
  the forbidden list so no later stage could reintroduce it.

`landing-research` inspected the product, repository, supplied customer calls,
traffic context, and current official competitor pages. Artifacts out:
`brand-kit.md`, `LANDING-BRIEF.md`, and `EVIDENCE-LEDGER.md` (three rows, each
with a user-supplied source). The strategy gate approved audience, traffic
promise, thesis, CTA, evidence, and explicit unknowns.

## Stage 0a — launch brief

Because this request is a dated launch, `marketing-campaign` ran before design
production. It consumed `constraints.launch_date` rather than creating a second
date field. The approved campaign brief fixed the objective, message house,
channel roles, asset owners, measurement definitions, and prohibited tactics.
Campaign activation remained blocked until Stage 9.

## Stage 1 — design system

Routed to `landing-design-system` with the kit. Returned `design-system/`:

- **Color tokens with roles**: canvas `#0B0C0E`, ink `#F4F5F7`, muted ink,
  two fills, hairline — every text/bg pair contrast-checked. The check found
  the kit's `#5C636D` neutral fails AA for body text on canvas; it was marked
  **display/label-only** and the muted-text role assigned to `#9AA1AB`.
  (Kit change → surfaced to the user, recorded in `brand.colors.contrast_notes`, not silently
  patched.)
- **Type scale**: display face for five heading steps, body face at two
  sizes, mono reserved for product data; line-heights and tracking per step;
  hierarchy rules ("step 1 appears once per page").
- **4px spacing scale**, 12-col grid, 1200px container, three breakpoints.
- **Component specs** with states: primary button (accent fill, focus ring
  spec), secondary (hairline outline), nav, card, input, footer.
- **Motion tokens**: two curves, three durations, "transform/opacity only."

Seam gate: all pairs AA-verified or marked; one accent with a written usage
rule; states specified. Passed → stage 2.

## Stage 2 — page design

Routed to `landing-page-design` with kit + system. Returned
`page-design/composition.md` — seven sections, each with a one-sentence job,
layout, and word budgets:

| # | Section | Job (one sentence) |
|---|---|---|
| 1 | Hero | Pass the 5-second test: claim + product-in-motion slot + CTA |
| 2 | Live proof | Show the core loop actually happening — the strongest demo first |
| 3 | Capability: ask → answer | Prove the one-liner literally |
| 4 | Capability: anomaly flag | Prove it works unprompted |
| 5 | Capability: shared report | Prove the output travels to the team |
| 6 | Social proof | Ledger-backed quote + team-count claim |
| 7 | Close | Restate the claim; final CTA; subordinate "Book a demo" |

Plus: fold strategy at 375px and 1280px; CTA map (sections 1, 2, 7 — the
strongest proof earns the second ask); the **hero slot spec** for motion
(16:10 media slot, silent loop wanted, poster mandatory, few-MB budget); word
budgets per slot (hero headline ≤6 words, subhead ≤18, section heads ≤8).

Gate: the draft ordered capabilities feature-taxonomy-style (ask, flag,
share). The orchestrator's strongest-proof-first check reordered nothing here
— ask→answer *was* the strongest — but it forced the "Live proof" section to
slot 2 instead of the original slot 5 position. **User approved** the revised
structure.

## Stage 3 — copy

Routed to `landing-copywriter` with kit + approved composition. Returned
`copy/page.md`, every slot filled:

- Hero: **"Answers, not dashboards."** (4 words, inside budget) · subhead
  states the one-liner for the ICP · CTA "Start free."
- Headlines-only read (the gate's own test): *Answers, not dashboards → Ask
  in English, get the answer → It flags what you didn't ask → Send the
  answer, not a login → Teams already run on Acme → Start free.* A complete
  argument ending in the ask.
- Every number and the customer quote traced to its ledger row; the "10x"
  phrasing (forbidden list) absent; nothing from `voice.avoid` anywhere.
- Meta title/description and all alt text drafted here, not left to stage 5.

Gate caught one violation: a section draft read "seamlessly shares to
Slack" — `seamless` is on the kit's avoid list. Rewritten concrete: "Shares
to Slack in one click." **User approved.**

## Stage 4 — motion

Routed to `motion-video` with the **same kit file** plus the stage-2 hero
slot spec (`placement: hero-embed`, 16:10, loop, poster) and the stage-3
claim/beats — so the film argues exactly what the page argues, in the same
words. Ran **in parallel with stage 5**.

Returned `motion/`: a 12s silent hero loop (MP4 + WebM, few-MB), a designed
poster frame (the half-typed question — a complete statement as a still), a
reduced-motion still, and a 30s feed cutdown for launch — all through
motion-video's own QA gate.

Seam gate: poster verified as a standalone hero (JS disabled, media blocked);
file sizes inside stage 5's LCP math; film CTA = page CTA verbatim.

## Stage 5 — implementation

Built on the project's stack (a static-friendly React setup; had there been
none, semantic HTML/CSS) from tokens + composition + copy + the motion
poster placeholder, with real media dropped in when stage 4 landed.

Contract checks at the seam: a grep for one-off hex values found two rogue
values a component had introduced — replaced with tokens; a word-for-word
diff against `copy/page.md` found an implementer-"tightened" subhead —
reverted (copy edits are stage-3 backflow, not markup edits); measured on a
throttled profile: **LCP 1.8s (the hero headline), CLS 0.02**; keyboard and
reduced-motion passes clean.

## Stage 6 — audits

`seo-audit`, `aeo-audit`, `geo-audit` routed **in parallel**, each fed the
built page + the kit's competitors/ICP. Findings: five P1s —

1. Canonical tag pointed at the staging host (seo) → corrected to the approved
   production URL and verified against redirects.
2. Meta description under-specific for the query space (seo) → rewritten *by
   routing back through the copywriter*, not by the auditor.
3. A key product answer existed only after client-side interaction (aeo/geo) →
   implementation exposed the essential explanation in the raw response.
4. Thin alt text on two product screenshots (seo/aeo) → stage-3 backflow.
5. Crawler policy contradicted the approved search/training decision (geo) →
   configuration corrected and fetched again. No schema type was added merely
   because a validator accepted it.

Each fix re-verified by re-running the relevant audit. Zero open P0/P1.

## Stage 7 — conversion measurement

`conversion-optimization` verified the primary conversion definition, event
names/properties, consent behavior, and replay masking. The existing analytics
stack was reused. Heatmaps and scroll depth were documented as behavioral
signals only; the team approved two hypotheses with primary metrics, guardrails,
and decision rules instead of treating them as explanations of intent.

## Stage 8 — browser QA

`landing-page-qa` exercised direct loads, navigation, the signup path, invalid and
success form states, keyboard, reduced motion, mobile/desktop Chromium and WebKit,
raw HTML, metadata, analytics/consent, console, and network. Screenshots and traces
were attached. A passing build was recorded as one input, not release proof.
All P0/P1 cases were fixed and rerun.

## Stage 9 — quality gate

The full `quality-gate.md` run, highlights:

- Comprehension pass at 375px — product, audience,
  action all named by a fresh reader. Headlines-only read sells. Squint pass:
  one dominant element per screenful. Slow-network: poster paints, no CLS.
  Content review found section 5 repetitive → one paragraph cut (stage-3 backflow,
  budget-compliant, re-approved).
- CTA audit: "Start free" in exactly three placements, verbatim; scent trail
  clicked through to signup on desktop and phone; keyboard reaches it.
- Claims walk: every on-page number/quote/name → ledger row; forbidden "10x"
  absent; synthetic demo data labeled in the screenshots.
- Conformance: eyedropper matched the kit's hexes; wordmark is the SVG file;
  accent counted at ≤2 appearances per screenful.
- Craft scrub, performance, accessibility: clean after the fixes above.

Bundle handed off: the page, root `brand-kit.md`, all stage artifacts, browser
evidence, and the filled gate checklist. Decision: **SHIP**. Only then did the
campaign owner activate the run-of-show.

## What the seams caught

The point of the pipeline, in one table — none of these would have surfaced
in a single-pass "just build it" run:

| Caught at | Defect | Owner it went back to |
|---|---|---|
| Stage 0 research | Two primary CTAs | User decision, kit |
| Stage 0 research | Unsourced "10x" claim | Ledger + forbidden list |
| Stage 0a | Campaign date duplicated in an extension draft | Canonical `constraints.launch_date` |
| Stage 1 gate | AA failure on a kit neutral | Kit `brand.colors.contrast_notes`, with the user |
| Stage 2 gate | Strongest proof buried at slot 5 | Page design, re-approved |
| Stage 3 gate | `voice.avoid` word in a draft | Copy |
| Stage 5 seam | Rogue hex values; silently edited copy | Tokens; stage-3 revert |
| Stage 6 | Five P1 audit findings | Routed to owning stages |
| Stage 7 | Replay masking gap | Analytics/consent owner |
| Stage 8 | Signup retry failure in WebKit | Implementation, rerun in browser |
| Stage 9 | Repetitive section | Copy, re-approved |

Every catch was cheap at its seam and would have been expensive one stage
later. That is the orchestrator's entire value.
