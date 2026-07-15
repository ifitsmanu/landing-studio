# Landing Studio v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release Landing Studio v1 as a portable, executable, section-gated landing-page studio with browser evidence, media and dependency provenance, 3D/motion expertise, and an independent red-team gate.

**Architecture:** Keep one Agent Skills-compliant `skills/` core and add deterministic Node.js scripts, YAML/JSON templates, CI, and thin installation adapters. The `landing-page-build` director writes persistent run state while specialists exchange machine-readable artifacts. Browser and motion behavior is verified by executable fixtures rather than prose claims.

**Tech Stack:** Node.js 22+, ESM, YAML, Agent Skills `skills-ref`, Playwright, axe-core, Lighthouse CI, FFmpeg/ffprobe where available, GitHub Actions, Markdown.

## Global Constraints

- License is Apache-2.0.
- Do not add a Figma dependency or Figma-specific workflow.
- Keep a single vendor-neutral skill source; do not fork skill bodies per runtime.
- Descriptions must be 1–1,024 characters and every skill name must match its directory.
- Unresolved P0/P1 red-team findings block release.
- Public media requires a completed provenance record before implementation.
- Human approval is recorded per page section; no one-shot full-page approval.
- External posting and marketplace submission remain outside this implementation.

---

## File structure

- `skills/*/SKILL.md`: portable procedural core.
- `skills/*/agents/openai.yaml`: optional Codex presentation metadata generated from the skill contract.
- `skills/{creative-direction,media-sourcing,technology-curator,webgl-3d,landing-red-team}/`: new specialists and focused references/templates.
- `schemas/`: JSON Schemas for run, evidence, media, dependency, browser, and red-team artifacts.
- `templates/`: copyable project-root state and ledger templates.
- `scripts/`: repository validation, run-state commands, installation, and smoke tests.
- `tools/browser-qa/`: self-contained Playwright/axe evidence harness and fixture.
- `tests/`: deterministic Node tests for contracts and regressions.
- `.github/`: CI, release, issue, PR, security, and dependency automation.
- `docs/`: compatibility, library, inspiration, architecture, contributing, release, and showcase guidance.

### Task 1: Open-source foundation and package contract

**Files:** Create `LICENSE`, `package.json`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `GOVERNANCE.md`, `ROADMAP.md`, `CITATION.cff`; modify `.claude-plugin/plugin.json`.

- [ ] Add Apache-2.0 and community policies with repository-specific commands and boundaries.
- [ ] Set version `1.0.0`, Node `>=22`, ESM, and scripts for validate, test, QA smoke, motion smoke, and release check.
- [ ] Add repository, homepage, license, and keywords to the plugin manifest.
- [ ] Run JSON/YAML parsing and verify no placeholder contact or payment claims are published.

### Task 2: Machine-readable studio contracts

**Files:** Create `schemas/*.schema.json`, `templates/*.yaml`, `scripts/studio-state.mjs`, `tests/studio-state.test.mjs`.

- [ ] Write failing tests for run initialization, legal stage transitions, approval locks, stale downstream sections, hashes, and release blocking.
- [ ] Implement `init`, `status`, `approve`, `reject`, `record-artifact`, `record-finding`, and `release-check` commands.
- [ ] Validate every written manifest against its schema and use atomic replacement.
- [ ] Run focused tests and retain a fixture manifest under `tests/fixtures/`.

### Task 3: Portable metadata and repository validator

**Files:** Modify `scripts/validate-repo.mjs`; create `scripts/generate-openai-metadata.mjs`, `tests/validator.test.mjs`, `skills/*/agents/openai.yaml`.

- [ ] Write failing tests for overlong descriptions, invalid YAML, directory/name mismatches, broken links, missing licenses, and stale generated metadata.
- [ ] Parse frontmatter as YAML and enforce the Agent Skills specification.
- [ ] Generate concise OpenAI UI metadata without changing skill bodies.
- [ ] Make validation fail when executable smoke/unit tests fail or community/release files are missing.

### Task 4: Human-paced orchestration

**Files:** Modify `skills/landing-page-build/SKILL.md` and references; create `skills/landing-page-build/assets/*.yaml`.

- [ ] Replace whole-page approval with a page queue and strict one-section lifecycle.
- [ ] Require the state command before and after every stage.
- [ ] Specify backflow, stale-state, rejection, skip, resume, and capability-degradation behavior.
- [ ] Require browser and red-team evidence before section approval and final release.

### Task 5: Creative, media, technology, 3D, and critic specialists

**Files:** Create the five new skill directories with focused references, assets, and metadata.

