# Browser QA evidence harness

The harness turns browser verification into inspectable evidence. It uses pinned Playwright and
axe-core dependencies, writes one trace and multiple screenshots per case, records console/page
errors and failed first-party requests, exercises the primary CTA, and writes
`browser-report.json`.

## Install

```bash
npm --prefix tools/browser-qa ci
npx --prefix tools/browser-qa playwright install chromium
```

Chromium is the CI floor. For local cross-engine coverage:

```bash
npx --prefix tools/browser-qa playwright install firefox webkit
```

## Run

```bash
node tools/browser-qa/run.mjs \
  --config /absolute/path/to/landing-qa.config.json \
  --commit "$(git rev-parse HEAD)"
```

For a real page, the config must provide `url`, `section-selector`, and a nonempty declarative
`journey` (or `journey-file`). The harness does not guess CTA IDs or treat screenshots as journey
proof. Supported step actions are `click`, `fill`, `press`, `select`, `check-visible`, `check-text`,
`check-attribute`, `wait-for-url`, and `screenshot`. Mutating steps automatically retain a viewport
state; set `evidence_selector` when a stable post-action region should be captured instead. Example:

```json
{
  "url": "http://127.0.0.1:3000/launch",
  "browser": "chromium",
  "out": ".landing-studio/evidence/browser-qa",
  "run-id": "ls_0123456789abcdef",
  "section-id": "hero",
  "commit": "replace-with-git-sha",
  "section-selector": "#hero",
  "reduced-motion-selector": "#hero [data-motion-proof]",
  "journey": [
    { "name": "hero-visible", "action": "check-visible", "selector": "#hero" },
    { "name": "primary-cta", "action": "click", "selector": "#hero a[data-primary-cta]" },
    { "name": "destination", "action": "wait-for-url", "value": "**/signup**" }
  ]
}
```

Run every installed engine with `--browser all`, or a comma-separated subset. The default profiles
cover desktop light, mobile light, desktop reduced motion, and desktop dark. Restrict them with
`--profiles desktop-light,mobile-light`.

Repeated settings may live in JSON. Direct CLI values override config values:

```bash
node tools/browser-qa/run.mjs \
  --config tools/browser-qa/fixtures/smoke.config.json \
  --out /tmp/browser-qa
```

Use the deterministic fixture for installation and CI smoke tests:

```bash
node tools/browser-qa/run.mjs --fixture positive --browser chromium --out /tmp/browser-qa
```

`fixtures/declarative.config.json` exercises the generic journey engine against the fixture. The
fixture-specific implicit journey exists only for backwards-compatible smoke coverage and must not be
used as evidence for a real target page.

The command exits `1` after writing the report when it finds a serious/critical axe violation,
broken primary journey, console/page error, failed first-party request, or missing evidence. Exit `2`
means setup or execution failed before a valid report could be produced.

The report uses the repository's snake-case `schemas/browser-report.schema.json` contract. Its
`projects` retain per-browser/profile details and blockers; top-level `journeys`, `console_errors`,
`failed_requests`, `axe`, and `artifacts` are flattened consumers for run-state and release tooling.
Artifact paths are relative to the selected output directory.

If the runtime provides `/browse`, use it for fast interactive inspection and human judgment. This
harness remains the release evidence floor because it produces stable artifacts independent of the
runtime UI.
