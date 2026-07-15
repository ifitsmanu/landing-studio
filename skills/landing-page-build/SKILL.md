---
name: landing-page-build
description: >-
  Orchestrate a complete production landing page from research through browser
  verification. Use whenever the user asks to build, rebuild, launch, or deeply
  improve a whole landing page, homepage, product page, or campaign page rather
  than one isolated section. Coordinate the Landing Studio skills: evidence and
  project research, design system, page design, copy, optional motion, production
  implementation, SEO/AEO/GEO, ethical conversion measurement, browser QA, and a
  final quality gate. Preserve project conventions, require approval at strategy,
  page-structure, and copy gates, and never silently skip an unavailable stage.
---

# Landing Page Build

Own the sequence, artifacts, approval gates, and release decision. Route specialist work to the
corresponding skill instead of creating a shallow inline substitute.

The goal is a truthful, differentiated, production page with a verified conversion path. Visual
quality, search visibility, AI retrieval, motion, and traffic are supporting systems, not excuses to
weaken the product evidence or user experience.

## Packet map

| Stage | Skill | Artifact |
|---|---|---|
| 0 | `landing-research` | `LANDING-BRIEF.md`, `EVIDENCE-LEDGER.md` |
| 0a, launch work only | `marketing-campaign` | approved dated campaign brief and message house |
| 1 | `landing-design-system` | tokens, components, specimen, system notes |
| 2 | `landing-page-design` | approved section and responsive specification |
| 3 | `landing-copywriter` | approved copy deck and claims ledger |
| 4 | `motion-video` | optional hero/live motion, film, poster, and cutdowns |
| 5 | `landing-page-implementation` | built route and `IMPLEMENTATION-NOTES.md` |
| 6 | `seo-audit`, `aeo-audit`, `geo-audit` | prioritized, current visibility findings |
| 7 | `conversion-optimization` | tracking, privacy, funnel, and experiment plan |
| 8 | `landing-page-qa` | browser evidence and release recommendation |
| 9 | this skill | final quality-gate decision and handoff |
| after release readiness, launch work only | `marketing-campaign` | campaign activation, monitoring, and retro |

If a sibling skill is unavailable, say so and produce the minimum artifact that preserves its
contract. Record reduced depth in the final handoff. Never silently claim a stage ran.

## Stage selection

Run the full workflow for a new page or material repositioning. Adapt it when evidence supports a
smaller path:

- Existing current research may satisfy stage 0 after source and date validation.
- Skip motion when it does not prove the product, harms performance, or has no approved asset/claim.
- A static low-traffic page still needs a conversion definition, but not necessarily an A/B test.
- An audit-only request must not authorize implementation.
- A section-only request routes directly to the relevant specialist skill.
- A live page with reliable data may begin at CRO, then return to the owning design/copy stage.
- A dated launch or paid campaign runs `marketing-campaign` during Stage 0, before page structure or
  copy freezes. Evergreen page work may skip it.

Write the selected stages and reasons before work begins. A skipped stage is a decision, not an
omission.

## Stage 0: canonical input and discovery

Read the project-root `brand-kit.md` using the packet's `brand-kit.template.md` field names. Inspect
repository instructions and the real project before asking questions. `landing-research` then builds
the discovery brief and evidence ledger from project docs, product behavior, customer language,
traffic context, current primary sources, competitors, and reference pages.

Batch only the unresolved questions that materially affect audience, claim, CTA, architecture,
privacy, legal position, or cost. Never invent a CTA destination, product capability, customer name,
number, comparison, testimonial, or compliance claim.

### Strategy approval gate

Get approval for the page job, primary audience, traffic promise, thesis, primary CTA path, strongest
proof, and explicit unknowns. Changing these after design and copy compounds rework.

For launch work, run `marketing-campaign` now and approve its objective, message house, channel roles,
measurement plan, and `constraints.launch_date` before design production begins. Page, campaign, and
motion then share one traffic promise and evidence set. Activation waits until Stage 9 clears release.

## Stage 1: design system

Run `landing-design-system` against the kit, current project tokens, and approved brief. Prefer the
project's existing system. The output defines reusable roles for color, type, spacing, layout,
components, focus, motion, responsive behavior, and media.

Gate on verified contrast, licensed/supplied assets, meaningful roles, and no hardcoded client values
outside the kit or generated artifacts.

## Stage 2: page design

Run `landing-page-design` with the brief, evidence ledger, design system, traffic context, and primary
journey. Compose the smallest argument that answers the audience's real objections. The hero must
communicate product, audience relevance, proof direction, and next action without requiring motion.

Section order is a hypothesis informed by evidence. Put decisive proof early, but do not assert a
universal scroll-decay percentage. Define responsive behavior and copy budgets per slot.