- [ ] Define three-territory creative direction and an originality audit.
- [ ] Define a rights-first capture/source/generate media decision and ledger gate.
- [ ] Define official-source library research, measured proof, and dependency decision records.
- [ ] Define selective 3D/WebGL lanes, budgets, accessibility, context-loss, and static fallbacks.
- [ ] Define fresh-context P0–P3 red-team review with exact browser/copy/design evidence.

### Task 6: Existing specialist alignment

**Files:** Modify existing `SKILL.md` files, `brand-kit.template.md`, and selected references.

- [ ] Resolve conflicting defaults and add typed proof/testimonial/logo/media records.
- [ ] Route creative, media, library, 3D, browser, and red-team work to the new specialists.
- [ ] Tighten activation boundaries and move non-core examples to references.
- [ ] Add Apache license and version metadata while staying inside context budgets.

### Task 7: Browser evidence harness

**Files:** Create `tools/browser-qa/**`, `tests/browser-qa.test.mjs`; modify `skills/landing-page-qa/**`.

- [ ] Build a local fixture with working CTA, menu, intentional console/request failures in negative mode, reduced motion, and responsive sections.
- [ ] Capture full-page/section screenshots, trace, console, failed requests, axe results, viewport metadata, and journey assertions.
- [ ] Run Chromium in CI and document optional Firefox/WebKit installation for local full coverage.
- [ ] Fail on critical/serious axe violations, broken primary journey, console errors, failed first-party requests, or missing evidence.

### Task 8: Motion regression repairs

**Files:** Modify `skills/motion-video/assets/scene-templates/{capture.mjs,encode.sh,cutdowns.sh,kinetic-type-card.html,README.md,package.json}`; add smoke tests.

- [ ] Reproduce blank poster, resolution mismatch, and virtual-time hang in tests.
- [ ] Add explicit poster time, logical output dimensions, timeouts, metadata inspection, and end-to-end filenames.
- [ ] Ensure short deterministic capture produces a nonblank poster and accepted cutdown input.
- [ ] Document Remotion as the composition lane and FFmpeg as the deterministic encode lane.

### Task 9: Behavioral evals and scorecard

**Files:** Replace/extend `evals/**`; create `scripts/run-evals.mjs`, `docs/SCORECARD.md`.

- [ ] Add activation and non-activation cases plus orchestration, media, 3D, browser, and blocking cases.
- [ ] Add committed fixture inputs, grader rubrics, result schema, and honest unrun markers.
- [ ] Run deterministic contract graders locally; do not claim cross-model results without retained evidence.
- [ ] Publish baseline, v1 target, remaining limitations, and exact reproduction commands.

### Task 10: Installation, compatibility, and high-leverage references

**Files:** Create `scripts/install.mjs`, `docs/{COMPATIBILITY,LIBRARIES,INSPIRATION,MEDIA-RIGHTS}.md`; rewrite `README.md`.

- [ ] Add copy-pasteable install, update, verify, and uninstall commands for verified runtimes.
- [ ] Document native `.agents/skills` paths for Codex, Gemini, GitHub Copilot, and OpenCode; plugin path for Claude; current Cursor path; generic fallback for other CLIs.
- [ ] Publish maintained library decision lanes and explicit license caveats.
- [ ] Publish inspiration research lanes that extract principles without copying sites.

### Task 11: GitHub automation and release surface

**Files:** Create `.github/workflows/{ci,release}.yml`, Dependabot, CODEOWNERS, issue forms, PR template, release template.

- [ ] Run validation, unit tests, browser smoke, and motion syntax/smoke gates in CI.
- [ ] Build release archives and checksums from a `v*` tag.
- [ ] Configure issue forms for bugs, skill proposals, compatibility reports, and showcases.
- [ ] Verify workflow syntax and permissions are least-privilege.

### Task 12: Final verification, red team, commit, push, and release

**Files:** All changed files and retained evidence under `artifacts/release/v1.0.0/`.

- [ ] Run the repository validator, Node tests, browser smoke, motion smoke, plugin validator, and release check from a clean install.
- [ ] Run independent product, execution, and skill-quality reviews; fix every P0/P1 and document accepted P2.
- [ ] Update changelog and scorecard with verified results only.
- [ ] Commit the complete v1.0.0 release, push `main`, create annotated tag `v1.0.0`, push it, and publish a GitHub release with generated archives/checksums.
- [ ] Update GitHub description, homepage, topics, Discussions, and repository community settings; verify the public release URL.

## Self-review

- Spec coverage: every design requirement maps to Tasks 1–12.
- Placeholder scan: no implementation step relies on an unspecified future component.
- Interface consistency: run state, evidence, media, dependency, browser, and red-team records are owned by schemas and consumed by the director, validator, and release check.
