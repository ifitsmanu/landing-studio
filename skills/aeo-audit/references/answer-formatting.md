# Answer clarity: choose the format the question needs

The goal is a useful, truthful passage that still works when quoted out of context. There is no
universal word count, heading formula, or content-chunk size that earns extraction.

## Select questions from evidence

Build the question set from, in descending confidence:

1. Search Console/query and on-site search data.
2. Sales, support, interview, survey, and usability language.
3. Current SERP and answer-surface observations, captured with date and locale.
4. Product docs, pricing, security, and onboarding questions.
5. Competitor questions only when the page has current primary-source evidence to compare.
6. Hypotheses, labeled as such, when evidence is absent.

Do not generate dozens of keyword variants to create artificial coverage. Group semantically
equivalent questions around the user decision they support.

## Match question to format

| Question shape | Usually useful format | Quality test |
|---|---|---|
| Definition | Direct sentence plus necessary mechanism/context | Identifies entity, category, and differentiator truthfully |
| Fact or eligibility | Answer first, then qualification/source | Does not hide the limiting condition |
| Process | Ordered steps or concise workflow diagram with text equivalent | Sequence is real, complete, and actionable |
| Comparison | Accessible table or paired criteria | Same dated criteria and sources apply to every option |
| Options | Short list with selection criteria | Items are distinct and ordering is explained |
| Calculation | Formula/calculator plus assumptions | Inputs, units, date, and limitations are visible |
| Objection | Plain answer with proof and caveat | Resolves anxiety without overclaiming |

Use a literal question heading when that is the clearest language for the audience. A precise
statement heading is equally valid when it fits the page better. Preserve a logical heading outline.

## Passage anatomy

A robust answer usually contains:

1. **Answer:** give the useful answer immediately.
2. **Subject:** make the entity or topic unambiguous when the passage stands alone.
3. **Qualification:** include the condition that prevents a misleading extraction.
4. **Evidence:** link or cite the approved source when the claim needs proof.
5. **Next step:** offer relevant depth or action after the answer, without withholding it.

The first sentence should be useful, not optimized to an arbitrary character count. Add as much
context as needed for accuracy and user comprehension, then remove repetition and throat-clearing.

## Placement

- Keep the hero focused on product, audience relevance, proof direction, and action.
- Put a product definition near the top only when category comprehension is a real problem.
- Put how-it-works content where users need mechanism proof.
- Put comparison content on a dedicated route when the decision requires depth and maintenance.
- Use FAQs only for recurring objections that do not fit more naturally in the main argument.
- Put pricing answers with pricing, not in a detached SEO block.

An accordion is acceptable when content remains in accessible DOM, the control exposes state, and
the collapsed design does not conceal the page's most important answer.

## Evidence and voice

- Every number, price, certification, quote, rating, logo, and competitor claim maps to the evidence
  ledger.
- Give dates to facts that drift. State the comparison scope and source.
- Defer to the project's voice rules; clarity does not require a generic robotic register.
- Avoid hype that replaces information, but do not strip a distinctive brand voice merely to sound
  machine-readable.
- Do not restate the question as filler.
- Never present inference or generated text as observed customer language.

## Click protection

A direct answer and a conversion are compatible when the page adds honest value after the answer:
an interactive demo, calculator, detailed comparison, real product proof, implementation guide, or
appropriate CTA. Do not omit the key fact to force a click. Verify the CTA destination honors its
label and the intent that earned the visit.

## Content-to-markup boundary

Visible FAQ or ordered-step content does not automatically justify `FAQPage` or `HowTo` markup.
Google no longer shows those rich results. Use `references/structured-data.md` and current official
consumer documentation before recommending any type.

## Before/after requirements

Every rewrite finding includes:

- URL and selector/heading;
- question and evidence source;
- current text;
- full draft replacement in project voice;
- facts and ledger IDs used;
- qualification preserved;
- owning page/skill;
- verification method.

If the existing answer is already clearer and more accurate than a formulaic rewrite, keep it.
