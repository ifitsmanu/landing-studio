# Executable evaluation protocol

Behavioral runs follow the official Agent Skills [evaluation](https://agentskills.io/skill-creation/evaluating-skills)
and [description-optimization](https://agentskills.io/skill-creation/optimizing-descriptions) guidance:
clean contexts, realistic varied prompts, with-skill comparisons, retained outputs and timing,
independent grading, human review, and repeated trigger/non-trigger queries. The deterministic fixtures
below are contract regressions, not a substitute for those runs.

The committed suite in `evals.json` runs nine deterministic contract cases covering activation,
non-activation, one-section orchestration, claims integrity, approval locks, media rights, browser
evidence, 3D fallback, and P1 red-team blocking.

Run it with:

```bash
npm run evals
node scripts/run-evals.mjs --json
```

Each case retains both its input request and structured observed fixture. The runner resolves JSON
Pointers, executes weighted assertions, validates evidence objects against repository schemas, and
compares the complete deterministic result with `results/v1.0.0-baseline.json`. Missing fixtures,
rubrics, schemas, or changed observations fail the command.

To intentionally refresh the baseline after reviewing a contract change:

```bash
SOURCE_DATE_EPOCH=<unix-seconds> node scripts/run-evals.mjs --write
git diff -- evals/results/v1.0.0-baseline.json
```

## What this proves

The deterministic suite proves the repository's fixture contracts and release policies are
machine-gradable. It does not prove that a live model will activate the right skill or produce the
canonical fixture. That requires a clean-context model run with complete prompts, outputs,
artifacts, runtime version, model identifier, commit, and independent grading retained in-repo.

Every cross-model row remains `unrun` until that evidence exists. The runner rejects a claimed
cross-model result whose evidence path is missing.
