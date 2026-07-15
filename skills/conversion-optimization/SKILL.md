---
name: conversion-optimization
description: >-
  Ethical conversion-rate optimization for a landing page: define the funnel,
  inspect first-party analytics, create a tracking plan, configure consent-aware
  events, use heatmaps or session replay safely, diagnose scroll and CTA behavior,
  and design measurable experiments with guardrails. Use when the user mentions
  CRO, conversion, heatmaps, scroll depth, recordings, attention, click behavior,
  A/B tests, funnels, analytics, attribution, CTA performance, or improving a live
  landing page from evidence. Never invent behavioral conclusions or use deceptive
  dark patterns. Works with the project's existing analytics stack first.
---

# Conversion Optimization

Replace opinion with a privacy-aware measurement loop. A heatmap is aggregated interaction data,
not eye tracking. Scroll depth is exposure, not comprehension. A click is not a qualified outcome.

## Boundaries

- Do not install trackers, start recordings, change consent behavior, or launch an experiment
  without authorization for that change and a documented project privacy basis.
- Do not record passwords, payment data, health data, message content, or unrestricted free text.
- Do not use fake scarcity, confirmshaming, hidden costs, preselected consent, misleading controls,
  disguised ads, or message mismatch to manufacture clicks.
- Do not call a variant a winner from a directional dashboard, tiny sample, peeking, or a novelty
  spike. When traffic cannot support an experiment, use research and sequential improvements.

## Inputs

Read `brand-kit.md`, the discovery brief, current page, campaign promise, analytics/consent docs,
existing event taxonomy, historical baseline, and the post-click journey. Use the existing analytics
and experimentation stack when it can answer the question. Do not add multiple tools with overlapping
purpose by default.

## Step 1: define the conversion system

Write the funnel from qualified arrival to business outcome. At minimum distinguish:

1. eligible page view;
2. meaningful CTA exposure;
3. CTA activation;
4. destination/form start;
5. successful completion;
6. downstream qualified outcome where available.

Name one north-star conversion and 2–4 guardrails such as lead quality, completion errors, page
performance, opt-out rate, refund/cancellation, or sales acceptance. Segment only by dimensions with
a decision attached: channel, campaign, device class, geography, new/returning, or audience route.

## Step 2: audit measurement quality

Verify event definitions in source and in a real browser. Check duplicate firing, SPA navigation,
bot/internal traffic, cross-domain attribution, consent state, UTM persistence, referrer loss,
identity stitching, form success semantics, timezone, and dashboard filters. A dashboard built on
bad events is not a baseline.

Preserve the project's naming convention. If none exists, propose a compact semantic taxonomy such
as:

```text
landing_view
primary_cta_exposed
primary_cta_clicked
form_started
form_error
form_submitted
conversion_completed
```

Each event definition needs trigger, properties, exclusions, consent category, owner, and a browser
verification step. Do not capture raw form values.

## Step 3: use behavioral tools for diagnosis

Choose the smallest tool path:

- product/web analytics for funnel size and segments;
- click and scroll heatmaps for aggregate interaction/exposure patterns;
- session replay for diagnosing specific friction states;
- short surveys or interviews for motivation and comprehension;
- usability tests for task-level evidence.

If a maintained all-in-one product already covers analytics, replay, heatmaps, flags, and experiments,
prefer its native integration. A lightweight heatmap/replay product can be appropriate when the
project only needs qualitative diagnosis. Verify current official privacy, masking, regional hosting,
consent, retention, and pricing documentation at implementation time.

Mask sensitive elements by default, exclude authenticated or sensitive routes unless explicitly
approved, define retention, honor consent and opt-out, restrict access, and test the recording itself.
“Privacy ready” vendor marketing does not prove the project's compliance.

## Step 4: turn observations into hypotheses

Use this form:

> Because **[evidence]**, we believe **[specific change]** for **[segment]** will improve
> **[primary metric]** without harming **[guardrails]**. We will know by **[decision rule]**.

Tie each hypothesis to one diagnosed mechanism: message mismatch, comprehension, insufficient proof,
friction, anxiety, discoverability, accessibility, performance, or destination mismatch. “Make it
more exciting” is not a mechanism.

## Step 5: choose the validation method

- Use an A/B test only when concurrent traffic and conversions can support a predeclared decision.
- Use a holdout for risky funnel or attribution changes.
- Use moderated/unmoderated usability work for comprehension and task failures.
- Use a before/after release with explicit confounders when traffic is low.
- Ship obvious defects directly; broken forms do not need experiments.

For experiments, predeclare unit of randomization, eligibility, primary metric, guardrails, minimum
detectable effect or practical decision threshold, duration constraints, and stop rule. Monitor sample
ratio mismatch and instrumentation health. Change one causal idea per variant even if several files
are involved.

## Output contract

Create `CRO-PLAN.md` with:

1. funnel and business outcome;
2. measurement audit and confidence;
3. event/data-layer specification;
4. privacy, consent, masking, access, and retention controls;
5. observed behavior by segment, with evidence links;
6. prioritized hypotheses;
7. experiment or validation cards;
8. dashboard and QA plan;
9. decision log: ship, test, investigate, or reject.

When implementation is authorized, also produce the smallest project-native tracking change and a
machine-readable tracking plan using the project's established format.

## Gate

Pass when the conversion event is verified end to end, sensitive data is excluded, consent behavior
matches policy, each conclusion is traceable to evidence, and every proposed change has a decision
rule. Traffic quantity never upgrades weak evidence into certainty.
