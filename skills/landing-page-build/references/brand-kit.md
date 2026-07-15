# The Brand Kit — the packet's shared input contract

The kit is the only place brand-specific values may exist, and it is shared:
every landing-studio skill — `landing-design-system`, `landing-page-design`,
`landing-copywriter`, `motion-video`, the audits — reads this same file. It is
the packet's canonical `brand-kit.md`, copied from the packet-root template.
Everything downstream (tokens, layouts, copy, film beats, markup, audit
baselines) is parameterized on it. If a hex code, typeface name, product stat,
customer quote, or URL appears anywhere other than the kit (or artifacts
generated *from* it), that is a portability bug: fix it before proceeding.

## Contents

1. [Schema — field by field](#schema)
2. [Field rules that prevent the classic failures](#field-rules)
3. [Intake questionnaire](#intake-questionnaire)
4. [Defaults for absent fields](#defaults)
5. [The defer-to-project rule](#defer-to-project-rule)
6. [Claims-source ledger](#claims-source-ledger)
7. [Worked example](#worked-example)

## Schema

The packet-root `brand-kit.template.md` is the only canonical schema. Copy it
to the target project's `brand-kit.md` and preserve its field names. Do not
reproduce a smaller YAML shape inside a sibling skill: that caused contract
drift between `audience`/`icp`, `product-media`/`ui_material`, and
`proof`/`claims`.

| Concern | Canonical path |
|---|---|
| Brand identity | `brand.name`, `brand.logo`, `brand.colors`, `brand.type` |
| Product and audience | `product.one_liner`, `product.category`, `product.audience`, `product.capabilities` |
| Product evidence | `product.ui_material` |
| Voice | `voice.defer_to`, `voice.tone`, `voice.use`, `voice.avoid` |
| Public proof | `proof.claims`, `proof.testimonials`, `proof.customer_logos`, `proof.forbidden_claims` |
| Conversion path | `cta.verb`, `cta.destination`, `cta.secondary` |
| Alternatives | `competitors` |
| Research and traffic | `research`, `analytics` |
| Motion inputs | `motion` |
| Delivery limits | `constraints` |

Skill-specific information extends these sections. It never moves a canonical
field or creates a second source of truth.

## Field rules

These rules exist because each one blocks a specific, recurring failure:

- **`brand.logo.files` is mandatory if a logo appears.** A retyped wordmark is
  the single most common giveaway of an amateur page — real wordmarks carry
  custom kerning, ink traps, and cuts no font setting reproduces.
- **`brand.colors.contrast_notes` is not optional decoration.** `landing-design-system`
  verifies every text/background pair; recording what the brand already knows
  about its contrast failures saves a round trip and prevents shipping
  display-only pairs at body size.
- **`product.audience` must be specific enough to exclude someone.** "Anyone
  with data" designs nothing; "data leads at 50–500-person SaaS companies"
  chooses the vocabulary, the proof, and the objections the page must answer.
- **`cta` identifies one primary verb + destination.** A complex buying journey
  may also have a visibly subordinate secondary route. Treat focus as the default
  and verify performance from first-party data instead of claiming a universal
  conversion penalty.
- **`proof.claims` is a whitelist supplied by the user, never by the skill.**
  No source row, no appearance on the page — this is the mechanical form of
  the honesty contract, and it is generic: this skill names no stat, ever.
- **`competitors` are named, not implied.** Copy positions against something;
  the audits benchmark against something. Leaving this empty makes both vague.

## Intake questionnaire

Ask only what the kit is missing. Batch the questions; don't drip them.

1. What is the product, in one sentence, to someone who has never seen it?
2. Who exactly must this page convert? (Role, company shape, situation → `audience`)
3. Brand colors — primaries and neutrals, with any known contrast/usage rules?
4. Typefaces (display/body/mono) with files, and logo files?
5. What product material exists — screenshots, recordings, a URL I can capture?
   Is the data in it real, and may it appear on the page?
6. Does this project have a brand-voice or design-system document/skill I
   should defer to? If not: three to five words for the tone, and words you
   never use?
7. What is the ONE thing a convinced visitor should do, and where does it
   happen? (→ `cta`) Any subordinate secondary action?
8. Every number, quote, or customer name that could appear on the page — with
   a source for each? (→ `proof.claims` + ledger)
9. Who does the audience compare you to today? (→ `competitors`)

## Defaults

When a field is absent and the user has no preference, apply these — always
stating that they're defaults and overridable. Never *silently* impose them,
and never invent values for fields marked "must ask."

| Field | Default | Why this default |
|---|---|---|
| `voice.tone` | Declarative, present tense, short, concrete, zero hype adjectives | The register shared by the entire reference canon (OpenAI, Stripe, Linear, …). |
| `brand.colors.neutrals` | Derive a 4-step ramp between bg and fg | A missing ramp must not become invented brand colors; interpolation is neutral. |
| `brand.colors.primary.accent` | **Must ask or omit the accent role** | Reusing foreground as accent changes emphasis semantics and must not happen silently. |
| `brand.type.mono` | Omit | Mono signals developer product; adding it uninvited changes positioning. |
| `cta.secondary` | Omit | The page is stronger with one ask; secondaries are opt-in. |
| `brand.name` rendering | Exactly as the user writes it | Casing/spacing of a name is identity, not style. |
| `product.one_liner`, `product.audience` | **Must ask** | The page's spine cannot be defaulted. |
| `cta.verb` + `destination` | **Must ask** | Guessing a CTA invents strategy. |
| `brand.logo.files`, `brand.type.files` | **Must ask** (or omit logo / use a system stack with disclosure) | Approximating identity assets violates the honesty contract. |
| Any on-page number/quote/name | **Must ask** for a ledger source | Never fabricate. |

## Defer-to-project rule

If the project ships a brand-voice skill, a design-system file (tokens,
DESIGN.md, a theme), or a review skill:

- **Defer to it** for tone, vocabulary, color/type tokens, and any brand gates
  — those artifacts outrank this packet's defaults wherever they overlap.
  Record the pointer in `voice.defer_to` (and note design-system sources for
  stage 1) so every sibling skill sees the same precedence.
- **Never require it.** The packet must produce a finished page from the kit
  alone on a project that has nothing. The defer rule is an upgrade path, not
  a dependency.
- On conflict between a project token and a user-supplied kit value, surface
  the conflict and let the user decide; don't pick silently.

## Claims-source ledger

Every number, quote, customer name, logo, or benchmark that appears **on the
page** gets a row *before* it appears in any design or copy draft. No row, no
render. `landing-copywriter` writes only from this ledger; the quality gate
walks the finished page against it row by row.

```markdown
| ID | On-page text | Status | Source | Verified by | Date | Allowed use | Caveat |
|---|---|---|---|---|---|---|---|
| claim-001 | "<claim as rendered>" | VERIFIED | <where substantiated> | <owner> | YYYY-MM-DD | page/video/all | <rounding, limits> |
```

Rules: the *user* supplies sources — this skill whitelists no stat; rounding
must be conservative and noted; customer names and logos require documented
permission; anything forbidden by legal/leadership is listed and checked
against every draft at both approval gates and again at the final gate.

## Worked example

Use `acme-example.md` for the end-to-end orchestration example. Create its
`brand-kit.md` by filling the packet-root `brand-kit.template.md`; this reference
intentionally does not duplicate a second YAML schema that can drift.
