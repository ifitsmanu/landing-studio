# Calendar template — T-4 → T+4, run-of-show, and back-planning

The calendar is derived, not brainstormed: fix T-0 (the launch date), walk
backward to derive every deadline, and walk forward to plan the echo. Weeks are
named relative to T-0 so the same template serves any date. Every line has an
owner; a calendar line without an owner is a wish.

## Contents

1. [The default window: T-4 → T+4](#the-default-window)
2. [Launch day — the run-of-show](#launch-day--the-run-of-show)
3. [Back-planning asset deadlines](#back-planning-asset-deadlines)
4. [Variants: compressed and major-tier](#variants)
5. [Worked example — Acme, filled](#worked-example--acme-filled)

## The default window

Each week ends at a **gate** — a named condition that must be true before the
next week's work starts. Gates are checked, not assumed; a slipped gate moves
T-0 (or cuts scope), it never silently compresses QA.

### T-4 — Decide
- Collect/confirm the brand kit + campaign extension; batch all open questions.
- Write the dated campaign brief: objective + north star, ICP + attention map,
  channel mix with roles and the "not doing" list, draft calendar, asset list.
- Write the message house and compression ladder (`references/messaging.md`).
- **Gate: brief and message house approved by the owner. Wording frozen.**

### T-3 — Produce
- Route every asset to its owner: film to `motion-video` (approve its beat
  sheet this week — cutdown plan included), page structure/copy to
  `landing-page-design` / `landing-copywriter`, tokens to
  `landing-design-system`; human-owned assets (founder posts, press kit)
  drafted.
- Build the press/newsletter list and the community plan (venues, who posts,
  what standing they have). Write the objection map.
- Draft the announcement post (essay rung) — it needs the most revision time.
- **Gate: every asset in production with an owner and a deadline; press kit
  drafted; no asset unowned.**

### T-2 — Assemble
- Landing page final: copy frozen, `seo-audit` / `aeo-audit` / `geo-audit`
  passes run, OG card designed and tested in real feed previews.
- Film locked; cutdowns rendering (hero loop, feed cuts, bumper).
- Email drafted, rendered across clients, subject line chosen from hook
  candidates.
- Press/newsletter pitches sent (embargo for T-0, or the exclusive placed).
- Founder posts drafted per poster, in their own voice, from the ladder.
- **Gate: page live-able, film delivered, email ready, pitches out.**

### T-1 — Rehearse
- Instrument: analytics events for the north star and funnel, UTM scheme
  applied to every link, dashboard built and showing test traffic
  (`references/measurement.md`).
- QA sweep from SKILL.md's gate: CTA sweep, message-match sweep, standalone
  test, claims traceability, kit conformance.
- Schedule what can be scheduled (email send, some posts); pre-position what
  can't (community posts must be posted live by humans).
- **Dry run** the run-of-show: walk every step with its owner; every step has
  a fallback and a "who fixes it if it breaks" name.
- **Gate: dashboard shows the north star; dry run surfaced no unowned step.
  If not — T-0 moves. Launching blind is the one unrecoverable error.**

### T-0 — Launch
Execute the run-of-show (below). Everyone's only job is the launch: founders
respond in threads, someone watches the dashboard and error logs, someone owns
each channel.

### T+1 — Echo
- Ship the first echo wave: behind-the-scenes/build-story post, feed cutdowns
  of the film, thank-you + responses in every venue that picked it up.
- Press follow-ups to non-responders (once, briefly, with day-one proof if the
  numbers are ledger-worthy).
- First measurement review (H+4 was launch-day; this is D+1 — see
  `references/measurement.md`).

### T+2 / T+3 — Resurface
- One new angle per week, each expressing a different message-house pillar:
  first-user proof, a use-case walkthrough, the "what people asked" post
  answering real launch-day questions.
- Optional echo email (different pillar, honestly framed).
- Paid amplification of the proven organic winner only, if budgeted.

### T+4 — Close
- Retro against the north star (template in `references/measurement.md`).
- Hand off compounding channels: the announcement post and page to the
  SEO/AEO/GEO maintenance loop, community presence to whoever owns it
  permanently.
- Archive the brief with actuals filled in — the next launch starts from it.

## Launch day — the run-of-show

Hour-by-hour, relative to **H** (the go moment — pick it for the ICP's morning
in their dominant timezone). Order is load-bearing: owned surfaces go live
before anything drives traffic at them; the highest-intent audience (the list)
hears first; borrowed and earned channels fire once there's somewhere to land.

| Time | Step | Owner | Fallback |
|---|---|---|---|
| H−2:00 | Page + announcement post live (unlinked); analytics events verified with a real click-through; film unlisted-published and embedded | eng/page owner | Fix before proceeding — nothing fires until green |
| H−1:00 | Final QA pass on live URLs (CTA sweep, message match, OG card render); dashboard on a screen | campaign owner | Same |
| **H** | Email to the owned list | email owner | Resend tool fallback documented at T-1 |
| H+0:30 | Founder posts on borrowed channels (X, LinkedIn), film public on YouTube | each founder | Pre-drafted posts; a second poster ready |
| H+1:00 | Community posts by the humans with standing (Show HN, PH, Slack/Discord) — live, not scheduled | named posters | Skip a venue rather than post from a weak account |
| H+1 → EOD | Named response owners cover approved channels; quote/reshare real reactions (never astroturf); watch error logs and page performance | response owners | Objection map is the script |
| H+4:00 | First numbers check against mechanical QA and first-party baselines — catch breakage, not judge success | measurement owner | Fix-forward list |
| EOD | Day-one snapshot written into the brief; tomorrow's echo wave confirmed | campaign owner | — |

Embargoed press lifts at H by prior agreement — coordinate the hour in the
pitch. If anything upstream of H fails, the whole show slips together; a launch
where the email points at a 404 is worse than a launch delayed three hours.

## Back-planning asset deadlines

Deadlines are derived from T-0 by subtracting integration time — the time the
asset needs *after* it's "done" (embedding, QA, scheduling, rendering across
clients/feeds). Defaults:

| Asset | Done by | Why then |
|---|---|---|
| Campaign brief + message house | end T-4 | Everything quotes it |
| Film beat sheet approved | early T-3 | Longest production chain in the campaign |
| Announcement post draft | end T-3 | Needs the most revision cycles |
| Press kit + pitches | end T-3 / sent T-2 | Journalists need lead time; embargoes need agreement |
| Film master | mid T-2 | Cutdowns render after; page embeds it |
| Page copy frozen | mid T-2 | SEO/AEO/GEO passes and QA need a stable target |
| Email final | end T-2 | Client-rendering QA + scheduling |
| Cutdowns, OG card, thumbnails | end T-2 | Derived assets; masters must exist first |
| Founder posts drafted | end T-2 | T-1 is for rehearsal, not writing |
| Instrumentation + dashboard | mid T-1 | The T-1 gate depends on it |
| Echo-wave assets (T+1 set) | by T-0 | The echo is planned, not improvised — day-one energy goes to responding, not producing |

## Variants

**Compressed (2-week) window** — for `standard`/`minor` tiers or hard dates:
merge T-4/T-3 into week one (decide + produce; the message house still freezes
before production — that ordering is the non-negotiable core), merge T-2/T-1
into week two (assemble + rehearse; the T-1 gate is never cut), echo runs
T+1 → T+2, retro at T+2. What shrinks is asset count (film may become a single
screen-capture demo clip; press drops to one or two newsletters), never the
gates.

**Major tier** — a new product or company moment: stretch to T-6 with the
extra weeks going to production (a fuller film, named-customer proof, real
press relationship-building) and consider a **teaser beat** at T-1 (a designed
hint from a founder account — only if the product will visibly deliver on it;
teasers write checks the launch must cash). Multi-announcement "launch weeks"
(one theme, one announcement per day) are a major-tier pattern: each day gets a
mini run-of-show, the message house gets one pillar per day, and the week
shares a single north star.

## Worked example — Acme, filled

Six weeks out, tier major, T-0 chosen from the ICP's actual inbox rhythm,
seasonality, time zones, support coverage, and prior campaign evidence.

- **T-4**: brief approved (objective: 400 activated workspaces by T+14;
  guardrail ≥35% activation). Message house frozen ("Answers, not
  dashboards." + three pillars). Channels: page, email, founder X + LinkedIn,
  YouTube film, HN + one data community. Not doing: cold press (two data
  newsletters instead), TikTok, paid-at-launch.
- **T-3**: `motion-video` beat sheet approved (60s master; hero loop, two 30s
  cuts, 6s bumper planned at beat-sheet time). Page routed to design/copy
  siblings. Announcement post drafted. Newsletter list (2 targets) + pitch
  drafted; objection map written ("training on my data?", "vs. the SQL I
  have?").
- **T-2**: page copy frozen; `seo-audit` + `aeo-audit` passes; film master
  delivered, cutdowns rendering; email rendered and scheduled-ready; pitches
  sent with T-0 embargo; both founders' posts drafted in their own voices.
- **T-1**: UTM scheme applied; dashboard live (visits → signup → activation by
  channel); QA sweep green; dry run held — gap found (nobody owned the HN
  thread after 14:00) and fixed.
- **T-0** (H = 09:00 ET): 07:00 page + post live, events verified; 09:00 email
  to 3,200; 09:30 founders post with the 30s cut; 10:00 Show HN by the founder
  with standing, named response coverage; 13:00 first numbers check — qualified sessions
  fine, X clip out-performing, one newsletter published early (fine, embargo
  was soft).
- **T+1**: build-story post + second 30s cut; HN thread wrap-up answers folded
  into the page FAQ; D+1 review.
- **T+2/T+3**: first-user proof post (ledger-traced quote); echo email
  (pillar 2: anomaly detection) to non-openers; small paid boost of the
  winning X clip within budget.
- **T+4**: retro — north star 370/400 at T+14 (guardrail held at 38%), biggest
  driver the HN thread, weakest LinkedIn (hook rewrites for next time);
  page + post handed to the SEO loop; brief archived with actuals.
