# Landing Studio v1 Design

**Status:** Approved for implementation by the repository owner on 2026-07-15.

## Outcome

Landing Studio v1 is an open-source, runtime-neutral Agent Skills studio for researching, designing, writing, implementing, and independently judging landing pages. It must produce inspectable artifacts, preserve human decisions across sessions, and refuse to present unverified claims or unlicensed media as release-ready.

The product promise is not "one prompt creates a perfect page." The promise is a disciplined studio workflow that moves one page and one section at a time, using current evidence, deliberate creative direction, production-grade implementation, browser proof, and an adversarial release gate.

## Approaches considered

### A. One portable core with thin adapters — selected

Keep every capability in standards-compliant `skills/<name>/SKILL.md` packages. Add only installation and presentation adapters for runtimes that need them. Use `.agents/skills` as the neutral discovery target where supported. This follows the Agent Skills open standard while avoiding vendor forks.

Benefits: one source of truth, lowest maintenance cost, broadest interoperability, and no model lock-in. Tradeoff: not every runtime exposes the same tools, so skills must detect capabilities and provide explicit fallbacks.

### B. Separate Claude, Codex, Gemini, Cursor, and OpenCode editions

This could optimize syntax for each runtime but would duplicate procedures, drift quickly, and make cross-model quality impossible to reason about. Rejected.

### C. A hosted MCP studio service

A service could enforce state and run browser/media infrastructure centrally, but it would add hosting, authentication, privacy, and operational cost. It remains a possible later product layer. It is not required for the open-source v1.

## Product architecture

### Portable skill core

All skills follow the Agent Skills specification:

- lowercase directory-matching names;
- descriptions no longer than 1,024 characters;
- concise `SKILL.md` bodies with progressive disclosure;
- Apache-2.0 declared in frontmatter;
- optional `scripts/`, `references/`, `assets/`, and `agents/openai.yaml` resources;
- relative references and deterministic scripts where prose is too fragile.

Claude Code keeps its plugin manifest. Codex, Gemini CLI, GitHub Copilot, OpenCode, Cursor, and other compatible clients consume the same core. Installation documentation distinguishes verified native support from generic copy/symlink installation. No compatibility claim is made without an official source or a recorded smoke test.

### Studio director and persistent state

`landing-page-build` is the director. A run creates `.landing-studio/run.yaml` in the target project. The manifest records:

- run, project, route, and page identifiers;
- requested outcome and success metric;
- capability detection results;
- ordered page and section queue;
- stage status, artifact paths, hashes, and timestamps;
- explicit user approvals and rejection notes;
- red-team findings and disposition;
- skipped steps with evidence-backed reasons;
- release decision and unresolved risks.

The director may research the full project for context, but production advances only one section at a time:

1. Define the page job and section queue.
2. Research the active section and its proof needs.
3. Produce three materially different copy/creative directions.
4. Record the user's selected direction.
5. Implement only the active section.
6. Render and capture browser evidence.
7. Run an independent red-team review.
8. Fix blocking findings and recapture evidence.
9. Record approval and lock the section.
10. Advance to the next section.

Changing an approved upstream decision marks dependent sections stale instead of silently overwriting them.

### Specialist capabilities

The v1 skill map adds:

- `creative-direction`: category research, visual territories, distinctive concepts, taste, and anti-sameness review;
- `media-sourcing`: image/video capture, generation decisions, licenses, model/property releases, and provenance;
- `technology-curator`: library discovery, official-source verification, prototypes, bundle/security/license evidence, and adoption decisions;
- `webgl-3d`: selective Three.js, React Three Fiber, `<model-viewer>`, shader, model, fallback, and GPU-budget guidance;
- `landing-red-team`: fresh-context copy, design, interaction, accessibility, performance, evidence, and deception critique with block authority.

Existing research, design, copy, motion, implementation, SEO/AEO/GEO, CRO, QA, and campaign skills remain focused specialists.

### Browser and visual evidence

Browser verification is operational, not a prose checklist. The bundled QA harness uses Playwright by default and supports:

- Chromium, Firefox, and WebKit projects;
- desktop and mobile viewports;
- full-page and section screenshots;
- scrolling and core CTA journeys;
- console and failed-request collection;
- axe-core accessibility checks;
- trace artifacts;
- reduced-motion and color-scheme modes;
- a machine-readable report.

If a runtime supplies `/browse` or an equivalent browser tool, the agent may use it for fast interactive judgment, but the evidence contract remains the same. Lighthouse is a separate performance lane because its throttled Chromium measurements are not interchangeable with cross-browser functional QA.

### Creative invention

References are inputs, not templates. Every creative-direction run must:

