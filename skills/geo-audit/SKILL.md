---
name: geo-audit
description: >-
  Audit how a brand and its landing pages are retrieved, cited, linked, or
  misrepresented across generative search and answer products such as Google AI
  features, ChatGPT Search, Claude search, Perplexity, Gemini, and Copilot. Use
  for GEO, AI search visibility, LLM citations, crawler access, robots posture,
  entity consistency, answer accuracy, competitor share of citations, llms.txt,
  or agent-friendly site questions. Verify each vendor's current official docs,
  measure a dated prompt panel, keep SEO as the foundation, and return a sourced
  plan. Do not promise special AI ranking hacks, mandatory chunking, or llms.txt
  benefits that a target engine has not documented.
---

# GEO Audit

Measure and improve how a brand appears in retrieval-backed generative answers. The deliverable is a
dated, evidence-backed visibility plan, not a promise that publishing a particular file or paragraph
shape will force a citation.

For Google, current official guidance treats AEO/GEO work as ordinary SEO plus valuable, unique,
people-first content. Google says it does not use `llms.txt`, does not require tiny content chunks,
does not require AI-specific rewriting, and does not require special generative-search structured
data. Preserve these facts in every Google recommendation.

## Boundaries

- `seo-audit` owns the technical/indexing foundation and query-to-page map.
- `aeo-audit` owns visible answer clarity and currently supported structured data.
- `landing-research` owns product/market/customer evidence and reference analysis.
- `landing-copywriter` owns final copy; `marketing-campaign` owns legitimate outreach and earned
  coverage.
- This skill may recommend a content asset, crawler change, measurement loop, or entity correction;
  it does not fabricate mentions, reviews, community posts, comparison claims, or citations.

## Inputs

Read the rendered/raw page, project-root `brand-kit.md`, discovery brief, evidence ledger, search and
referral analytics, server/CDN logs when available, robots/WAF configuration, sitemap, and current
public profiles. Use canonical `brand.name`, `product.one_liner`, `product.audience`, `proof`,
`competitors`, `research`, `analytics`, `cta`, and `constraints`.

Never guess the competitive set or publish unsourced claims to look “citation worthy.”

## Current-source rule

Before client-facing conclusions, verify crawler names, search eligibility, opt-out behavior,
reporting, and machine-readable conventions against each target vendor's current official docs.
Record URLs and access dates. Engine behavior, models, and user agents change too quickly for this
repository to be the final authority.

## Workflow

### 1. Define the target surfaces and questions

Choose surfaces the audience actually uses and questions this brand has a legitimate reason to
answer. Derive prompts from query/customer evidence and the buying journey. Include brand definition,
category, comparison, use case, eligibility, implementation, pricing, and risk only when relevant.

Version the panel. For every run record date/time, product/surface, account or locale when relevant,
mode/model if exposed, exact prompt, answer, cited/linked URLs, brand mention, accuracy, recommendation
context, and follow-up path. Generated answers are stochastic; repeat important prompts and report
variance rather than one screenshot as truth.

### 2. Establish the baseline

Score separately:

- presence: brand is mentioned;
- source: an owned or approved page is cited/linked;
- accuracy: material facts are current and correct;
- relevance: the brand appears for the right audience/use case;
- referral: traffic reaches the site with identifiable source data;
- outcome: visitors complete the intended next step.

Do not collapse these into one “GEO score.” A mention without accuracy can be harmful; a citation
without qualified referral may have little business value.

### 3. Audit access and retrieval

Use `references/ai-surfaces.md`. Inspect robots.txt, meta robots, CDN/WAF bot controls, IP validation,
rate limits, raw HTML, redirects, walls, canonicals, and server logs. Distinguish training crawlers,
search/index crawlers, user-initiated fetchers, and agent/browser interaction. They have different
business and privacy consequences.

Allowing search retrieval is the normal choice only when the owner wants that channel. Training
access is a separate explicit IP/data-governance decision. Do not bundle them in an “allow all AI”
snippet.

### 4. Audit source quality

Prioritize original, useful, maintainable evidence: primary product documentation, benchmarks with
methodology, dated pricing, public changelogs, original research, calculators, case studies with
permission, real video/image assets, and clear comparison methodology. Search systems may quote
passages, but there is no mandatory chunk size. Make important claims understandable in context and
available in accessible text.

Route commodity or scaled AI-written pages to removal/consolidation. Google's spam policies apply to
scaled content created without user value.

### 5. Audit entity consistency and corroboration

Check canonical name/category/description and current facts across the site, official profiles,
repositories, directories, app stores, partner pages, and legitimate third-party sources. Resolve
material contradictions. `sameAs` can connect verified equivalent profiles, but it does not create
authority or replace real public evidence.

Independent coverage is useful when earned. Never seed undisclosed posts, manufacture reviews,
purchase deceptive mentions, or edit reference sites without meeting their policies and notability
rules.

### 6. Audit freshness and correction paths

Identify drift-prone facts such as price, availability, integrations, limits, compliance, locations,
and model names. Require visible dates/methodology where useful, one source of truth, and a maintenance
owner. When an answer is wrong, trace the likely stale source, correct owned surfaces, use vendor
feedback/removal mechanisms where applicable, and rerun the same panel.

### 7. Audit agent usability

When browser agents are in scope, test the actual journey. Use semantic HTML, native controls, clear
accessible names/roles/states, deterministic form behavior, and server-visible destinations. OpenAI
specifically recommends WAI-ARIA-friendly interfaces for its browser agent. Treat accessibility as
the base interface contract, not an AI-only layer.

## `llms.txt` decision

Do not ship `llms.txt` by default. Google explicitly says it ignores the file for search and
generative features. For another service, require current official evidence that the service uses it
for the intended purpose, or document it as a low-cost navigational convention with no visibility
claim. Account for maintenance and stale-link risk. A docs vendor exposing its own `llms.txt` does not
prove search-ranking use.

## Severity

- `P0`: sensitive/forbidden data exposure, materially false generated answer causing risk, or a
  channel explicitly required by the business is blocked across key pages.
- `P1`: key pages unavailable to an intended retrieval system, critical facts stale/contradictory,
  or target questions consistently cite incorrect/irrelevant sources.
- `P2`: missing original evidence, weak entity consistency, unmeasured referral path, or high-value
  coverage gap.
- `P3`: optional convention, low-impact profile cleanup, or exploratory surface.

## Output contract

Create `GEO-AUDIT.md` with:

1. scope, target surfaces, official docs checked, and access dates;
2. versioned prompt panel and repeatability notes;
3. baseline by presence, source, accuracy, relevance, referral, and outcome;
4. crawler/robots/WAF/raw-HTML/log findings;
5. source-quality, entity, corroboration, freshness, and agent-usability findings;
6. claims and pages to repair, create, consolidate, or remove;
7. prioritized plan with owner, evidence, effort, target surface, expected mechanism, and verification;
8. measurement cadence and analytics/referral conventions;
9. routing to SEO, AEO, research, copy, implementation, QA, or campaign skills.

## Gate

Pass when every conclusion is dated and sourced, training and search access decisions are separated,
material answer errors have owners, the plan relies on user value and legitimate evidence, Google
recommendations match Google's current guidance, and no unsupported ranking or citation guarantee is
presented as fact.

## References

- `references/ai-surfaces.md`: official crawler roles, access, raw HTML, agents, and `llms.txt`.
- `references/citability.md`: evidence and content-quality review; ignore any fixed chunk formula that
  conflicts with this skill or current official guidance.
- `references/measurement.md`: prompt panel and longitudinal measurement.
