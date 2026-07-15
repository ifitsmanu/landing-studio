# Landing Studio handoff contracts

Each stage writes files in the target project so the next stage reads approved artifacts rather than
conversation memory. Use project conventions for artifact locations; record the paths in the final
handoff.

## Contract rule

A stage passes only when its required inputs exist, its output is reviewable, and its gate has
evidence. If a downstream stage exposes an upstream defect, return it to the owning stage and rerun
affected approvals/tests. Do not patch strategy in CSS, copy in QA, or privacy policy in analytics
code.

## Stage 0: `landing-research`

**Needs:** project-root `brand-kit.md`, repository/docs, product access/material, traffic context,
customer evidence, current primary sources, and reference URLs.

**Returns:** `LANDING-BRIEF.md`, `EVIDENCE-LEDGER.md`, current asset inventory, thesis/CTA
recommendation, unknowns and risks.

**Gate:** page job, audience, traffic promise, primary conversion, approved evidence, competitors,
and material unknowns are explicit. Strategy approval recorded.

**Backflow:** missing product truth or authority decision returns to the project owner, not design.

## Stage 0a: `marketing-campaign` for dated launches

**Needs:** approved landing brief, `constraints.launch_date`, evidence ledger, audience/traffic context,
owned-channel inventory, people, budget, and channel constraints.

**Returns:** approved dated campaign brief, message house, channel roles, asset/owner plan, measurement
scheme, and run-of-show. Production remains with the relevant copy/design/motion skills.

**Gate:** objective, primary audience, traffic promise, CTA, evidence, launch date, channel roles,
measurement, and prohibited tactics are aligned before page or campaign production begins.

**Backflow:** positioning/evidence conflicts return to research; launch timing/ownership conflicts return
to the project owner. Campaign activation waits for Stage 9 release readiness.

## Stage 1: `landing-design-system`

**Needs:** approved brief, canonical kit, project tokens/components/assets, accessibility target.

**Returns:** role-based tokens, typography/grid/spacing, component and motion rules, specimen or
equivalent implementation reference.

**Gate:** real licensed/supplied identity assets, verified contrast pairs, complete interactive
states, responsive rules, no unnecessary replacement of the project system.

**Backflow:** identity conflicts return to kit/project owner; missing component behavior remains here.

## Stage 2: `landing-page-design`

**Needs:** brief, evidence ledger, system, traffic/awareness context, primary journey, real media.

**Returns:** page/section spec, hero mechanism, proof/objection sequence, CTA map, responsive behavior,
motion/media slots, copy budgets.

**Gate:** each section has a distinct user/job function; hero works statically; proof order is
defensible; primary path is clear; mobile is composed intentionally. Page-structure approval recorded.

**Backflow:** unsupported claims return to research; token gaps return to design system.

## Stage 3: `landing-copywriter`

**Needs:** approved page spec, kit/voice, evidence ledger, customer language, traffic promise, CTA.

**Returns:** slot-labeled copy deck, metadata drafts, alt/caption text, proof IDs and legal notes.

**Gate:** every factual claim is traceable; required caveats are present; message match reaches the
destination; no placeholder/fabricated proof; copy approval recorded.

**Backflow:** slot/word-fit conflicts return to page design; evidence gaps return to research.

## Stage 4: `motion-video` when justified

**Needs:** motion brief inputs, approved claim/CTA, page placement, tokens, real assets/access, rights,
generation policy, performance budget.

**Returns:** brief, concepts, beat sheet/storyboard, source project, approved render/embed, poster,
reduced-motion state, captions/transcript, cutdowns, delivery notes.

**Gate:** product/claim accuracy, rights/privacy, static/reduced-motion equivalence, final-size
legibility, native-placement review, reproducible production, page performance fit.

**Backflow:** false/unprovable beat returns to research/copy; infeasible slot returns to page design.

## Stage 5: `landing-page-implementation`

**Needs:** all approved artifacts, target route, repository rules, project stack and acceptance tests.

**Returns:** production code/assets, built route, `IMPLEMENTATION-NOTES.md`.

**Gate:** project build/tests pass; direct route renders; approved content/assets only; primary
journey works or has a named external blocker; responsive/keyboard/reduced-motion basics verified;
console/network smoke clean.

**Backflow:** do not rewrite approved copy or design silently to fix implementation pressure.

## Stage 6: SEO, AEO, GEO audits

**Needs:** rendered/raw page, current kit/brief/ledger, search/referral data when available.

**Returns:** scoped audit reports with current official-source checks, evidence, severity, owners,
paste-ready fixes where appropriate, and verification.

**Gate:** authorized P0/P1 fixes applied and failed checks rerun. Deprecated/unsupported advice is not
introduced. Audit-driven structural/copy changes return through their approval owners.

## Stage 7: `conversion-optimization`

**Needs:** built page/journey, analytics/consent conventions, baseline data, business outcome and
guardrails.

**Returns:** `CRO-PLAN.md`, verified event definitions, privacy/consent/masking controls, hypotheses,
validation or experiment cards.

**Gate:** primary conversion verified end to end; no sensitive capture; consent matches project
policy; conclusions identify their evidence/confidence; experiments have decision rules.

**Backflow:** unclear business outcome returns to strategy; UX defect routes to its owning stage.

## Stage 8: `landing-page-qa`

**Needs:** final candidate URL/build, artifacts, test matrix, journey, environment constraints.

**Returns:** `LANDING-QA.md`, screenshots/traces/logs/test output, release recommendation, rerun results.

**Gate:** representative browser/device/pref checks complete; primary journey verified; zero open
P0/P1 for `SHIP`; untested areas explicit.

**Backflow:** each finding routes to the stage that owns the defect and returns for targeted rerun.

## Stage 9: orchestrator quality gate

**Needs:** approvals, artifact paths, audit/QA outcomes, risk acceptances, deployment state.

**Returns:** `SHIP`, `CONDITIONAL`, or `BLOCK` plus the complete evidence handoff.

**Gate:** apply `quality-gate.md`. No stage can self-certify a defect it owns without rerunning the
independent observable check.

## Skip record

For every omitted stage record:

```markdown
| Stage | Skipped because | Evidence | Risk | Owner approval |
|---|---|---|---|---|
```

“Not needed” without evidence is not a skip decision.
