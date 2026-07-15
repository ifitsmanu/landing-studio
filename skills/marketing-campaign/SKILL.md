---
name: marketing-campaign
description: >-
  Plan a product or landing-page LAUNCH as a dated campaign brief — one objective
  and one north-star metric, ICP, positioning and core message, channel mix (site,
  email, LinkedIn, X, YouTube, PR, community), a week-by-week calendar, the full
  asset list (launch film and cutdowns included), and measurement with benchmarks.
  Use whenever the user says "launch plan", "campaign plan", "marketing campaign",
  "go-to-market plan", "GTM for the launch", "launch calendar", "launch week",
  "announce the product", "announcement plan", "distribution plan", "how do we
  promote this page / get traffic to this page", or wants any coordinated push
  around shipping something. Works for ANY brand and product: it takes a brand kit
  as input (name, one-liner, ICP, colors, type, logo, voice, one primary CTA,
  sourced claims, competitors) and hardcodes nothing. This is campaign STRATEGY —
  the brief, calendar, channel plan, and measurement; asset production routes to
  sibling landing-studio skills (motion-video for the film, landing-copywriter for
  copy, landing-page-design for the page) — it is NOT an always-on content program
  and NOT a paid-media buying plan.
---

# Marketing Campaign

Turn a shipping product plus a supplied brand kit into a coordinated launch: one
objective measured by one north-star metric, one audience, one message, one CTA —
expressed across a small set of deliberately chosen channels on a dated,
week-by-week calendar. The deliverable is a **dated campaign brief** the user
approves before any asset goes into production.

Three things are load-bearing and everything else serves them: **attention**
(every channel is a market for it, each with its own contract — the campaign's
job is to move borrowed attention to an owned destination), **the CTA** (one
verb, one destination, identical in every channel, converting on the landing
page), and **quality** (fewer, better assets in the premium launch idiom — the
way the best software companies announce, not the most content).

## What this makes — and what it is not

