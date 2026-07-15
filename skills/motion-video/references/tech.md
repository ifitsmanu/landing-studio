# Tech Selection — engines, capture, and the floor

The engine is a means; the beat sheet is the film. Every option below produces
the same deliverables (`delivery.md`); they differ in environment requirements,
iteration speed, and who does the work. Pick the **first option whose
requirements the current environment meets** — and remember the prime rule:
deterministic timelines only. If a tool can't render the same frame twice, it
isn't a compose engine for this skill.

## Contents

1. [Ranked engines](#ranked-engines)
2. [Remotion (default)](#remotion)
3. [Motion Canvas](#motion-canvas)
4. [The vendored floor](#the-vendored-floor)
5. [After Effects handoff](#after-effects-handoff)
6. [Capture-tool matrix](#capture-tool-matrix)
7. [Adjacent, not the film](#adjacent-not-the-film)
8. [When NOT to make a video](#when-not-to-make-a-video)
9. [AI-generated footage — the one line](#ai-generated-footage)

## Ranked engines

| Rank | Engine | Requires | Choose when |
|---|---|---|---|
| 1 | **Remotion** | Node + React | Composition benefits from shared React scenes, data, or native aspect variants |
| 2 | **Motion Canvas** | Node + TS | The film is primarily animated diagrams/explainer motion |
| 3 | **Vendored scene kit** | Node + Playwright browser + ffmpeg | Reproducible fallback when dependencies are installed |
| 4 | **After Effects handoff** | A human motion designer | A pro editor owns the compose stage |

## Remotion composition lane

The film as React components; render via headless Chromium. Choose this lane
when React composition provides enough leverage to justify its dependency and
license review. The **brand kit becomes `defaultProps`**:

- One `<Composition>` per placement, all sharing scene components; a
  `calculateMetadata` derives `durationInFrames/width/height/fps` per placement
  — the 90s master, 30s feed cut, 6s bumper, and hero loop render **from one
  codebase, deterministically, in CI** (`npx remotion render`).
- Time is explicit: `useCurrentFrame()` + `interpolate()`/`spring()` implement
  the timing tables from `motion-language.md` directly. Sketch:

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
// Beat: CLAIM blur-up at 3.0s, dur-3 (400ms), expo-out
const t = interpolate(frame, [3 * fps, 3 * fps + 0.4 * fps], [0, 1],
  { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
<h1 style={{
  fontFamily: kit.type.display, color: kit.colors.fg,
  opacity: t, filter: `blur(${12 * (1 - t)}px)`,
  transform: `translateY(${16 * (1 - t)}px)`,
}}>{kit.product.claim}</h1>
```

- Real-UI footage drops in as `<OffthreadVideo>` layers under staged type;
  `<Audio>` aligns the music grid to exact frames.
- **Licensing note**: Remotion has usage-dependent terms. Verify the current
  official license for the team and rendering model before adoption; do not
  repeat a remembered employee threshold as current fact.

Remotion owns composition: scene timing, layout, typography, and native aspect
variants. FFmpeg remains the deterministic encode/inspection lane for delivery
codecs, pixel format, posters, metadata, and final cutdowns.

## Motion Canvas

Generator-based TypeScript animation (`yield*` timelines) with a real-time
editor — the best fit for the **Stripe UI-as-diagram lane**: nodes, connectors,
flows-along-paths, code blocks with signal-driven layout.

```ts
// dots-along-path, the Stripe motif
yield* all(
  dot().position(path().getPointAtPercentage(0).position, 0),
  tween(2, v => dot().position(path().getPointAtPercentage(easeInOutCubic(v)).position)),
);
```

Choose it when the film's proof scenes are mostly *diagrams in motion* rather
than staged product UI; it's weaker than Remotion for compositing video
footage and rendering many aspect variants.

## The vendored fallback

The lightweight fallback lane: **gated-CSS HTML scenes + clock-
controlled capture + ffmpeg.** Everything ships inside this skill at
`assets/scene-templates/` so it cannot rot: three scene templates (kinetic-type
card, staged-UI frame, end card) styled entirely by brand-kit CSS variables, a
Playwright capture script parameterized on any URL/file, and encode/cutdown
scripts.

How gating works: every animation in a template is declared with its full
timeline (delays = the beat sheet) but held paused until a `.play` class lands
on the root. The capture script then **seeks** the document's animations to
each frame's timestamp (`document.getAnimations()` → `currentTime = t`) and
screenshots — frame-perfect, dropped-frame-proof, identical on every run and
machine. For arbitrary live apps with rAF-driven motion, the script's CDP
virtual-time mode does the same at the browser-clock level
(`ui-cinematography.md` has the full recipe).

Requirements: any machine with a Chromium (via Playwright) and ffmpeg. This is
also the *storyboard* tool for every lane — each template doubles as a
poster-test frame.

## After Effects handoff

When a human motion designer owns the compose stage, the deliverable is a
**spec package**, not renders:

1. The approved beat sheet (times, words, motion column).
2. Storyboard frames (one per beat).
3. The brand kit + asset files (fonts, logo, UI captures at 2×).
4. The timing tables from `motion-language.md` translated to AE terms: curve
   cubic-beziers → keyframe influence settings, the duration scale, stagger
   offsets, the one-spring budget.
5. The claims ledger + honesty labels that must appear in-frame.
6. The delivery spec (`delivery.md`) as the render contract.

Review their output against the QA gate (`qa.md`) exactly as if this skill had
rendered it.

## Capture-tool matrix

For the real-UI footage lane (details: `ui-cinematography.md`):

| Tool | Determinism | Best for | Watch out |
|---|---|---|---|
| Playwright + animation seek | High within a pinned environment | Scene templates, staged UI | CSS/WAAPI motion only; verify across browser/font changes |
| Playwright + CDP virtual time | High for supported clocks | Any live URL incl. rAF apps | Media/streaming content may ignore virtual time |
| Screen Studio-class recorder | None (human take) | Authenticity beats, human-driven demos | Disable its cursor FX if adding your own |
| OS screen capture | None | Fallback | Expect to add all treatment in compose |

## Adjacent, not the film

Tools that live near this skill but are **not** compose engines for it:

- **GSAP / Motion (Framer Motion) / CSS animation** — live on-page animation.
  Excellent for the *website*; not a video pipeline. If the user wants the hero
  itself animated (not a video in the hero), route to the site's animation
  layer.
- **Rive / Lottie** — interactive vector runtime animation (logos, icons,
  micro-interactions shipped as assets). A Lottie is a component, not a film.
- These can *coexist* with the film (a Rive logo on the page next to the hero
  loop), and rebuilt-UI scenes may borrow their source, but the deliverable of
  this skill is always encoded video files.

## When NOT to make a video

Say so when true — a video is the wrong artifact when:

- The message is one sentence and a static hero + strong H1 delivers it
  (motion would add seconds, not persuasion).
- The product has no visual surface and no diagrammable flow yet — a film of
  abstract shapes is a mood, not proof.
- The feature needs *interaction* to be understood → an interactive demo/
  sandbox beats video.
- There's no real UI material and no budget to stage any honestly — a film
  built on fabricated surfaces violates the honesty contract; decline and say
  why.
- The team needs it in an hour. A bad launch film is negative marketing;
  offer the 6s bumper or a designed static instead.

## AI-generated footage

Generated footage may be used when the approved concept needs material that
cannot be captured truthfully, the brand's generation policy permits it, rights
and disclosure are handled, and the result does not fabricate product behavior,
customers, endorsements, or documentary events. It is one production lane, not
a default and not an arbitrary one-shot limit. Compositing, continuity, review,
and delivery still need an authored production workflow.
