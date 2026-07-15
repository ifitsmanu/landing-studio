# Landing Studio release quality gate

Run this against the final candidate in a real browser. Automated checks support the decision; they do
not replace visual, keyboard, content, privacy, and conversion review.

## Decision

- `SHIP`: zero open P0/P1, primary conversion verified, evidence and approvals complete.
- `BLOCK`: material false claim, privacy/security exposure, unavailable page, broken or inaccessible
  primary journey, or any unresolved P0/P1.

## 1. Scope and provenance

- [ ] Candidate URL, environment, build/commit identifier, date, tester, and test matrix recorded.
- [ ] Project-root kit version and approved brief/design/copy/motion artifacts linked.
- [ ] Strategy, page-structure, copy, claims/legal, and release approvals recorded where applicable.
- [ ] Every skipped stage has evidence, risk, and owner approval.
- [ ] Git diff contains no unrelated or generated junk; secrets and private data absent.

## 2. Page comprehension and message match

- [ ] First viewport identifies the product/category, audience relevance, proof direction, and primary
  next step without requiring motion or audio.
- [ ] The traffic/ad/query promise appears without a misleading pivot.
- [ ] Each section has a distinct job and no material repetition or unsupported feature inventory.
- [ ] Strong evidence appears before low-value decoration; actual ordering is a measured hypothesis,
  not justified by a universal scroll percentage.
- [ ] CTA label, destination first screen, form/flow, and success state describe the same action.
- [ ] A visually subordinate secondary path exists only for a documented journey need.

## 3. Evidence and content integrity

- [ ] Every number, quote, logo, named customer, certification, price, benchmark, and competitor fact
  maps to an approved evidence-ledger row.
- [ ] Wording, date, comparison scope, source, caveat, and allowed usage match the ledger.
- [ ] Forbidden claims and expired proof do not appear in page, metadata, schema, media, or analytics.
- [ ] Simulated/demo data and time compression are visibly labeled where confusion is plausible.
- [ ] No placeholder text/assets, fabricated UI, broken media, stale date, or copied reference content.
- [ ] Legal, disclosure, rights, privacy, localization, and brand constraints are present and approved.

## 4. Brand and craft

- [ ] Real supplied wordmark/logo, licensed fonts/media, and project tokens are used.
- [ ] No accidental near-match brand colors, hardcoded client values outside the kit/adapter, or rogue
  one-off styles without rationale.
- [ ] Visual hierarchy, spacing, alignment, type, borders, radii, shadows, and media treatment form a
  coherent system at mobile and desktop widths.
- [ ] Long/short approved content, zoom, localization, and error states do not break composition.
- [ ] Decorative effects have a purpose and do not obscure product evidence or controls.

## 5. Primary journey and runtime

- [ ] Direct route load, refresh, history/back, campaign parameters, and external/deep links work.
- [ ] Primary CTA tested end to end on representative mobile and desktop browsers.
- [ ] Forms tested safely for empty, invalid, valid, loading, server error, retry, duplicate submission,
  and success; no production lead/charge created without authorization.
- [ ] Console and network have no unexplained errors, hydration failures, failed critical requests, or
  mixed-content/security warnings.
- [ ] No secrets or personal values leak through client bundles, URLs, analytics, replay, screenshots,
  logs, or external form destinations; project-native validation, origin/CSRF, and anti-abuse controls
  remain intact where applicable.
- [ ] JavaScript/media failure leaves the core argument and link-based primary action usable where the
  product journey allows it.

## 6. Accessibility: WCAG 2.2 AA target

- [ ] Semantic landmarks and logical headings; one page-topic H1 unless project semantics justify
  otherwise.
- [ ] Native controls/links used; accessible names, roles, states, labels, instructions, errors, and
  status messages are correct.
- [ ] Keyboard order is logical; visible focus is not obscured; no traps; skip mechanism where needed.
- [ ] Rendered contrast, non-text contrast, zoom/reflow, text spacing, target size, drag alternatives,
  and consistent/help/authentication criteria checked as applicable.
- [ ] Images have appropriate alternatives; video has captions/transcript/audio-description decisions.
- [ ] `prefers-reduced-motion` provides an equivalent usable state; persistent motion can be controlled
  where required.
- [ ] Automated axe results reviewed and manual keyboard/content checks completed. Automated zero does
  not claim full conformance.

## 7. Responsive, motion, and visual regression

- [ ] Representative Chromium/WebKit mobile and desktop plus project-critical browsers tested.
- [ ] 320px, tablet, laptop, wide, touch, safe-area, and orientation stress reviewed where applicable.
- [ ] No overflow, clipping, overlap, sticky collision, hidden focus, unreadable crop, or unintended
  layout shift.
- [ ] Approved screenshot baselines reviewed; diffs are not blindly accepted.
- [ ] Poster/static state, autoplay failure, reduced motion, loop seam, captions, safe zones, and native
  aspect cutdowns reviewed.

## 8. Performance and resilience

- [ ] Project budgets measured with the representative build and conditions.
- [ ] Reference Core Web Vitals at the 75th percentile: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1, unless
  project budgets are stricter.
- [ ] LCP candidate prioritized; above-fold media dimensions/responsive sources correct; below-fold
  media loading deliberate.
- [ ] Fonts, video, embeds, analytics, replay, consent, and animation libraries have measured cost and
  justified loading.
- [ ] Lighthouse/lab output used for diagnosis; field data used for production conclusions when
  available.

## 9. Search, answers, and agents

- [ ] Canonical, robots, sitemap membership, status/redirects, title, description, social metadata,
  favicon, internal links, and structured data match final visible content.
- [ ] Raw response and rendered DOM contain essential public content and destinations.
- [ ] Structured data uses only current supported/justified types and passes parity/evidence review.
- [ ] Deprecated FAQ/HowTo Google rich-result work and unsupported AI-specific markup are absent.
- [ ] GEO report distinguishes Google SEO guidance from other engines and separates training/search
  crawler decisions.
- [ ] Agent/browser journey uses understandable accessible controls and has been exercised when in scope.

## 10. Analytics, CRO, consent, and ethics

- [ ] Primary conversion and supporting events fire once with correct definitions/properties.
- [ ] Campaign/referral parameters survive the journey without leaking sensitive data.
- [ ] Denied/withdrawn consent blocks disallowed storage, analytics, and replay as project policy
  requires.
- [ ] Replay/heatmap configuration masks sensitive content, excludes prohibited routes, and has
  approved retention/access controls.
- [ ] No fake scarcity, confirmshaming, disguised ads, forced continuity, hidden costs, preselected
  consent, misleading CTA, or other dark pattern.
- [ ] Heatmap/scroll/session conclusions are labeled as evidence or hypothesis, not mind-reading.
- [ ] Experiments have eligibility, primary metric, guardrails, instrumentation QA, and decision rule;
  low traffic is not treated as statistical certainty.

## 11. Audit closure and handoff

- [ ] SEO, AEO, GEO, CRO, and browser QA ran at the appropriate final state or have approved skip records.
- [ ] Every authorized P0/P1 fix was rerun at the failing observable case.
- [ ] P2/P3 findings each have `fix`, `accept`, `defer`, or `reject` plus owner when action remains.
- [ ] Deployment/configuration blockers, secrets, DNS, analytics, consent, forms, and external-service
  ownership are named without exposing credentials.
- [ ] Post-launch baseline window, monitoring owner, and first evidence review date are recorded.

## Final record

```markdown
Decision: SHIP | BLOCK
Candidate:
Evidence bundle:
Open P0/P1:
Accepted risks and approver:
External blockers:
Post-launch measurement date:
Rollback or disable path:
```
