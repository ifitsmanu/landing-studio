# 3D lane and budget guide

## Lane proof

| Lane | Choose when | Reject when |
|---|---|---|
| Static/CSS | fixed viewpoint or depth styling communicates the idea | the user must inspect spatial state or manipulate a real model |
| `<model-viewer>` | a single cleared glTF/GLB and standard camera controls are enough | custom scene logic, multi-object storytelling, or unsupported behavior dominates |
| Three.js | direct renderer/lifecycle control is necessary across framework boundaries | the team would be rebuilding framework integration without benefit |
| React Three Fiber | the existing React runtime and component scene model measurably reduce work | it introduces React or a scene ecosystem only for decoration |
| Custom shader/engine | a product-specific visual proof requires it and lower lanes fail | it mainly creates a novel background or cannot degrade cleanly |

Research the current official documentation, release, license, support, and security state before
adopting any lane. This table is not approval.

## Conservative default budgets

Use stricter project budgets when present. Otherwise treat these as launch gates for a single optional
landing-page section, measured on the declared production targets:

| Dimension | Narrow/mobile target | Wide/desktop target |
|---|---:|---:|
| Initial poster transfer | 250 KB | 400 KB |
| Total compressed 3D payload on activation | 1.5 MB | 3 MB |
| Rendered triangles | 100,000 | 250,000 |
| Draw calls | 50 | 100 |
| Estimated decoded texture memory | 64 MB | 128 MB |
| Maximum texture dimension | 2,048 px | 2,048 px; 4,096 only with measured need |
| Device-pixel-ratio cap | 1.5 | 2 |
| Warm interaction frame time, p75 | 25 ms | 16.7 ms |
| Warm interaction frame time, p95 | 33.3 ms | 25 ms |

Also require:

- no recurring main-thread task over 50 ms caused by the scene during the measured interaction;
- no 3D request before the poster/semantic content unless the project proves eager loading is better;
- no page LCP regression outside the approved page budget;
- no continuously running render loop while the section is offscreen or document hidden;
- no console error, failed critical request, or accumulating renderer/listener count across repeated
  mount/unmount cycles.

Texture-memory values are estimates from dimensions, formats, mipmaps, and faces because portable
browser GPU-memory reporting is limited. Record the calculation and uncertainty. Frame budgets require
multiple samples after warmup; one fast screenshot proves nothing.

If a target misses a budget, reduce DPR, texture/geometry/effect complexity, render on demand, choose a
lower lane, or deliver the static fallback. Do not silently exclude the weak device.

## Required fallback matrix

| Condition | Required behavior |
|---|---|
| JavaScript disabled or failed | semantic section and static image remain complete |
| WebGL unavailable or blocked | no retry loop; show equivalent static result |
| context lost | stop work, preserve page controls, restore once or settle on static fallback |
| reduced motion | no autoplay/camera drift/parallax; information remains visible |
| save-data, weak capability, or payload failure | avoid or abort runtime load; retain static result |
| tab hidden or section offscreen | pause animation/rendering and resume without duplication |
| keyboard/touch/pointer unavailable | alternate controls or noninteractive equivalent remain usable |

## Context-loss proof

In a test environment, trigger context loss with supported browser/dev tooling or the appropriate lose-
context extension. Verify the handler prevents default browser behavior only when restoration is
implemented, cancels the loop, avoids reload storms, keeps DOM content/CTA working, and either restores
assets exactly once or displays the fallback. Capture the result and recovery trace.
