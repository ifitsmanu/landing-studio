# Landing red-team rubric

## Reviewer setup

Record:

- reviewer identity/context and whether it is independent;
- producer identity and any prior exposure to rationale;
- active page/section and approved artifact versions;
- URL, route, revision/build, browser/version, viewport, date, locale, data, consent, auth, and motion
  state;
- tools used and evidence directory;
- unavailable evidence and resulting claim limits.

Start with artifacts and rendered behavior. Read producer rationale only after the first findings list.

## Minimum browser matrix

Use project traffic/support data when available. Otherwise include:

- 320px stress width and a representative 390px phone;
- representative tablet/medium width;
- 1440px desktop and a wide-layout stress check;
- keyboard-only and pointer/touch-sized interaction;
- reduced motion;
- shortest and longest approved content states;
- primary journey success plus safe validation/failure states.

Scroll from top to bottom at each representative width. Capture initial viewport, active section,
primary CTA state, every failure, and the corrected rerun. Full-page captures are orientation evidence;
tight captures prove the exact defect.

## Pass 1: comprehension and copy

- Can a fresh reader state what this is, who it is for, why it matters, why to believe it, and what to
  do next after five seconds?
- Does each sentence add new information? Cut throat-clearing, duplicate subheads, noun piles,
  fashionable abstractions, and claims that could fit a competitor.
- Is every quantifier, superlative, comparison, testimonial, logo, price, date, scarcity statement, and
  outcome traced to current evidence?
- Are conditions, exclusions, recurring fees, data use, simulation, and risk visible before commitment?
- Does CTA text describe the real next step? "Start" that opens a sales form is a trust defect.
- Does narrow-screen line wrapping preserve meaning and emphasis?

Record the exact text in every copy finding. "Copy feels off" is invalid.

## Pass 2: design and originality

- At each stopped viewport, is there one deliberate focal point and a legible reading order?
- Does the selected territory's governing idea survive, or did implementation collapse into category
  defaults?
- Are proof and product evidence visually stronger than decoration?
- Do type size, line length, weight, contrast, alignment, spacing, and grouping communicate hierarchy
  without relying on color or motion alone?
- Are screenshots and media art-directed per breakpoint rather than merely shrunk or clipped?
- Are empty space and density purposeful, with no dead viewport or ornamental noise?
- Are source principles transformed, with no recognizable copied expression?
- Does the static/reduced-motion version remain a complete composition?

Compare to the approved territory and current category median, not personal taste alone.

## Pass 3: interaction, accessibility, and resilience

- Execute each CTA and form to a verifiable destination or safe test completion.
- Test empty, invalid, slow, duplicate, server-failure, retry, back, refresh, and external-link states as
  applicable without creating unauthorized production effects.
- Inspect semantic landmarks, heading outline, accessible names/descriptions, focus order/visibility,
  skip behavior, dialogs/menus, error association, target sizes, contrast, 200% zoom, 320px reflow,
  captions/transcripts, and screen-reader-relevant updates.
- Confirm reduced motion is equivalent, persistent motion can pause, hover is not required, and keyboard
  or touch is never a second-class path.
- Inspect raw HTML/accessibility tree for primary content; images or canvases are not sufficient.

Automated accessibility output supports findings but never certifies conformance by itself.

## Pass 4: performance and technical behavior

- Record production-mode requests, compressed transfer, caching, console errors, failed requests,
  hydration warnings, layout shift, long tasks, and third-party cost.
- Capture project budget output or repeatable traces on declared targets. Separate lab evidence from
  field claims.
- Confirm media does not delay primary text/CTA, lazy loading has a stable placeholder, and failures
  retain a usable section.
- Mount/unmount or navigate repeatedly when animation, observers, media, or 3D are present; look for
  duplicate listeners, loops, requests, and stale state.
- Verify analytics events once, consent denial, sensitive-value exclusion, replay masking, and approved
  destinations when applicable.

Do not infer performance from animation smoothness on the reviewer's computer.

## Pass 5: evidence, rights, and deception

- Map every rendered claim, number, quote, logo, and testimonial to an approved evidence identifier.
- Map every asset rendition to its media-ledger hash; verify channel, crop/context, credit, release,
  geography, expiry, and disclosure.
- Map each new runtime/library to an approved exact-version decision and production proof.
- Look for fabricated UI/data presented as real, false urgency or scarcity, preselected consent,
  confirm-shaming, hidden recurring terms, fake social proof, ambiguous button destinations, obstructed
  cancellation/privacy controls, and visual hierarchy that pressures a less informed choice.
- Inspect URLs, logs, analytics, screenshots, and browser storage for personal or secret data.

## Weighted scorecard

Score each dimension `0-10`, multiply by weight, and sum to `0-100`.

| Dimension | Weight |
|---|---:|
| Strategy and five-second comprehension | 12% |
| Copy precision and claim integrity | 13% |
| Visual hierarchy and responsive composition | 13% |
| Originality and product specificity | 12% |
| Proof and trust | 12% |
| Interaction and conversion | 10% |
| Accessibility and reduced motion | 10% |
| Performance and resilience | 10% |
| Rights, privacy, and non-deception | 8% |

Anchors:

- `9-10`: exceptional evidence, no material weakness, decisions reinforce one another;
- `7-8`: strong professional execution with bounded, nonblocking weaknesses;
- `5-6`: competent but generic, inconsistent, or materially under-proved;
- `3-4`: major defects or mismatch with approved intent;
- `1-2`: largely unusable, misleading, inaccessible, or unsupported;
- `0`: absent, untestable, or required evidence unavailable.

Apply severity caps after the weighted sum. Never move severity to make the score look coherent.

## Finding acceptance-test pattern

Write a test another reviewer can execute without interpretation:

> At `<URL>`, using `<browser/version>` at `<viewport>` with `<state>`, perform `<steps>`. The result
> must show/do `<observable outcome>` and evidence must be saved at `<path>`. No `<specific forbidden
> symptom>` may occur.

"Improve hierarchy," "fix mobile," and "make it accessible" are not acceptance tests.
