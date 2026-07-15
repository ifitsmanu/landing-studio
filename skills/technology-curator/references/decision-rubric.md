# Technology decision rubric

## Evidence hierarchy

Prefer, in order appropriate to the claim:

1. source code, license text, specification, or standards body;
2. official documentation, support policy, security policy, release notes, and changelog;
3. official repository and package registry metadata;
4. recognized advisory database linked to the affected version;
5. maintainer issue or discussion for a narrow unresolved detail.

Marketing claims, download counts, stars, opinion posts, gallery examples, search snippets, and AI
summaries may identify candidates but cannot close a decision. Record access dates because licenses,
support, pricing, and advisories change.

## Mandatory candidate questions

| Dimension | Required evidence |
|---|---|
| Need fit | minimal API surface used and acceptance test passed |
| Existing capability | manifest/import audit and reason reuse is insufficient |
| Maintenance | current release/support policy, ownership, deprecation state, update path |
| License | exact package/version license plus commercial terms if separate |
| Security | security policy, applicable advisories, exposed attack/data surface |
| Bundle | production baseline and candidate build, tool output, compression context |
| Runtime | representative device/browser trace for the actual interaction |
| Browser/platform | official support statement plus target-browser proof |
| Accessibility | keyboard, semantics, reduced motion, fallback; not just vendor claims |
| Privacy | data flow, storage, vendors/subprocessors, consent and deletion when applicable |
| Operations | owner, monitoring, version policy, failure behavior, rollback |
| Exit | removal/migration steps and data/content portability |

## Decision rules

Reject or block when:

- official sources conflict and the material conflict is unresolved;
- the governing license or commercial terms are unclear;
- an applicable known vulnerability has no acceptable mitigation;
- the candidate requires prohibited data collection or consent behavior;
- the proof misses a hard browser, accessibility, performance, SSR, or CSP requirement;
- the fallback loses primary content or conversion;
- the team cannot state an owner and practical removal path.

A candidate does not win by scoring. Hard gates apply first. Among passing candidates, prefer the
smallest API and dependency footprint that the team can operate safely.

## Measurement discipline

Record:

- repository revision, runtime/package-manager versions, build mode, browser/device, and date;
- exact commands and configuration;
- baseline and candidate values, not only a delta;
- whether values are raw, minified, compressed, loaded, executed, or cached;
- at least three samples for noisy runtime measures, with variability visible;
- known limitations and differences between lab and field conditions.

Do not quote a package-size website as the production bundle result. Do not claim performance from a
desktop-only trace when low-end mobile is in scope.

## Trial discipline

A `TRIAL` is safe only with:

- one active-section scope;
- owner and expiry date;
- success and removal criteria;
- no irreversible data or content lock-in;
- fallback and rollback path;
- explicit plan to convert to `ADOPT` or remove before expiry.
