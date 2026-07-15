# Specialist handoff contracts

The target project's `.landing-studio/run.yaml` is the handoff index. Every stage records its inputs, outputs, hashes, status, and approval. Files and browser artifacts outrank conversation summaries.

## Universal gate

A handoff passes only when:

1. required inputs exist and match their recorded hashes;
2. output is inspectable and owned by the named specialist;
3. factual claims map to the evidence ledger;
4. media maps to the asset-rights ledger;
5. new dependencies map to a dependency decision record;
6. the observable acceptance test ran and its artifact is recorded;
7. the receiving stage identifies no stale upstream dependency.

If a downstream stage exposes an upstream defect, return it to the owning stage. Do not patch strategy in CSS, copy in QA, rights in alt text, or browser failures in a written handoff.

## Page frame: `landing-research`

**Needs:** brand kit, repository and product evidence, audience/customer language, traffic promise, CTA destination, current primary sources, reference URLs, constraints.

**Returns:** page job, audience, awareness, thesis, proof/claim ledger, objections, unknowns, route/page queue, section queue, and success measure.

**Approval:** page frame and section queue. Missing product truth returns to the owner.

## Section direction: `creative-direction`

**Needs:** approved frame, active section job, brand assets, category/cultural reference research, proof, constraints.

**Returns:** three distinct territories, sourced principle ledger, originality/median test, cost/risk, and selected direction record.

**Approval:** one territory. Three cosmetic variants fail this gate.

## System: `landing-design-system`

**Needs:** approved frame/direction, real project tokens and components, licensed identity assets, accessibility target.

**Returns:** role-based tokens, type/grid/spacing, components, focus/motion/reduced-motion states, responsive contract, verified contrast evidence.

**Backflow:** brand conflict returns to the owner; missing interaction state stays here.

## Active-section design and copy

`landing-page-design` returns hierarchy, content/media slots, responsive behavior, CTA path, and measurable acceptance criteria for only the active section. `landing-copywriter` returns slot-labeled strings, proof IDs, metadata where relevant, caveats, alt/caption text, and destination message match.

Both require explicit production-input approval. Slot mismatch returns to design; evidence gaps return to research.

## Media: `media-sourcing`

**Needs:** exact media job, channels, audience, brand/generation policy, target sizes, territory, duration, and budget.

**Returns:** asset decision, source/local path, hash, creator, acquisition date, license snapshot, attribution, allowed channels, restrictions, model/property release status, territory/expiry, and generative provenance.

No ledger entry means no implementation. A source being publicly accessible is not permission.

## Dependencies: `technology-curator`

**Needs:** capability gap, target stack, existing utilities, bundle/runtime/security/license/browser constraints.

**Returns:** official-source comparison, measured proof, package/version, maintenance and license evidence, bundle/runtime impact, alternatives, failure modes, exit path, and adopt/reject decision.

No measured proof means a recommendation, not an approved dependency.

## Motion/video and 3D

`motion-video` returns editable source, deterministic or documented production path, renders, poster, reduced-motion/static equivalent, captions/transcript, rights record, placement review, and performance measurements.

`webgl-3d` returns purpose, selected lane, model/texture provenance, device/GPU budget, capabilities, context-loss behavior, keyboard/touch semantics, reduced-motion/static fallback, and browser evidence.

If the effect carries essential meaning unavailable in the fallback, the gate fails.

## Implementation

`landing-page-implementation` consumes only approved inputs and returns built code, project test/build evidence, route, primary journey wiring, implementation notes, and source mapping. It does not silently redesign or rewrite.

## Search, measurement, and browser QA

- SEO/AEO/GEO consume rendered/raw reality and current official engine guidance.
- CRO consumes the actual journey and existing privacy/analytics policy; replay/heatmaps require separate consent and data decisions.
- `landing-page-qa` returns the evidence manifest, screenshots, journey results, console/request logs, accessibility output, preferences, and traces.

Code review or a build cannot substitute for browser evidence.

## Independent red team

`landing-red-team` receives the approved truth and rendered result, then returns P0–P3 findings with exact evidence, user/business impact, violated constraint, owner, and reproducible acceptance test.

- P0/P1: block and return to the owner stage.
- P2: fix or obtain explicit recorded owner acceptance.
- P3: backlog is allowed.

The producing context cannot approve or downgrade its own finding.

## Approval and skip records

Every approval stores section/page ID, artifact hashes, approver, timestamp, decision, and note. Every skip stores capability/stage, reason, evidence, risk, substitute, and approver. "Not needed" is not sufficient evidence.