The genre: launches in the modern software idiom. Its concrete traits, drawn from
how OpenAI, Anthropic, Stripe, Linear, Vercel, Apple, Framer, and Raycast ship:
the announcement is written and designed to the same bar as the product (Stripe's
docs-grade posts, Anthropic's research-register announcements); the product is
*shown doing the thing* before anything is claimed about it (Linear's interface
films, Raycast's demo-first posts, Apple's one-message discipline); founders and
builders post in first person, because human voices out-reach brand accounts;
one message compresses per channel but never mutates; the launch is a designed
moment with a planned echo, not a single day; and restraint is the register — no
countdown hype, no "we're thrilled to announce," no exclamation points doing the
work the product should do.

Boundaries — hold them firmly:

- **Strategy, not production.** This skill decides *what* ships *where* and
  *when*; the assets themselves are made by the sibling skills below (or by
  hand). Never re-implement a sibling's craft inline.
- **A launch window, not an always-on program.** The plan is bounded — default
  T-4 weeks to T+4 weeks around a launch date. Compounding channels (SEO,
  editorial content, community presence) get *started* here and handed off at
  the window's end; running them forever is a different job.
- **Not paid-media buying.** Paid appears only as optional amplification of
  organic assets that have already proven they convert — never as the plan.

Route production by name when the sibling exists in the environment; when it
does not, keep the asset in the list, mark its owner "external / by hand," and
apply the condensed guidance in this skill's references instead:

| Work | Route to |
|---|---|
| Launch film, hero video loop, social cutdowns | `motion-video` — never re-implement video here |
| Landing page copy (hook → proof → CTA) | `landing-copywriter` |
| Page structure, sections, hierarchy | `landing-page-design` |
| Design tokens, type scale, components | `landing-design-system` |
| Technical + on-page SEO of the page | `seo-audit` |
| Answer-engine optimization | `aeo-audit` |
| Generative-engine optimization | `geo-audit` |
| The whole page, end to end | `landing-page-build` (the orchestrator — when it is driving, this skill supplies the campaign layer it sequences) |

## Step 0 — Collect the brand kit

Nothing in this skill carries a brand. Every name, color, sentence of voice,
claim, and CTA arrives through the **brand kit** — this reads the packet's
canonical `brand-kit.md` (see the packet root template), the same file every
landing-studio skill reads. Collect it once and reuse it everywhere. Consume the
packet-root canonical paths `brand`, `product`,
`voice`, `cta`, `proof`, `competitors`, `research`, `analytics`, and
`constraints`. Do not declare a campaign-local version of the shared schema.

Campaign-specific extension (this skill's additions — ask for these too):

```yaml
campaign:
  tier: "<major (new product) | standard (big feature) | minor (release notes)>"
  owned_audiences:   # inventory what already exists; the plan is built on it
    email_list: "<size + health>"
    accounts: [{channel: "<x|linkedin|youtube|...>", handle: "<who>", reach: "<n>"}]
    communities: ["<memberships where the team has standing>"]
  people: "<who can produce, who will post in first person, who approves>"
  budget: "<if any — tools, paid amplification ceiling, agency>"
  press: "<existing journalist/newsletter relationships, or none>"
  forbidden: ["<claims or channels legal/leadership ruled out>"]
```

The launch date remains canonical at `constraints.launch_date`; do not mirror it
inside `campaign`. If the date is unresolved, keep the canonical field `unknown`
and model schedule options explicitly.

Rules of engagement: when a field is missing, ask — batched, not dripped. If the
project ships a brand-voice or design-system skill or file, **defer to it** for
words and tokens; it outranks this skill's defaults wherever they overlap — but
never *require* one: this skill must produce a complete plan from the kit alone.
Never fabricate audiences, stats, testimonials, press relationships, or reach
numbers. Every number or quote that will appear in any campaign asset must trace
to `proof.claims` or `EVIDENCE-LEDGER.md` — the skill whitelists nothing; sources
come from the user.

## The spine: brief before assets

The core artifact is a **dated campaign brief** — `campaign-brief-YYYY-MM-DD.md`
— written and approved **before anything goes into production**. Why: a launch
coordinates many hands over many weeks, and under deadline pressure the message
drifts, CTAs multiply, and channels get added "just in case." The brief is the
one artifact everything downstream is validated against. Its skeleton:

```markdown
# <Brand> launch — campaign brief
Date: YYYY-MM-DD · Status: draft|approved · Owner: <who> · Launch: YYYY-MM-DD (T-0)

1. Objective & north-star — one sentence + ONE metric with a number and a date
2. Audience — the primary ICP and where their attention already lives
3. Positioning & core message — the claim and its few necessary proof pillars (ledger-traced)
4. CTA — one verb + one destination, carried identically everywhere
5. Channel mix — a small evidence-backed set, each with a named role; everything else is "no"
6. Calendar — the T-4 → T+4 week-by-week (full version in its own file)
7. Asset list — every asset, its channel, its owner/skill route, its deadline
8. Measurement — instrumentation, UTM scheme, first-party baselines, review dates
9. Risks & constraints — forbidden claims, dependencies, single points of failure
```

The five strategy calls inside it, in order — each is one decision, not a menu:

- **Objective & north-star.** Exactly one metric, with a number and a date
  (e.g., "N activated signups by T+14"). A campaign optimizing several targets
  optimizes none: every channel/asset tradeoff downstream is settled by asking
  "which option moves the north star?" — impossible with three stars. Derive it
  from the CTA: the metric is what happens *after* someone does the CTA's verb,
  one step deeper than the click (signups → *activated* signups; demos →
  *held* demos). Add one **guardrail** metric to keep the star honest (e.g.,
  activation *rate*, so a traffic spike of the wrong people doesn't read as
  success). Selection tables: `references/measurement.md`.
- **Audience.** One primary ICP, in their own words, from the kit. Then build
  the **channel-attention map**: list where this ICP's attention already lives
  (which feeds, inboxes, communities, search intents) — channels are chosen from
  this map, never from a generic checklist. Launching "to everyone" is launching
  to no one; a second ICP is a second campaign, later.
- **Positioning & core message.** One positioning statement (against the kit's
  named competitors) and one **message house**: a concise roof claim, the few
  proof pillars the argument needs, and evidence rows that trace to the ledger.
  The same message adapts to each placement budget without changing the promise.
  Full method and the
  compression ladder: `references/messaging.md`.
- **Channel mix.** Choose a small set of channels from the attention map and give each a
  named role; write the "not doing" list explicitly. Depth per channel:
  `references/channel-playbooks.md`.
- **Calendar.** Work *backward* from the launch date; every asset deadline is
  derived, not guessed. Template: `references/calendar-template.md`.

## Channel operating principles (depth in references/channel-playbooks.md)

- **Connect borrowed reach to an owned outcome.** Feeds, press, and communities
  may create discovery; define the qualified next action and measure whether the
  traffic completes it. Reach alone is not the north star.
- **Design the first visible unit deliberately.** Preview and truncation behavior
  varies by channel, account, device, and format. Verify the live rendering and
  make the visible opening specific and self-sufficient.
- **Every post stands alone.** Assume zero context: no "as we teased last week,"
  no dependence on a thread's earlier tweets. Each unit must land the product
  name, one concrete capability, and the CTA on its own.
- **Prefer demonstrable proof when the format and audience support it.** Compare
  product capture, static evidence, customer proof, and text using first-party
  results instead of assuming video wins everywhere.
- **Plan follow-up from evidence.** Pre-author useful follow-up angles, then choose
  timing and channels from observed response, operational capacity, and the
  approved frequency policy. Do not repeat the same asset to manufacture urgency.
- **Provide accessible media states.** Caption spoken content, keep essential
  meaning outside audio alone, verify feed-size legibility, and create native
  compositions for required aspect ratios.

## CTA laws (condensed — depth in references/channel-playbooks.md)

- **One verb, one destination, every channel, all window long.** The kit's CTA
  appears verbatim in the email, the posts, the film's end card, and the page.
  Keep one visually primary ask per asset unless the approved journey requires a
  subordinate alternative. Test uncertain hierarchy before or after launch when
  traffic supports a valid experiment.
- **The landing page is the CTA's home.** Every channel's job ends at the click;
  the page converts. Its craft is owned by `landing-page-design`,
  `landing-copywriter`, and `landing-design-system` — this skill's job is to
  send them the message house so page and campaign say the same thing.
- **Message match is a contract.** The promise in the post is the headline on
  the page (same words, or near). A click that lands on a different promise
  bounces — the visitor concludes they misclicked. Verify match for every
  channel → page pair at QA.
- **Carriage is mechanical, so specify it**: every link UTM-tagged with the
  scheme in `references/measurement.md`; links placed where the channel rewards
  them (first comment vs. inline vs. bio — per-channel rules in the playbooks);
  the destination loads fast and states the promise above the fold.

## The calendar shape (template in references/calendar-template.md)

| Week | Theme | The gate that ends it |
|---|---|---|
| **T-4** | Decide | Brief approved; message house locked; channels chosen |
| **T-3** | Produce | All assets in production, routed to owners; press/community list built |
| **T-2** | Assemble | Page final + SEO/AEO/GEO passes; film locked; email drafted |
| **T-1** | Rehearse | Everything instrumented, scheduled, QA'd; dry run done |
| **T-0** | Launch | Run-of-show executed in order: page live → email → founders post → community → press |
| **T+1** | Echo | Respond everywhere; first cutdowns and follow-up angles ship |
| **T+2/3** | Resurface | Proof, use-cases, second angles; paid amplification *only* of proven winners |
| **T+4** | Close | Retro against the north star; compounding channels handed off |

Compressed (2-week) and major-tier variants, the launch-day hour-by-hour
run-of-show, and asset back-planning live in the reference.

## The asset list — one message, many masters, many cutdowns

Plan assets as **masters and cutdowns**, never as one-offs: each master is made
once at full quality, then disassembled per channel. The canonical launch set —

| Asset | Master → cutdowns | Owner / route |
|---|---|---|
| **Launch film** | 45–90s master → hero loop, 15–30s feed cuts, 6s bumper | `motion-video` — plan cutdowns at its beat-sheet stage, not after |
| **Landing page** | The page → OG/social card, screenshots for posts | `landing-page-design` + `landing-copywriter` + `landing-design-system` |
| **Announcement post** | Long-form on the site → email body, LinkedIn post, X thread | `landing-copywriter` for the master; compress per `references/messaging.md` |
| **Email** | One announcement send (+ optional T+3 echo) to the owned list | copywriter route; playbook rules apply |
| **Founder posts** | 3–5 first-person posts across the window | Human-authored; hooks from `references/messaging.md` |
| **Press/community kit** | One-pager: what/why/screenshots/film link/founder quote | This skill; claims all ledger-traced |

Every row in the brief's asset list carries: channel, owner (sibling skill or
person), deadline (back-planned), and the message-house pillar it expresses.
An asset that expresses no pillar is decoration — cut it.

## Pipeline — six stages, each emitting a reviewable artifact

1. **BRIEF** — the approval unit. Nothing is produced until the user signs off
   on the dated brief (objective, ICP, message, CTA, channels, calendar, assets,
   measurement).
2. **MESSAGE HOUSE** — the positioning statement, roof claim, pillars, evidence,
   and per-channel compressions (`references/messaging.md`). Approved wording is
   frozen; every asset quotes it.
3. **CALENDAR + ASSET LIST** — the filled week-by-week with owners and
   back-planned deadlines (`references/calendar-template.md`).
4. **PRODUCTION** — assets built by their routed owners (`motion-video`,
   `landing-copywriter`, `landing-page-design`, …); this skill reviews each
   against the message house and CTA, not for craft (the owners own craft).
5. **INSTRUMENT + REHEARSE** — analytics events, UTM scheme, dashboard, and a
   T-1 dry run of the run-of-show (`references/measurement.md`).
6. **LAUNCH, ECHO, RETRO** — execute the run-of-show, work the echo plan, then
   close with a written retro against the north star at T+4.

## Craft digest — ten rules

1. **One number is the campaign.** If you can't say the north-star target in one
   sentence, the plan isn't finished.
2. **Channels are chosen from the ICP's attention map, not from a checklist.**
   Three channels done to the quality bar beat seven done to a template.
3. **The announcement is a product.** Write and design it to the same standard
   as the thing it announces; it will outlive the launch week in search and
   answer engines.
4. **Proof before assertion** — choose the strongest permitted evidence for each
   audience and format; product demonstration is one option, not a universal winner.
5. **Choose the publisher from evidence.** Use the personal or brand account whose
   audience, authority, permissions, and historical results fit the campaign.
6. **Compression, not mutation.** Every channel gets the same message at a
   different length; if a post needs a *different* message, it's off-campaign.
7. **Back-plan every deadline** from T-0. A deadline nobody derived is a
   deadline nobody hits.
8. **Follow-up is planned, then evidence-selected.** Prepare useful angles and
   release only the ones justified by response and frequency constraints.
9. **Restraint is the premium signal.** No fake urgency, no engagement-bait
   questions, no eleven-hashtag posts. Delete the asset you're least sure about.
10. **Measure before you launch.** If the dashboard can't show the north star
    on the morning of T-0, T-0 moves.

## Honesty contract

A campaign amplifies whatever it wraps — including a lie, at scale, in writing.

- Every number, quote, customer name, or benchmark in any asset traces to a row
  in the kit's claims ledger — no row, no publish. The skill supplies no stats.
- No manufactured scarcity or urgency ("only 50 spots!") unless it is literally,
  verifiably true.
- No astroturfing: community posts come from real accounts with real standing,
  disclosed affiliation, in the community's own register. Sock puppets, planted
  questions, and concealed coordination are forbidden.
- Paid or gifted coverage is disclosed. Embargoes are honored both ways.
- Demos follow the `motion-video` honesty rules: real product, real speed, or
  labeled in-frame.

## QA gate & definition of done

Built-in and self-contained; if the project has its own brand or review skill,
run it *in addition*. Before T-0, verify empirically:

- **North-star check** — one metric, a number, a date; visible on a dashboard now.
- **CTA sweep** — the identical verb + destination in every asset; every link
  UTM-tagged per scheme and click-tested to the live page.
- **Message-match sweep** — each channel's promise appears in the page's
  above-the-fold copy.
- **Standalone test** — each post, read alone by someone with zero context,
  yields the product name, one capability, and the CTA.
- **Claims traceability** — every number/quote in every asset maps to a ledger
  row; `campaign.forbidden` checked against every asset.
- **Kit conformance** — names, colors, type, logo, and voice exactly as
  supplied; brand rendered exactly as the kit spells it.
- **Run-of-show rehearsed** — ordering, owners, and fallbacks written; the T-1
  dry run surfaced no unowned step.

**Done =** brief approved + all assets shipped per calendar + echo executed +
T+4 retro written against the north star. Attention, CTA, and quality are
*verified*, not asserted.

## Worked example — Acme, an analytics SaaS

Compressed end-to-end (full message house and calendar in the references):

- **Kit**: Acme — "answers questions about your data in plain English"; ICP =
  heads of data at 50–500-person SaaS companies; claim = **"Answers, not
  dashboards."**; CTA = **Start free → https://acme.com/signup**; competitors = legacy BI
  dashboards; ledger rows for the two stats that may appear. Extension: launch
  in 6 weeks, tier = major; owned = 3,200-subscriber list, founder X account
  (8k), company LinkedIn (2k); no press relationships; two founders will post.
- **Objective**: 400 activated free workspaces (signup that runs ≥1 query) by
  T+14. Guardrail: signup → activation rate ≥ 35%.
- **Channel mix** (from the ICP's attention map): landing page (destination),
  email (highest-intent owned), founder-led X + LinkedIn (where data leaders
  actually read), a 60s launch film on YouTube + embedded on the page
  (`motion-video`), and Hacker News + one data-engineering community (earned).
  Explicitly *not*: cold press (no relationships, better spent on two data
  newsletters), TikTok (ICP absent), paid (until an organic winner emerges).
- **Calendar**: T-4 brief + message house approved. T-3 film in production
  (routed to `motion-video`, cutdowns planned at beat-sheet time); page sections
  and copy routed to `landing-page-design` / `landing-copywriter`. T-2 page
  final; `seo-audit` + `aeo-audit` passes; email drafted. T-1 UTMs, dashboard,
  dry run. T-0 run-of-show: page live 08:00 → email 09:00 → founders post
  09:30 → HN "Show HN" 10:00 → newsletter pitches out. T+1 behind-the-scenes
  post + 30s feed cutdowns. T+2 first-user proof post. T+4 retro.
- **Assets**: 60s film + 12s hero loop + two 30s cuts + 6s bumper
  (`motion-video`); page; announcement post → email/LinkedIn/X compressions;
  five founder posts; one-pager for the newsletters.
- **Measurement**: UTM scheme `utm_source=<channel>&utm_medium=<owned|earned>
  &utm_campaign=launch-acme-YYYYMM`; dashboard with north star + per-channel
  visits→signup→activation; reviews at H+4, T+1, T+7; retro T+4 weeks.

## Reference index

Read SKILL.md first; open a reference when its trigger applies.

| File | Read this when… |
|---|---|
| `references/messaging.md` | Writing the positioning statement, message house, hooks, or any per-channel compression — and for the voice defer/fallback rules. |
| `references/channel-playbooks.md` | Choosing the mix or executing any channel — evidence, formats, CTA carriage, first-party baselines, and current-rule verification. |
| `references/calendar-template.md` | Building the week-by-week — the full T-4 → T+4 template, launch-day run-of-show, back-planning, compressed and major-tier variants. |
| `references/measurement.md` | Picking the north star, instrumenting, tagging links, first-party baselines, and the retro template. |
