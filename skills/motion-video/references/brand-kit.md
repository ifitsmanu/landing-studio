# Motion inputs in the canonical brand kit

Do not create a second motion-specific brand schema. Read the project-root `brand-kit.md` generated
from the packet's `brand-kit.template.md`.

## Core paths used

- `brand.logo`, `brand.colors`, `brand.type`
- `product.one_liner`, `product.capabilities`, `product.ui_material`
- `voice`
- `proof` and `proof.forbidden_claims`
- `cta`
- `analytics` and `constraints`

## Motion extension

The canonical `motion` section contains:

```yaml
motion:
  primary_placement: "<hero|feed|launch-film|keynote|none>"
  claim: "<one sourced idea the motion must prove>"
  beats: ["<observable product beats>"]
  cutdowns: ["<placements/aspect ratios>"]
  duration_target_seconds: "<number|unknown>"
  generation_policy: "<authored-only|generative-allowed-with-disclosure|unknown>"
```

The motion brief may add production details such as safe zones, frame rate, audio, budget, and
approval owner. Keep those in `MOTION-BRIEF.md`; do not move canonical brand/product/proof/CTA fields.

## Intake

Ask only for missing decisions that affect concept, rights, privacy, cost, or delivery:

1. What placement and audience state matter first?
2. What single approved claim should the viewer remember?
3. Which observable product beats prove it?
4. What safe screenshots, recordings, or demo access exist?
5. Which live/browser/video production lanes are allowed?
6. What duration, aspect ratios, sound context, locales, and cutdowns are required?
7. What claims, data, people, locations, marks, music, or generated media are prohibited?
8. Who approves product accuracy, brand, legal/rights, and final delivery?

No source means no public factual claim. No permission means no customer identity, face, voice, logo,
or private data. Label simulated data and time compression visibly.

## Mapping

Map the canonical tokens into the chosen production system through one adapter layer. Templates and
compositions read adapter variables/props, not hardcoded client values. Record any vendor-specific
schema in source code or the production brief, not in `brand-kit.md`.
