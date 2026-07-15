# Evaluation protocol

`evals.json` is a behavior suite, not a keyword checklist. Run each prompt against a clean target
project with the relevant Landing Studio skill available, capture the complete response and artifacts,
then grade every assertion from observable evidence.

## Run record

Record for each run:

- repository commit or working-tree identifier;
- agent/model and version;
- date and source-document cutoff;
- target stack and supplied fixtures;
- output/artifact paths;
- assertion result: `PASS`, `FAIL`, or `NOT TESTED`;
- exact evidence or failure reason;
- grader identity/model, kept independent from the generating run when possible.

An assertion passes only when the output explicitly demonstrates it. Missing evidence is not a pass.
Do not award credit for mentioning a concept without performing the required decision, check, or
handoff. Re-run failed assertions after a fix and retain both results so regressions remain visible.

## Required coverage

The five scenarios cover:

1. full evidence-first orchestration in an existing Next.js project;
2. rejection of obsolete or unsupported AEO/GEO tactics;
3. ethical, consent-aware CRO and behavioral analytics;
4. professional motion/video with rights, truth, accessibility, and page-performance controls;
5. browser-based release QA beyond a passing build.

Update the suite when a search engine, crawler, browser, privacy requirement, or supported production
path changes. Verify unstable assertions against current primary sources before grading.
