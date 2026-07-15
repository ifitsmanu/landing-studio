# Library decision guide

Use the target project's maintained stack first. A popular dependency is not automatically the right dependency. Before adoption, use `technology-curator` and record official docs, current release/maintenance, license, security, browser support, bundle/runtime cost, a measured proof, alternatives, and an exit path.

## Default lanes

| Need | Default | Use when | Avoid / escalate when |
|---|---|---|---|
| Simple transitions | CSS + Web Animations API | opacity/transform/state changes can stay native | the sequence needs orchestration, gestures, or shared reactive values |
| React/component motion | [Motion](https://motion.dev/docs) | layout, gesture, scroll, or spring behavior benefits from a maintained component API | a few CSS transitions solve it or bundle budget is tight |
| Complex timelines/SVG/scroll | [GSAP](https://gsap.com/docs/v3/) | a timeline or plugin materially reduces fragile custom code | the product competes with Webflow's visual animation builder; check the [current GSAP license](https://gsap.com/community/standard-license/) |
| Interactive vector art | [Rive](https://rive.app/docs/runtimes/web) | a supplied/authored `.riv` state machine is central to the interaction | runtime weight, canvas accessibility, or asset authorship is unresolved |
| Lottie assets | dotLottie web runtime | an approved vector animation already exists and can be compressed | it is being used to disguise a generic template or has no static fallback |
| Programmatic video | [Remotion](https://www.remotion.dev/) | reusable React compositions, data-driven variants, or batch rendering add leverage | a deterministic product capture plus FFmpeg is simpler; check current licensing for the usage model |
| Encode/cutdown/inspect | [FFmpeg](https://ffmpeg.org/documentation.html) + ffprobe | deterministic codecs, frames, posters, metadata, audio, and aspect variants | the environment cannot install system binaries; use a documented managed renderer |
| Browser journeys | [Playwright](https://playwright.dev/docs/intro) | real Chromium/Firefox/WebKit automation, traces, screenshots, and responsive projects | a target project already has an equivalent maintained harness; extend it instead |
| Automated accessibility | [axe-core](https://github.com/dequelabs/axe-core) | catch machine-detectable WCAG issues in rendered states | treating an automated pass as full accessibility compliance |
| Performance/SEO lab audit | [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) / Lighthouse CI | a reproducible Chromium lab baseline and regression budget is useful | presenting its score as real-user performance; pair with field data when available |
| Stable visual diffs | [pixelmatch](https://github.com/mapbox/pixelmatch) or Playwright snapshots | deterministic fixtures and fonts make a baseline meaningful | live content, animation, rendering variance, or third-party assets create noise |
| Single 3D product model | [`<model-viewer>`](https://modelviewer.dev/) | one GLB/GLTF needs accessible controls, poster, and optional AR | a bespoke scene or shader is the actual concept |
| Framework-neutral 3D | [Three.js](https://threejs.org/docs/) | the scene needs custom models, shaders, camera, lighting, or interactions | a poster/video/model-viewer solves it more cheaply |
| React 3D composition | [React Three Fiber](https://r3f.docs.pmnd.rs/) | the target uses React and scene components need app state/interaction | the app is not React or the team cannot own a render loop/GPU budget |
| 3D asset optimization | glTF Transform and mesh/texture compression tooling | models must be measured and optimized before delivery | source rights or visual acceptance are unresolved |

## Dependency gate

Do not add a dependency until the decision record answers:

1. What exact user/business problem is not solved by the current stack?
2. What is the smallest proof and how is success measured?
3. What version and official documentation were evaluated on what date?
4. Is its license compatible with the product and distribution model?
5. What is the measured client/server/GPU/build cost?
6. Which browsers/devices and reduced-motion/static fallbacks were tested?
7. What security advisories, network calls, telemetry, and data flows exist?
8. Who maintains it and how can the project remove it later?

The dependency ledger is a release artifact, not an after-the-fact explanation.