### Page-structure approval gate

Get approval for hierarchy, section order, hero mechanism, proof placement, CTA path, responsive
composition, and any motion slots.

## Stage 3: copy

Run `landing-copywriter` with the approved page spec, customer language, voice rules, traffic promise,
and evidence ledger. Every factual public claim stays traceable. Preserve message match between the
source channel, landing promise, CTA label, and destination.

### Copy approval gate

Get approval for final page strings, metadata, legal/disclaimer text, and every proof item. Mark draft
or unresolved language explicitly; it cannot become production truth through implementation.

## Stage 4: motion and media

Run `motion-video` when motion has a defined job such as demonstrating the product, compressing a
workflow, creating a launch asset, or increasing comprehension. Select the production lane based on
the brief and project constraints: live web motion, deterministic product capture, programmatic video,
traditional post-production, or approved generative footage.

Require a working poster/static state, reduced-motion equivalent, visible labels for simulated or
time-compressed material, source traceability, licensed assets, and a performance budget. Do not let
motion carry essential meaning alone.

## Stage 5: implementation

Run `landing-page-implementation`. It owns production code and must inspect repository rules, reuse
existing components and libraries, preserve unrelated changes, build on the project's stack, and wire
the real CTA/form journey. With no project stack, semantic static HTML/CSS is the fallback.

Gate on a successful project-appropriate build, direct route rendering, real approved content,
responsive behavior, keyboard/reduced-motion basics, runtime health, and a functional conversion path
or a named external blocker.

## Stage 6: search and answer visibility

Run `seo-audit`, `aeo-audit`, and `geo-audit` on rendered reality. Apply their scopes carefully:

- SEO owns crawlability, indexing, canonicalization, metadata, internal links, Core Web Vitals, and
  search intent.
- AEO owns human answer clarity and structured data that current consumers actually support.
- GEO owns multi-engine retrieval, citation baselines, crawler posture, entity consistency, and
  corroboration. It does not invent special Google ranking hacks.

Verify current engine documentation at audit time. Apply authorized P0/P1 fixes and rerun the failed
checks.

## Stage 7: conversion measurement

Run `conversion-optimization` to define and verify the funnel, events, consent behavior, privacy
controls, segments, dashboards, and evidence-based hypotheses. Use the existing analytics stack first.
Heatmaps and session replay are optional diagnostic tools, not automatic dependencies or proof of
attention.

Do not launch tracking, recording, or experiments without the necessary authorization and privacy
decision. Low traffic may justify qualitative validation instead of an A/B test.

## Stage 8: browser QA

Run `landing-page-qa` in a real browser across representative desktop/mobile engines, widths, input
methods, and preferences. Exercise the primary journey, forms, links, media, motion, accessibility,
performance, raw HTML, metadata, analytics, consent, console, and network health. Attach screenshots,
traces, logs, or test output.

Fix and rerun every authorized P0/P1 case. Code inspection and a passing build are not substitutes for
rendered verification.

## Stage 9: quality gate

Use `references/quality-gate.md` and return exactly one decision:

- `SHIP`: zero open P0/P1 findings; primary conversion verified; approvals and evidence complete.
- `CONDITIONAL`: zero open P0/P1 findings, but a named non-blocking external dependency or accepted P2
  risk remains with owner, mitigation, and deadline.
- `BLOCK`: any material false claim, privacy/security issue, broken primary journey, inaccessible core
  path, unavailable page, or unresolved P0/P1.

The final handoff includes:

1. route and environment;
2. approved thesis and CTA;
3. artifacts and code changed;
4. tests/audits run with results;
5. open risks, owners, and deadlines;
6. measurement baseline and first review date;
7. deliberately skipped stages and reasons;
8. launch activation/retro status when `marketing-campaign` is in scope.

## Quality principles

- Show real product evidence before adding ornamental persuasion.
- Treat one clear primary CTA as a strong default, not an inviolable law; complex buying journeys may
  need a visibly subordinate secondary path.
- Treat headline length, page length, scroll behavior, and motion timing as context-dependent
  constraints to verify with the audience and data.
- Optimize for comprehension and qualified action, not raw clicks.
- Avoid dark patterns and misleading hooks. The strongest hook is specific, true, and fulfilled by the
  page.
- Keep all machine-facing content consistent with visible human-facing content.

## Reference index

| File | Read when |
|---|---|
| `references/brand-kit.md` | Collecting or resolving the canonical shared input and evidence rules. |
| `references/handoffs.md` | Verifying specialist artifacts at stage boundaries. |
| `references/quality-gate.md` | Running the final release decision. |
| `references/acme-example.md` | Needing a worked pipeline example; treat old field names as illustrative only. |
