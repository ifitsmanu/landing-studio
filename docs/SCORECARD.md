# Landing Studio v1 scorecard

## Verified baseline

| Lane | Baseline | v1 release target | Evidence |
| --- | ---: | ---: | --- |
| Deterministic contract cases | 9/9 pass | 9/9 pass | `evals/results/v1.0.0-baseline.json` |
| Weighted contract assertions | 83/83 | 83/83 | Same retained result |
| Cross-model behavioral runs | 0 verified | No claim without retained evidence | All six runtime rows are explicitly `unrun` |

## Independent v1 freeze review

**Harsh weighted score: 8.1/10. Verdict: SHIP v1.0.0.** The release freeze found no open P0 or
P1 code blocker after the artifact-containment, immutable-finding, and interaction-state regressions
were added. The detailed rubric and retained limitations are in
[`docs/releases/v1.0.0-red-team.md`](releases/v1.0.0-red-team.md).

The 9/9 result is a deterministic fixture-and-schema baseline, not a model-quality score. It covers
positive and negative routing, one-section orchestration, claim controls, approval locks, media
rights, browser evidence shape, 3D fallback, and independent P1 blocking.

## Release interpretation

- Any failed P0 or P1 assertion blocks the deterministic lane.
- A changed fixture requires an inspected baseline diff, never an automatic score update.
- Model/runtime performance is publishable only when the complete clean-context run and independent
  grading evidence are retained at the declared path.
- Live evaluations follow the Agent Skills guidance: clean contexts, realistic varied prompts,
  with-skill comparison, retained outputs/timing/grading, human review, and repeated trigger checks.
- Browser and motion smoke tests remain separate release gates. This scorecard does not substitute
  fixture contracts for real rendered evidence.

## Reproduce

```bash
npm ci
npm run evals
node scripts/run-evals.mjs --json
node scripts/validate-repo.mjs --skip-tests
```

## Remaining limitations

No cross-model activation or output-quality run has been retained yet. No real landing-page case
study or executable WebGL reference scene ships in v1. The deterministic outputs are canonical
contract fixtures, so they detect policy/schema drift but cannot measure instruction following,
visual taste, research quality, or live-browser execution by a model. Runtime compatibility beyond
the tested installer paths is based on current official discovery conventions, not retained native
end-to-end runs. Those claims remain unrun rather than inferred from the fixture score.
