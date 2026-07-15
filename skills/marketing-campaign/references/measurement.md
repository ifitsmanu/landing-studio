# Measurement — north star, instrumentation, baselines, retro

Measurement exists to answer three questions: is the campaign working (north
star), where is it working (per-channel funnel), and what breaks the tie next
time (retro). Instrument *before* launch — a campaign measured after the fact
is a story, not a result. Use dated first-party baselines and mechanical QA to
detect breakage; generic benchmarks are context only, never targets.

## Contents

1. [Choosing the north star](#choosing-the-north-star)
2. [The funnel and guardrails](#the-funnel-and-guardrails)
3. [Instrumentation checklist (pre-T-0)](#instrumentation-checklist)
4. [UTM discipline](#utm-discipline)
5. [Baselines and breakage checks](#baselines-and-breakage-checks)
6. [Review cadence](#review-cadence)
7. [Attribution honesty](#attribution-honesty)
8. [The retro (T+4)](#the-retro-t4)

## Choosing the north star

One metric, a number, a date — derived from the kit's CTA, one step *deeper*
than the click. The click is an intention; the star is the intention surviving
contact with the product. Choosing the shallow metric optimizes the campaign
toward traffic that bounces.

| CTA shape | Shallow metric (avoid) | North star (use) |
|---|---|---|
| Start free / sign up | Signups | **Activated** signups by T+14 — activation = the product's first-value action, defined per product (ran a query, created a project, invited a teammate) |
| Book a demo / talk to us | Demos booked | Demos **held** (or qualified opportunities) by T+14 |
| Join the waitlist | Emails collected | Waitlist joins from the **ICP** (qualifying question on the form) by T+7 |
| Buy / subscribe | Checkout starts | Completed purchases by T+14 |
| Install / download | Downloads | Installs **active on day 7** |

Setting the number: anchor on the owned-audience inventory and the sanity
ranges below — e.g., list size × email CTR × page conversion × activation rate
gives the owned-channel floor; borrowed and earned channels are upside on top.
A number derived this way is defensible; a round number pulled from ambition is
the first thing the retro will quietly delete.

The date matters: T+14 (not launch day) captures the echo and keeps the team
from judging the campaign by the H+4 spike.

## The funnel and guardrails

Instrument the whole path so failures localize:

```
impressions → clicks (per channel, via UTM) → page sessions → CTA clicks
→ conversions (CTA completed) → north star (one step deeper)
```

Each arrow is a rate; when the star lags, the funnel says *which* arrow broke —
a hook problem (impressions→clicks), a message-match/page problem
(sessions→CTA), or a product problem (conversion→star). Fixing the wrong stage
wastes the window.

**Guardrails** — one or two metrics that must not degrade while the star is
chased, chosen for the failure mode the star invites:

- Star = volume of activations → guardrail = activation **rate** (catches
  wrong-audience traffic spikes).
- Star = waitlist joins → guardrail = ICP share of joins.
- Always-on guardrails: unsubscribe rate on the list (the list outlives the
  launch), and page performance (a launch-day traffic spike that slows the
  page silently taxes every channel at once).

## Instrumentation checklist

All items green before the T-1 gate; the run-of-show does not fire otherwise.

- [ ] Analytics on the page (any stack — the skill assumes nothing) with
      events for: page session, CTA click, conversion, and the north-star
      action. Each verified with a **real click-through**, not an assumption.
- [ ] UTM parameters preserved through the funnel (not stripped by redirects,
      consent flows, or the signup handoff) — verified end-to-end once.
- [ ] One dashboard: the north star vs. target, the funnel by channel, the
      guardrails. Built at T-1, visible to the whole team, checked from a
      phone (that's where launch-day checking happens).
- [ ] "How did you hear about us?" — one open-text field at conversion (see
      [Attribution honesty](#attribution-honesty)).
- [ ] Error/uptime monitoring on the page and signup path with an alert owner
      named in the run-of-show.
- [ ] The claims ledger has a row for any *campaign* number the team plans to
      publish later ("10,000 signups in week one") — day-one numbers become
      marketing claims and inherit the same discipline.

## UTM discipline

One scheme, written in the brief, applied to every link the campaign publishes.
Consistency beats cleverness — analysis dies on `Twitter` vs `twitter` vs `x`.

```
utm_source   = the channel:  email | linkedin | x | youtube | hn | producthunt |
               <newsletter-name> | <community-name>   (lowercase, no spaces)
utm_medium   = the relationship: owned | borrowed | earned | paid
utm_campaign = launch-<product-slug>-<yyyymm>          (one value, whole window)
utm_content  = the asset: announce-email | founder-post-1 | film-30s-a |
               echo-email | ...                          (distinguishes assets
               within a channel — this is what makes "which asset won" answerable)
```

Rules: tag every outbound link including "obvious" ones (untagged = invisible =
misattributed to direct); never tag internal page-to-page links; keep a link
manifest (asset → full URL) in the brief so QA can sweep it mechanically;
shorten links only through a domain you control.

## Baselines and breakage checks

Use first-party baselines from the same account, audience, format, offer, and
measurement definition. Record date range, numerator, denominator, sample size,
and known tracking gaps. If no comparable baseline exists, label the launch as a
baseline-building run and use mechanical QA plus predeclared guardrails. External
benchmarks may provide context only when their methodology, cohort, and date are
available; they never prove a link, creative, or audience is broken.

When a metric changes, check the observable chain before assigning cause:
delivery/rendering → link and attribution → landing message match → CTA/form
journey → audience/offer. A channel metric alone cannot identify which link failed.

## Review cadence

Four looks, each with a distinct question — resist re-litigating strategy at
every glance:

- **H+4 (launch day)** — *is anything broken?* Links, events, page speed,
  deliverability. Fix-forward only; no strategy changes on four hours of data.
- **D+1** — *which channels are alive?* First real read of funnel-by-channel;
  confirm the echo wave's targeting (put T+1 energy where D+1 shows life).
- **D+7** — *is the star on trajectory?* Compare to the owned-channel floor
  math; decide the T+2/T+3 resurfacing emphasis and any paid boost of a
  proven winner.
- **T+4 — the retro** (below) — *what's true, and what breaks the tie next
  time?*

## Attribution honesty

Click attribution systematically lies at the edges, and launches live at the
edges: dark social (links pasted in DMs and Slack strip nothing but context),
podcast/word-of-mouth hops, cross-device journeys, and press reads that
convert days later as "direct." So:

- When appropriate, compare UTM/analytics with a voluntary, accessible
  "How did you hear about us?" field. Each has different missingness and bias;
  divergence is a prompt to investigate, not a fixed multiplier.
- Don't chase multi-touch modeling inside a launch window; the volume can't
  support it and the window ends before the model converges.
- Report honestly: "X activations, of which Y click-attributed, Z
  self-reported HN" — not a single confident pie chart the data can't back.

## The retro (T+4)

One page, written by the campaign owner, filed with the brief. Its job is to
convert the launch into defaults for the next one — the retro is where channel
choices, hook styles, and calendar durations stop being guesses.

```markdown
# <Brand> launch retro — YYYY-MM-DD
North star: <target> → <actual> (<hit|miss>) · Guardrails: <held|breached>

## What the funnel says
Per channel: impressions → clicks → sessions → conversions → star contribution
(UTM table + self-reported table, side by side, divergences noted)

## Three things that worked (with evidence — keep as defaults)
## Three things that didn't (with the broken funnel arrow — change or cut)
## One thing we'd bet differently next launch
## Claims published during the window (all ledger-traced? any corrections owed?)
## Handoffs completed (SEO/AEO/GEO loop, community ownership, paid follow-on?)
```

The discipline that makes retros honest: every "worked/didn't" line cites a
number from the dashboard or a quote from the field — no vibes; and misses are
attributed to decisions ("we chose LinkedIn for reach it doesn't have for this
ICP"), not to the weather ("the algorithm changed").
