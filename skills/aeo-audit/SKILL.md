---
name: aeo-audit
description: >-
  Audit a landing page for direct answer clarity and currently supported
  machine-readable search features. Use when the user mentions AEO, answer-engine
  optimization, featured snippets, People Also Ask, answer boxes, structured data,
  JSON-LD, schema markup, rich results, voice answers, FAQ content, or making a
  page easier to answer from. Verify current official eligibility before proposing
  markup, improve visible answers for people first, keep schema in parity with the
  page, and return evidence-backed content and JSON-LD patches. Do not recommend
  deprecated FAQ/HowTo rich results or special AI-writing formulas.
---

# AEO Audit

Improve how clearly a page answers real audience questions while preserving conversion, voice, and
truth. Treat AEO as a focused content and structured-data audit on top of sound SEO, not a separate
ranking system or a set of AI hacks.

Google's current guidance says ordinary SEO remains the foundation for generative search; there is
no required AI-specific markup, content chunk size, or writing style. Verify current official search
documentation at every audit because eligible rich-result types and reporting change.

## Boundaries

- `seo-audit` owns crawling, indexing, canonicalization, performance, titles, and the query-to-page
  map. A page must be eligible for search and snippets before this layer matters.
- `geo-audit` owns cross-engine citation baselines, entity presence, crawler posture, and
  corroboration across the web.
- `landing-copywriter` owns final voice. This skill may draft a precise before/after, but identifies
  it as draft until approved.
- `landing-page-design` owns any new visible section or component.
- Do not force literal question headings, repeated keyword variants, tiny content chunks, or a fixed
  answer length when a clearer page uses another shape.
- Do not add markup for content, ratings, prices, reviews, FAQs, steps, or videos that are not visible
  and true on the page.

## Current deprecation rule

As of May 2026, Google no longer shows FAQ rich results, and HowTo rich results were already removed.
Do not recommend `FAQPage` or `HowTo` as Google rich-result work and do not validate them as Google
release requirements. Visible FAQ and step content can still help users when the audience needs it.
Only add corresponding markup for another explicitly named consumer after verifying that consumer's
current official support and that the maintenance cost is justified.

## Inputs

Read the rendered page, raw response HTML, project-root `brand-kit.md`, discovery brief, evidence
ledger, approved copy, query/search data when available, and the site's existing structured data.

Use these canonical fields:

| Field | Use |
|---|---|
| `brand.name` | Entity naming consistency |
| `product.one_liner` | Factual definition seed |
| `product.audience` | Audience vocabulary and question relevance |
| `voice` | Answer register and project precedence |
| `proof` | Only permitted facts, numbers, ratings, prices, and named proof |
| `cta` | Message match and useful next step |
| `competitors` | Sourced comparison questions and parity checks |
| `research` | Customer language and primary sources |

Never invent a definition, price, profile, competitor fact, certification, rating, or social proof.

## Workflow

### 1. Verify the foundation

Confirm the page is indexable, eligible for a snippet, present in server/prerendered HTML when the
stack allows it, and not suppressed by `nosnippet` or an unintentionally restrictive `max-snippet`.
Route technical findings to `seo-audit` and continue only where the answer layer can be evaluated.

### 2. Build the question set

Derive questions from first-party query data, Search Console, sales/support/interview language,
on-site search, current SERPs, and the approved discovery brief. Classify each as definition,
comparison, factual, process, eligibility, objection, or next-step.

Choose only questions this page should own. Route broad education, documentation, support, pricing,
and third-party recommendation queries to the most appropriate page instead of bloating one landing
page.

For each question record source, audience segment, intent, current winning source/format when
observable, owning page/block, current answer status, and business value. A search result observation
is dated evidence, not a permanent engine rule.

### 3. Audit visible answer clarity

For each owned question, check whether the page:

- gives the answer without throat-clearing or forcing a click;
- makes the subject/entity unambiguous when the passage stands alone;
- uses the format the answer needs: sentence, paragraph, list, table, steps, media, or calculator;
- includes only sourced facts and necessary qualifications;
- remains understandable in the page's visual hierarchy and brand voice;
- offers a relevant next step without withholding the answer;
- exists in the DOM even when an accordion or interaction controls visibility.

Length is determined by completeness and user need. Make the first sentence useful, then add enough
context to prevent a misleading extraction. Do not pad to a word count or split coherent material
into artificial chunks.

### 4. Audit structured data

Inventory every JSON-LD/microdata/RDFa node and compare it with current visible content and the
engine's current supported feature documentation. Prefer a coherent `@graph` with stable `@id`
references when it improves consistency; a graph is not required simply because it looks complete.

Common landing-page candidates include `Organization`, `WebSite`, `WebPage`, a truthful product type
such as `SoftwareApplication`, `Product`, or `Service`, `BreadcrumbList` on appropriate subpages, and
`VideoObject` for an actual embedded public video. Eligibility and required properties vary. Verify
them at audit time; do not guess `sameAs`, offers, ratings, availability, or application category.

Validate vocabulary at Schema.org and eligible Google features with the current Rich Results Test.
Validation proves syntax/feature eligibility, not ranking, display, or factual accuracy.

### 5. Protect conversion and trust

Keep the hero focused on comprehension and action. Add answer depth where it resolves a real
objection rather than turning the hero into a glossary. Preserve message match among query, answer,
CTA label, and destination. Do not use `data-nosnippet` merely to force the preferred passage without
examining the user impact and search tradeoff.

## Severity

- `P0`: materially false or hidden structured data, fabricated rating/price/review, or spam-policy
  exposure.
- `P1`: critical owned question is answered incorrectly, key markup contradicts visible content, or
  primary answer content is unavailable in rendered/raw HTML for relevant consumers.
- `P2`: high-value question missing/unclear, eligible useful schema missing, or answer/CTA mismatch.
- `P3`: low-value clarity, maintainability, or optional feature improvement.

## Output contract

Create `AEO-AUDIT.md` with:

1. **Scope and current-source check**: URL, date, engine docs verified, inputs available.
2. **Scorecard**: foundation, question evidence, answer clarity, structured-data parity, conversion
   path.
3. **Question coverage map**: question, evidence source, intent, owner, current state, recommendation.
4. **Content patches**: selector/heading, evidence, before, draft after, rationale, owning skill.
5. **Structured-data patch**: only justified nodes, ready to paste, with every property traced to
   visible content or a canonical kit field.
6. **Deprecations/removals**: obsolete, redundant, unsupported, or misleading markup to delete.
7. **Verification**: raw HTML, validator, eligible rich-result test, rendered parity, Search Console
   monitoring, and post-release query/CTR/conversion review.

## Gate

Pass when every P0/P1 is resolved or explicitly blocked, public facts map to evidence, markup matches
visible content, proposed types have current official support for the stated purpose, and content
changes improve a real user question rather than satisfy a formula.

## References

- `references/structured-data.md`: current-safe graph patterns, deprecations, parity, validation.
- `references/answer-formatting.md`: evidence-based question selection and format choices.
- `references/audit-runbook.md`: evidence capture, severity, reporting, and post-release loop.

Current primary-source baseline, re-check at audit time:

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/updates
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://schema.org/