- inspect the product, audience, category, brand assets, and claims first;
- source references from at least three distinct visual domains, not only SaaS galleries;
- record the principle borrowed from each reference without copying expression;
- generate three distinct territories with a named idea, emotional effect, proof strategy, palette/type logic, motion grammar, and risk;
- reject the territory that is merely the category median;
- preserve usability, content clarity, performance, and reduced-motion behavior.

### Media rights and provenance

Every external or generated asset receives a ledger entry before implementation. The ledger stores source URL, creator, license identifier and snapshot URL, acquisition date, allowed channels, attribution, restrictions, model/property release status, territory/expiry when relevant, content hash, local path, and generative provenance. "Found online" is never a valid license.

Unsplash, Pexels, Pixabay, Google Fonts, and similar sources are discovery lanes, not blanket approvals. The current license page for the exact source must be checked at acquisition time. Identifiable people, trademarks, products, buildings, and artwork receive separate rights review.

### Library strategy

Use the target project's existing maintained libraries first. Default lanes are:

- browser QA: Playwright, axe-core, Lighthouse CI, and pixelmatch only when visual baselines are stable;
- interface motion: CSS/WAAPI first, Motion for component motion, GSAP for complex timelines after its current license is checked;
- programmatic video: Remotion when React composition adds leverage; FFmpeg for deterministic encode, inspection, and cutdowns;
- interactive vector animation: Rive or dotLottie when the asset pipeline and runtime cost are justified;
- 3D: `<model-viewer>` for a single product model, Three.js for framework-neutral scenes, React Three Fiber for React-native scene composition, and glTF optimization tools before shipping;
- analytics and behavior: existing first-party analytics first; privacy and consent requirements block unapproved session replay or heatmaps.

Every new dependency requires a decision record with official docs, maintenance evidence, license, measured bundle/runtime impact, browser support, security status, alternatives, exit path, and a minimal proof.

### Motion and video contract

The existing deterministic frame capture remains a lightweight lane but must be corrected:

- logical output dimensions equal encoded dimensions unless scale is explicitly requested;
- poster time is explicit and must pass a nonblank check;
- virtual-time capture has navigation and per-frame timeouts with actionable errors;
- README commands produce the files consumed by the next command;
- cutdowns verify input metadata and render native aspect-ratio compositions;
- reduced-motion/static assets are mandatory;
- tests exercise capture, poster, encode metadata, and failure paths.

### Red-team release gate

The producer cannot certify its own work. `landing-red-team` runs in a fresh context or separate agent when the runtime supports it. Otherwise it performs a declared fresh-pass review after clearing production assumptions. Findings use P0–P3 severity, exact evidence, violated principle, user/business impact, and a reproducible acceptance test.

- unresolved P0 or P1 blocks release;
- P2 requires explicit owner acceptance in the run manifest;
- P3 may ship with a backlog entry;
- absence of browser evidence blocks claims of browser verification;
- absence of rights evidence blocks the affected media from release.

### Validation and evals

The root validator parses YAML, enforces the open specification, validates links and manifests, checks descriptions, verifies required specialist metadata, and runs deterministic unit tests. CI runs on pull requests and `main`.

Behavioral evals include positive activation, negative activation, orchestration, claims integrity, section approval, media rights, browser evidence, 3D fallback, and red-team blocking. Fixture outputs and grading instructions are committed. The README must not claim cross-model performance until results from that model/runtime are retained.

## Open-source and release foundation

The repository ships Apache-2.0, contribution and conduct policies, security reporting, governance, support, issue/PR templates, changelog, roadmap, citation metadata, funding placeholder only if configured, CI, dependency updates, and release automation. GitHub metadata includes a precise description, homepage, topics, and Discussions.

The first stable release is `v1.0.0` only after local validation, motion smoke tests, browser harness tests, GitHub Actions configuration review, and a final independent red team pass. Growth materials focus on proof: executable examples, before/after artifacts, compatibility evidence, and an honest scorecard. Fame is not guaranteed; earned adoption and contribution quality are measurable.

## Explicit non-goals

- No Figma dependency or Figma-specific workflow.
- No deceptive clickbait, fake scarcity, confirmshaming, dark patterns, or unsupported performance claims.
- No scraping or reuse of public media without permission and provenance.
- No automatic external posting, marketplace submission, analytics installation, or third-party account changes without separate authorization.
- No promise that every agent runtime exposes identical capabilities.

## Release acceptance

v1.0.0 may ship only when:

1. all skills pass the open Agent Skills constraints and repository validation;
2. the section-state workflow and schemas are executable and tested;
3. browser QA emits real evidence from the bundled fixture;
4. motion capture produces a visible poster and compatible output dimensions;
5. the independent red team reports no unresolved P0/P1;
6. license and community files are present;
7. installation paths are documented with verified official sources;
8. the working tree is clean after commit and the GitHub release points to the signed-off tag.
