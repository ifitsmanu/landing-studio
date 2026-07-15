# Generative visibility measurement

Measure presence, source, accuracy, referral, and outcome separately. Generated answers vary by time,
surface, model/mode, locale, account state, and prompt history; a single run is an observation, not a
stable score.

## Panel construction

Build prompts from actual buying and support evidence. Include only relevant classes:

- brand/entity definition;
- category discovery without the brand name;
- use case or problem;
- comparison/alternatives;
- price, security, eligibility, or integration;
- implementation/process;
- correction probes for known misinformation.

Preserve natural language from sources. Label hypothetical prompts. Keep a stable core panel for
longitudinal comparison and version new/retired prompts rather than silently rewriting history.

## Run record

For every observation capture:

```markdown
| Field | Value |
|---|---|
| Panel version | |
| Run ID and timestamp | |
| Surface/product | |
| Model/mode, if shown | |
| Locale/account state | |
| Exact prompt and prior context | |
| Exact answer or evidence path | |
| Brand mentioned | yes/no |
| Owned URL cited/linked | URL/no |
| Other cited URLs | |
| Material facts correct | yes/no/unclear + notes |
| Recommendation context | |
| Follow-up tested | |
```

Repeat important prompts across clean sessions. Report counts and variance. Do not automate a surface
in violation of its terms; use official APIs or authorized tools where available.

## Metrics

Use denominators and raw counts:

- **presence rate:** prompts where the brand appears / eligible prompts;
- **owned-source rate:** prompts linking or citing an approved owned URL / eligible prompts;
- **accuracy rate:** checked material claims judged correct / checked claims;
- **relevance rate:** appearances matching the intended audience/use case / brand appearances;
- **competitor presence:** per named competitor, not one opaque share-of-voice number;
- **source concentration:** cited domains/URLs and their prompt classes;
- **error inventory:** exact stale, false, ambiguous, or conflated statements.

These describe the panel, not the whole market. Never imply statistical precision the sample and
surface variability do not support.

## Referral and outcome

Where observable, preserve vendor/referral UTMs and classify generative-search traffic using actual
analytics evidence. OpenAI documents `utm_source=chatgpt.com` for ChatGPT search referrals; verify
current behavior and do not invent equivalent parameters for other vendors.

Track:

- sessions and landing pages;
- engaged or qualified visits;
- primary CTA exposure/click;
- completed conversion and downstream quality where available;
- assisted/self-reported discovery only with carefully worded forms and known bias;
- branded-query movement as a correlated signal, not proof of causation.

Preserve consent and privacy requirements. Do not fingerprint or capture prompt content from users
without a valid project basis.

## Log evidence

Crawler logs can confirm access, status, paths, rate limits, and recency. They do not prove a page was
indexed, used in an answer, or influenced a model. Verify official IP/host guidance when attributing
requests; a user-agent string alone is weak evidence.

## Change annotations

Maintain a timeline of content releases, crawler/WAF changes, canonical migrations, campaign events,
engine/model changes, and panel versions. Without annotations, a before/after chart invites false
causality.

## Cadence

Choose cadence by business value and volatility:

- rerun affected prompts after a material correction or launch;
- review high-drift facts on their operational schedule;
- run broader panels monthly or quarterly only when someone will act on the result;
- reverify crawler documentation before access recommendations;
- retain raw observations so metric definitions can be audited.

## Decision standard

Every backlog item names the evidence, expected mechanism, target surface, owner, cost, risk, and
verification. Prefer fixing material inaccuracies and access failures before publishing speculative
“GEO content.” Success is a more accurate, useful, measurable customer journey, not an arbitrary GEO
score.
