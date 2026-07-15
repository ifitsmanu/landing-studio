# Landing Studio

[![CI](https://github.com/ifitsmanu/landing-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/ifitsmanu/landing-studio/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/ifitsmanu/landing-studio)](https://github.com/ifitsmanu/landing-studio/releases)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

An open, portable Agent Skills studio for landing pages that must survive real scrutiny: product research, writing, creative direction, design systems, implementation, media rights, motion/video, 3D/WebGL, SEO/AEO/GEO, conversion measurement, browser evidence, and an independent red-team gate.

Landing Studio is deliberately not a one-shot page generator. It works one page and one section at a time, records human approvals, and refuses to call a page ready when claims, rights, browser behavior, or the primary journey are unverified.

## Why it exists

Most landing-page prompt packs produce a polished average: the same SaaS references, invented proof, generic copy, ornamental animation, and no evidence that the result works in a browser.

Landing Studio treats the job like a serious studio:

- understand the actual product, audience, traffic promise, and references before proposing;
- create three materially different directions instead of three cosmetic variants;
- use real product proof and auditable claims;
- source, capture, or generate media only with provenance and usage rights;
- choose libraries from official docs and a measured proof, not popularity alone;
- implement the selected section on the project's existing stack;
- scroll, click, capture, inspect, and test rendered reality;
- put an independent critic between production and approval;
- lock the section, then move to the next one.

No Figma workflow is required.

## The section loop

```text
project + brand kit + real evidence
              │
              ▼
      approve page frame and queue
              │
              ▼
  research the one active section
              │
              ▼
  three copy + creative directions
              │
       human selects one
              ▼
 rights + library + feasibility gates
              │
              ▼
      write, design, implement
              │
              ▼
 browser evidence + independent red team
              │
       fix blocking findings
              ▼
      human approval and lock
              │
              └──── next section
```

State persists in the target project's `.landing-studio/run.yaml`. Changing an approved upstream decision marks dependent work stale instead of silently rewriting it. The CLI safely ignores this working state in Git; `studio-state.mjs export --out <directory>` creates a checksum manifest plus a portable copy of current contracts and nested evidence for PRs, releases, or external retention.

## Skills

| Skill | Owns |
|---|---|
| **`landing-page-build`** | **Start here.** Persistent orchestration, page/section gates, backflow, and release decision. |
| `landing-research` | Product, repository, customer, category, competitor, traffic, reference, and evidence intake. |
| `creative-direction` | Three distinctive visual territories, current inspiration research, taste, and originality checks. |
| `landing-design-system` | Accessible tokens, typography, spacing, responsive primitives, themes, motion roles, and components. |
| `landing-page-design` | One active section's composition, hierarchy, proof, CTA relationship, and responsive spec. |
| `landing-copywriter` | Section-level conversion writing, proof, objections, metadata, microcopy, and claims traceability. |
| `media-sourcing` | Rights-first image/video capture, sourcing, generation decisions, provenance, releases, and ledgers. |
| `technology-curator` | Official-source library research, measured proof, license/security/bundle evidence, and exit paths. |
| `motion-video` | Hero motion, product capture, launch films, advertisements, interactive demos, posters, and cutdowns. |
| `webgl-3d` | Selective model-viewer, Three.js, React Three Fiber, shaders, GPU budgets, context loss, and fallbacks. |
| `landing-page-implementation` | Maintainable production code on the target project's existing stack. |
| `seo-audit` | Crawlability, indexing, canonicals, metadata, internal links, intent, and Core Web Vitals. |
| `aeo-audit` | Human answer clarity and currently supported structured-data/search features. |
| `geo-audit` | Dated cross-engine retrieval, citation, crawler posture, and entity consistency. |
| `conversion-optimization` | Privacy-aware funnels, analytics, replay/heatmap decisions, hypotheses, and experiments. |
| `landing-page-qa` | Browser journeys, responsive states, screenshots, accessibility, console/network, and evidence. |
| `landing-red-team` | Fresh-context P0–P3 critique of copy, design, proof, interaction, rights, accessibility, and performance. |
| `marketing-campaign` | Dated launch strategy, channel roles, asset plan, calendar, owners, and measurement. |

## Quick start

Requirements: Node.js 22+ and Git. Browser QA needs Playwright's Chromium. Motion encode tests use FFmpeg/ffprobe when available.

```bash
git clone https://github.com/ifitsmanu/landing-studio.git
cd landing-studio
npm ci
npm run validate
npm test
```

Install the same skill core for a supported runtime:

```bash
# OpenAI Codex, user-wide
node scripts/install.mjs --runtime codex --scope user

# Gemini CLI, this project
node scripts/install.mjs --runtime gemini --scope project --project /path/to/project

# Other choices
node scripts/install.mjs --help
```

Verified native discovery paths and invocation commands for Claude Code, Codex, Gemini CLI, GitHub Copilot, OpenCode, Cursor, Windsurf/Cascade, and Cline are in [runtime compatibility](docs/COMPATIBILITY.md).

For Claude Code plugin development from a clone:

```bash
claude --plugin-dir /absolute/path/to/landing-studio
```

Then in the target project:

```bash
cp /absolute/path/to/landing-studio/brand-kit.template.md brand-kit.md
```

Fill known facts and leave unknowns explicit. Ask your agent:

```text
Use landing-page-build. Read this project and brand-kit.md first. Create or resume the
Landing Studio run, propose the page frame and section queue, then work only on the first
unapproved section. Show three materially different directions before implementation.
```

## Browser evidence

The bundled harness is the reproducible fallback when `/browse` or another interactive browser is unavailable. It audits accessibility and reduced motion on the target before navigation, then captures viewport, section, interaction-state, failure/final-state screenshots, journeys, console and request failures, and traces into a machine-readable report.

```bash
npm run qa:install
npm run qa:smoke
```

`/browse` remains useful for fast human-like scrolling and critique. It is an adapter, not a hidden requirement, and its output must still satisfy the evidence contract.

## Motion, video, advertisements, and demos

The motion skill selects the smallest justified lane:

- CSS/WAAPI or Motion for live interface behavior;
- GSAP for complex timelines after checking its current license and product fit;
- deterministic Playwright capture plus FFmpeg for product proof and cutdowns;
- Remotion when reusable React video composition creates real leverage;
- Rive/dotLottie for authored interactive vector assets;
- approved generation tools when the runtime has them and provenance/disclosure are recorded.

Every motion concept needs a nonblank poster, reduced-motion/static equivalent, placement review, captions when needed, and a performance/rights budget.

## 3D and immersive work

3D is a selective proof tool, not an automatic premium effect. Landing Studio chooses among `<model-viewer>`, Three.js, React Three Fiber, an authored video, or a static image based on the product job. WebGL work must define device/GPU budgets, model/texture provenance, keyboard/touch behavior, reduced motion, context-loss recovery, and a useful fallback.

The v1 repository provides the acceptance method, not a retained executable reference scene. Treat
3D output quality as unverified until a target project supplies measured browser evidence.

## Libraries and inspiration

- [Library decision guide](docs/LIBRARIES.md) explains defaults, tradeoffs, license caveats, and the dependency evidence gate.
- [Inspiration research](docs/INSPIRATION.md) covers web, editorial, spatial, motion, category, and art-history lanes without cloning references.
- [Media rights](docs/MEDIA-RIGHTS.md) defines acquisition, capture, generation, release, and provenance requirements.

## Truth and marketing constraints

- Every public number, quote, logo, certification, comparison, or testimonial maps to evidence.
- Publicly viewable media is not automatically licensed media.
- Search and AI-retrieval guidance is checked against current official sources at audit time.
- Heatmaps and replay are optional diagnostics, not eye tracking or proof of intent, and require privacy/consent decisions.
- Attention hooks must be specific, true, fulfilled by the page, and free of fake scarcity, confirmshaming, disguised ads, or misleading controls.
- Cross-model and conversion claims are published only with retained runs or first-party data.

## Validate the repository

```bash
npm run metadata
npm run validate
npm test
npm run evals
npm run qa:install
npm run motion:install
npm run test:all
npm run motion:check
```

Immutable tag releases additionally run the complete browser fixture in Chromium and WebKit.

The validator parses Agent Skills frontmatter, enforces the open specification and description budgets, checks generated metadata and local references, validates shared schemas/templates, and rejects false release confidence. Behavioral cases and their honest execution status live in [`evals/`](evals/README.md). Current verified limits and scores live in [the scorecard](docs/SCORECARD.md).

## Open source

Landing Studio is licensed under [Apache-2.0](LICENSE). Read [Contributing](CONTRIBUTING.md), [Governance](GOVERNANCE.md), [Security](SECURITY.md), the [Code of Conduct](CODE_OF_CONDUCT.md), and the [Roadmap](ROADMAP.md) before proposing material changes.

The project values executable evidence over confident prose. A sharp bug report, compatibility run, fixture, case study, or source-backed correction is more valuable than another broad checklist.
