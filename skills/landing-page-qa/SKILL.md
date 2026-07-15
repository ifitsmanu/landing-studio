---
name: landing-page-qa
description: >-
  Browser-based release QA for landing pages and marketing sites. Use after
  implementation, before shipping, or whenever the user asks to test, browse,
  inspect, verify, screenshot, compare, or audit a landing page in a real browser.
  Exercise responsive layouts, primary journeys, forms, links, media, motion,
  keyboard and accessibility behavior, performance, metadata, console/network
  health, visual regressions, and agent-readable DOM. Produce evidence-backed
  blockers and rerun fixed cases. Code inspection alone is never sufficient.
---

# Landing Page QA

Decide whether the rendered page is ready to ship. Test observable behavior in a real browser and
attach evidence. Do not implement fixes unless the user has also authorized changes; report-only
requests remain report-only.

## Inputs

- local or live URL and route;
- approved page/design/copy artifacts and `brand-kit.md`;
- target browsers, devices, locales, and traffic paths;
- project test commands and existing Playwright/browser setup;
- primary conversion journey and external-service constraints.

Prefer the project's existing browser test framework. Playwright is the default when no maintained
project harness exists because it supports Chromium, Firefox, WebKit, device emulation, screenshots,
network control, and accessibility-oriented locators. Use automated axe checks as one layer, not a
claim of complete accessibility conformance.

## Test matrix

At minimum cover:

| Dimension | Baseline |
|---|---|
| Desktop | Chromium at a common laptop viewport |
| Mobile | WebKit-like phone and Chromium-like phone |
| Width stress | 320px, representative tablet, wide desktop |
| Input | Keyboard-only and touch-sized controls |
| Preferences | reduced motion; light/dark only if supported |
| Content | shortest/longest approved copy and relevant error states |
| Entry | direct URL, campaign/query parameters, refresh, and back navigation |

Expand for project analytics, locale, browser share, or regulated accessibility requirements. Avoid
pretending device emulation replaces testing on critical physical devices.

## Passes

### 1. Smoke and environment

Confirm the expected build is running, the route returns the intended page, canonical host/redirects
behave, and no auth wall or consent interstitial makes the primary content inaccessible. Record build
identifier or commit when available.

### 2. Visual and responsive

Capture full-page and key-viewport screenshots. Check overflow, clipping, overlap, layout shift,
unreadable line lengths, orphaned headings, media crops, sticky collisions, safe areas, zoom/reflow,
and content hidden only at certain widths. Compare approved baselines when the project maintains them;
review diffs rather than auto-updating snapshots.

### 3. Content and evidence

Verify the H1, CTA labels/destinations, prices, claims, testimonials, logos, dates, disclaimers,
simulation labels, and metadata against approved artifacts. Search for placeholder text, broken assets,
fake UI data presented as real, and copy that exists only inside images or video.

### 4. Primary journeys

Exercise every primary CTA from entry to verifiable completion. Test forms with valid, invalid, empty,
slow, duplicate, server-error, and recovery paths that are safe in the environment. Verify links,
downloads, calendars, deep links, and external destinations. Avoid creating production leads or charges
unless explicitly authorized; use test/sandbox paths where available.

### 5. Accessibility

Test semantic landmarks, heading order, accessible names, keyboard order, visible focus, skip link,
dialogs/menus, error association, color contrast, zoom/reflow, target size, reduced motion, captions or
transcripts, and screen-reader-relevant states. Run the project's axe integration where available.
Automated success does not replace manual keyboard and comprehension checks.

### 6. Motion and media

Confirm the poster works before playback, autoplay policy failure is graceful, controls are usable,
captions/transcript exist where required, layout does not jump, and reduced motion presents an
equivalent static result. Check media weight, source formats, crop, loop seam, pause behavior, and
offscreen loading.

### 7. Performance and runtime health

Record failed requests, console errors, hydration failures, long tasks, third-party impact, cache
behavior, and Core Web Vitals evidence. Use Lighthouse or the project's performance harness for lab
diagnosis and field data for production decisions. Default reference thresholds at the 75th percentile
are LCP at most 2.5s, INP at most 200ms, and CLS at most 0.1 unless the project sets stricter budgets.

### 8. Search and agent readability smoke test

Inspect raw response HTML and the accessibility/DOM tree. Confirm primary content, links, canonical,
robots directives, social metadata, and approved structured data exist without requiring a user
gesture. Browser agents and non-rendering fetchers need explicit names, roles, destinations, and
server-visible content; screenshots alone are not an interface contract.

### 9. Analytics and consent

Verify approved events fire once with correct properties and consent state. Confirm denied consent
prevents disallowed storage/recording, sensitive form values are absent, query attribution survives the
journey, and replay masking works in the captured output.

### 10. Security and data handling smoke test

Confirm no secret or personal value appears in HTML, client bundles, URLs, console output, analytics,
replay, screenshots, or logs. Exercise form validation and reflected values with inert test strings;
verify the project-native CSRF/origin, anti-abuse, duplicate-submission, and authorization controls where
applicable without attacking production. Review third-party script ownership, consent gating, security
headers, mixed content, dependency scan output, and external form destinations. Route deeper security
testing to the project's authorized security workflow.

## Severity

- `P0 BLOCKER`: security/privacy breach, materially false claim, inaccessible primary journey,
  production data/charge risk, or page unavailable.
- `P1 BLOCKER`: primary conversion broken, major responsive/accessibility failure, wrong destination,
  severe runtime failure, or indexability/canonical error.
- `P2`: material quality, performance, discoverability, or secondary-journey defect.
- `P3`: polish with limited user or business impact.

Every finding includes URL/state, viewport/browser, reproduction steps, expected vs actual, evidence,
severity rationale, likely owner, and verification case.

## Output contract

Create `LANDING-QA.md` containing:

1. release decision: `SHIP`, `CONDITIONAL`, or `BLOCK`;
2. environment and test matrix;
3. P0/P1 blockers;
4. P2/P3 findings;
5. journey, accessibility, performance, metadata, analytics, consent, and security smoke-test results;
6. screenshot/trace/log evidence paths;
7. commands and automated test results;
8. untested areas and why;
9. rerun results after fixes.

## Gate

Ship only with zero open P0/P1 findings and a verified primary conversion path. A passing build,
Lighthouse score, or screenshot is one signal, never the release decision by itself.
