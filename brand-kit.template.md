# Brand Kit: canonical project input

Copy this file to `brand-kit.md` in the target project's root. Fill only what is known and preserve
the field names. Every Landing Studio skill reads this contract; skill-specific inputs extend it
without redefining it.

`unknown` is valid. Invented evidence is not.

```yaml
kit_version: "1.1"
updated_at: "YYYY-MM-DD"
owner: "<person or team that approves brand and claims>"

brand:
  name: "<exact public name>"
  logo:
    files: ["<real SVG/PNG paths>"]
    clearspace: "<brand rule or unknown>"
  colors:
    primary:
      bg: "<hex>"
      fg: "<hex>"
      accent: "<hex or unknown>"
    neutrals:
      - { value: "<hex>", role: "<muted text|border|surface>" }
    usage: "<where each role may appear>"
    contrast_notes: "<known results; implementation must verify>"
  type:
    display: "<family or system stack>"
    body: "<family or system stack>"
    mono: "<family|null>"
    files: ["<font file paths, if licensed and supplied>"]

product:
  one_liner: "<what it is, one factual sentence>"
  category: "<category buyers already understand>"
  audience: "<primary buyer/user, company shape, and situation>"
  capabilities:
    - "<capability that can be demonstrated or sourced>"
  ui_material:
    screenshots:
      - path: "<local path>"
        owner: "<rights owner>"
        contains_real_customer_data: false
        allowed_channels: ["page"]
    recordings:
      - path: "<local path>"
        owner: "<rights owner>"
        contains_real_customer_data: false
        allowed_channels: ["page", "video"]
    live_url: "<URL|null>"
    demo_access: "<safe access instructions or null; never place secrets here>"

voice:
  defer_to: "<project voice/design document path or null>"
  tone: ["<3-5 concrete adjectives>"]
  use: ["<preferred terms or patterns>"]
  avoid: ["<forbidden terms, hype, or register>"]
  reading_level: "<audience expectation>"

proof:
  claims:
    - id: "claim-001"
      text: "<exact permitted wording>"
      source: "<primary document, URL, dataset, or owner>"
      source_snapshot: "<local evidence path or immutable URL>"
      verified_at: "YYYY-MM-DD"
      verified_by: "<owner>"
      allowed_channels: ["page"]
      expires_at: "<YYYY-MM-DD|null>"
      caveat: "<qualification or null>"
  forbidden_claims: ["<claims legal, security, or leadership forbid>"]
  testimonials:
    - id: "testimonial-001"
      quote: "<exact approved wording>"
      person_name: "<public attribution or anonymous role>"
      person_role: "<approved role>"
      organization: "<approved organization or null>"
      source: "<recording, transcript, email, or approval record>"
      approved_by: "<speaker or authorized owner>"
      approved_at: "YYYY-MM-DD"
      allowed_channels: ["page"]
      expires_at: "<YYYY-MM-DD|null>"
  customer_logos:
    - id: "logo-001"
      organization: "<public organization name>"
      file: "<approved local logo path>"
      permission_source: "<contract, brand portal, or written approval>"
      allowed_channels: ["page"]
      usage_rules: "<clearspace, color, placement, attribution>"
      expires_at: "<YYYY-MM-DD|null>"

media:
  ledger_path: ".landing-studio/media-ledger.yaml"
  supplied_assets_are_approved: false
  external_sources_allowed: ["<approved providers or none>"]
  identifiable_people_policy: "<release requirement>"
  trademark_policy: "<brand/product/logo handling>"
  generative_disclosure: "<required placement or none>"

cta:
  verb: "<primary imperative label>"
  destination: "<URL or action>"
  secondary:
    label: "<optional subordinate action or null>"
    destination: "<URL or null>"

competitors:
  - name: "<named alternative>"
    source: "<official current page used for comparison>"
    buyer_context: "<why the audience compares it>"

research:
  project_docs: ["<repo docs, briefs, customer research, call transcripts>"]
  reference_sites:
    - url: "<URL>"
      study: "<specific pattern to learn from, not clone>"
      captured_at: "YYYY-MM-DD"
      artifact: "<screenshot/note path>"
  customer_language_sources: ["<support, sales, reviews, interviews> "]
  market_constraints: ["<jurisdiction, category, seasonality, procurement> "]

analytics:
  current_stack: ["<analytics, replay, consent, experimentation tools or none>"]
  baseline_window: "<date range or none>"
  primary_conversion: "<event that proves CTA completion>"
  consent_requirements: "<jurisdictions and project policy; obtain legal review when needed>"

motion:
  primary_placement: "<hero|feed|launch-film|keynote|none>"
  claim: "<one sourced idea the motion must prove>"
  beats: ["<observable product beats>"]
  cutdowns: ["<placements/aspect ratios>"]
  duration_target_seconds: "<number|unknown>"
  generation_policy: "<authored-only|generative-allowed-with-disclosure|unknown>"

constraints:
  accessibility_target: "WCAG 2.2 AA"
  legal: ["<required wording, prohibited claims, regulated-category rules>"]
  privacy: ["<data collection and recording limits>"]
  localization: ["<languages, locales, reading direction>"]
  performance: ["<project budgets or unknown>"]
  launch_date: "<YYYY-MM-DD|flexible|unknown>"
```

## Evidence rule

Every public number, quote, named customer, logo, certification, benchmark, and factual competitor
comparison must map to a `proof` row or an attached evidence ledger before it is drafted. Record
simulated product data as simulated in the visible experience. Do not put credentials, private
customer data, or secrets in this file.

## Precedence

Current project documentation and tokens outrank this template where they conflict. Record the
authoritative paths in `voice.defer_to` or `research.project_docs`, surface unresolved conflicts,
and get the appropriate owner to decide. A default may fill a stylistic gap; it may never create a
business fact, legal position, customer quote, CTA destination, or product capability.
