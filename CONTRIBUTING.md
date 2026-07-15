# Contributing

Landing Studio welcomes focused fixes, source-backed craft improvements, executable fixtures, compatibility reports, and new specialist skills.

## Before opening a pull request

1. Search existing issues and Discussions.
2. For a substantial workflow or schema change, open a proposal issue first.
3. Keep one problem per pull request.
4. Base technical claims on official docs, source code, standards, or retained measurements.
5. Do not add copied site designs, unlicensed media, real customer data, secrets, or unsupported marketing claims.

## Local checks

```bash
npm install
npm run validate
npm test
npm run evals
npm run motion:check
```

Browser smoke tests require Chromium:

```bash
npm run qa:install
npm run qa:smoke
```

## Skill requirements

- Follow the [Agent Skills specification](https://agentskills.io/specification).
- Keep `name` equal to the skill directory and descriptions at 1–1,024 characters.
- Declare `license: Apache-2.0` and use progressive disclosure.
- Explain when the skill should and should not activate.
- Prefer deterministic scripts for fragile parsing, state, and validation.
- Add or update behavioral eval cases and negative activation cases.
- Do not add Figma as a required dependency.

## Pull request standard

Describe the problem, evidence, implementation, risks, and verification. Screenshots must include viewport and route information. New dependencies require a completed dependency decision record. New public media requires a completed media ledger entry.

Contributions are licensed under Apache-2.0 under the repository's inbound-equals-outbound policy.
