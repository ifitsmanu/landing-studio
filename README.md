# Landing Studio

A portable skills system for researching, building, validating, and improving high-conversion
landing pages on an existing project stack.

Landing Studio is evidence-first. Every skill reads one project-root
[`brand-kit.md`](./brand-kit.template.md), reuses real product and brand assets, distinguishes
verified claims from hypotheses, and records what must be measured after launch. It does not
promise a universal conversion formula or special AEO/GEO hacks.

## Skills

| Skill | Owns |
|---|---|
| **`landing-page-build`** | **Start here.** Orchestration, approval gates, and final release decision. |
| `landing-research` | Project, customer, market, reference-site, and evidence intake. |
| `landing-design-system` | Brand kit to tokens, type, grid, motion, and component rules. |
| `landing-page-design` | Section composition, hierarchy, hero, responsive behavior, and CTA path. |
| `landing-copywriter` | Conversion copy, proof, objections, metadata, and claims traceability. |
| `motion-video` | Product motion, launch films, hero loops, live motion, and cutdowns. |
| `landing-page-implementation` | Production implementation on the project's existing stack. |
| `seo-audit` | Technical and on-page search foundations. |
| `aeo-audit` | Answer clarity and currently supported structured data. |
| `geo-audit` | Cross-engine retrieval, citation, crawler, and entity visibility. |
| `conversion-optimization` | Ethical analytics, funnel events, replay/heatmaps, and experiments. |
| `landing-page-qa` | Browser, responsive, accessibility, performance, visual, and journey QA. |
| `marketing-campaign` | Launch brief, channel plan, campaign assets, and measurement. |

## End-to-end workflow

```text
brand-kit.md
   -> landing-research              discovery brief + evidence ledger
   -> landing-design-system         tokens + component contract
   -> landing-page-design           approved page specification
   -> landing-copywriter            approved copy deck
   -> motion-video                  motion deliverables when justified
   -> landing-page-implementation   built page
   -> seo-audit + aeo-audit + geo-audit
   -> conversion-optimization       tracking + experiment plan
   -> landing-page-qa               browser evidence
   -> QUALITY GATE                  ship, conditionally ship, or block
```

Stages are adaptive. A static campaign page may not need video or experimentation. A mature page
with traffic may start at CRO and QA. The orchestrator records every skipped stage and why.

## Use it

1. Copy `brand-kit.template.md` to `brand-kit.md` in the target project.
2. Fill known fields. Leave unknown facts explicitly unknown rather than guessing.
3. Ask to **build a landing page**, or invoke a specialist skill directly.

The skills inspect the target repository and its governing documentation before proposing a new
stack or dependency. Existing project utilities and maintained libraries outrank custom code.

## Installation

- **Claude Code plugin:** install this folder using `.claude-plugin/plugin.json`.
- **Loose skills:** copy `skills/*` into the skills directory supported by your agent runtime.

The motion scene templates have their own reproducible setup in
[`skills/motion-video/assets/scene-templates/`](./skills/motion-video/assets/scene-templates/README.md).
No companion plugin or Figma workflow is required. Use the target project's existing design and
implementation tools when they help; Landing Studio remains self-contained.

## Operating principles

- Source every public number, quote, logo, testimonial, and comparison claim.
- Treat attention, scroll, CTA, and content-length guidance as hypotheses until first-party data
  supports them.
- Preserve message match: the page must honor the promise made by the ad, post, email, or query.
- Do not use deceptive urgency, disguised ads, fake scarcity, confirmshaming, or misleading UI.
- Prefer semantic server-rendered content, real product proof, WCAG 2.2 AA, and measurable outcomes.
- Keep SEO as the foundation. AEO and GEO may add useful audits, but they do not replace SEO.

## Validation

```bash
node scripts/validate-repo.mjs
```

The validator checks skill frontmatter, duplicate names, Markdown and backticked repository paths,
canonical contract markers, eval structure, JSON metadata, line budgets, stale banned guidance, README
coverage, and macOS junk files. Use [`evals/evals.json`](./evals/evals.json) with the independent grading
protocol in [`evals/README.md`](./evals/README.md) for behavioral regression testing.
