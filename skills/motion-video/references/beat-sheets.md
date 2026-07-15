# Beat Sheets — templates and the worked example

The beat sheet is the film. It is written in markdown, reviewed like code, and
approved by the user before any pixel renders. Every later stage (storyboard,
assets, compose, sound, delivery) is diffed against it.

## Contents

1. [Anatomy of a beat sheet](#anatomy)
2. [Scaling the spine to any duration](#scaling)
3. [Template: 6s bumper](#6s-bumper)
4. [Template: 10–15s hero loop](#hero-loop)
5. [Template: 30s feed cut](#30s-feed-cut)
6. [Template: 60s launch film](#60s-launch-film)
7. [Template: 90s launch film](#90s-launch-film)
8. [One master → many cutdowns](#disassembly)
9. [Worked example: Acme, an analytics SaaS](#acme)
10. [Approval protocol](#approval)

## Anatomy

Each row is a beat — the smallest unit a viewer perceives as "one thing happened."
The **Attention** column is the per-second budget: what keeps a viewer who might
leave *right now*.

```markdown
| Time | Beat | On screen | Type/text | Motion | Sound | Attention |
|------|------|-----------|-----------|--------|-------|-----------|
```

Column disciplines:

- **Time** — absolute seconds (`0:00–0:03`). Later, cuts land on the music grid, but
  the sheet is authored in seconds.
- **On screen** — the single idea of the shot. If you need "and", split the row.
- **Type/text** — exact words, ≤7 per card. Count them in the sheet; don't defer
  the word-count fight to the edit.
- **Motion** — the one move, named from the vocabulary in `motion-language.md`
  ("push-in 4%", "blur-up", "stagger 60ms reading order").
- **Sound** — grid position, foley cue, or "silence" (silence is a cue too).
- **Attention** — why the might-leave viewer stays: the open loop, the reveal being
  accelerated into, the money shot being held.

## Scaling

The spine — HOOK → CLAIM → PROOF → SYNTHESIS → CTA CLOSE — holds at every duration,
but not proportionally at the edges:

- **HOOK is absolute**: ~3s (1.5s for feed) regardless of total length. Attention
  physics don't scale with your ambitions.
- **CTA hold is absolute**: ≥2.5s of legible stillness at any length.
- **PROOF absorbs the scaling**: add/remove capability scenes; never stretch scenes
  past ~8s (one idea per scene stops being one idea).
- **SYNTHESIS can compress to a single held frame** in short cuts; it disappears
  entirely only in the 6s bumper.

## 6s bumper

The hook beat standing alone. One idea + the ask. Nothing else fits — don't try.

```markdown
| Time      | Beat  | On screen                              | Attention |
|-----------|-------|----------------------------------------|-----------|
| 0:00–0:02 | HOOK  | Product doing its single most visual thing (frame 1 = poster) | The thing itself IS the hook |
| 0:02–0:04 | CLAIM | The one sentence, kinetic type, ≤5 words | Payoff of the visual |
| 0:04–0:06 | CTA   | End card: wordmark + verb + destination, still | Ask while attention exists |
```

## Hero loop

10–15s, silent, seamless. The loop is a *state of the page*, not a story: it must
re-hook every pass and never visibly reset.

```markdown
| Time       | Beat        | On screen                                   | Attention |
|------------|-------------|---------------------------------------------|-----------|
| 0:00–0:03  | HOOK        | UI mid-action; frame 1 = poster = reduced-motion still | Poster duty: this frame must work when playback does not start |
| 0:03–0:09  | PROOF ×2    | Two micro-capabilities, ≤3s each            | Change every ~2s |
| 0:09–0:12  | REST        | Composition settles; CTA-adjacent stillness | The page's own button converts; the loop's rest state must not fight it |
| 0:12–0:15  | RE-HOOK     | Settle morphs back into frame 1's state     | Loop seam invisible → perpetual re-hook |
```

Constraints: no burned type doing argument work (the page's H1 does that), every
frame poster-grade, file budget per `delivery.md`.

## 30s feed cut

Muted-first, captions burned, hook compressed to ~1.5s.

```markdown
| Time       | Beat      | Attention budget |
|------------|-----------|------------------|
| 0:00–0:01.5| HOOK      | Frame 1 is the single most arresting product moment you have. 1.5s, not 3 — feed scroll decides faster |
| 0:01.5–0:05| CLAIM     | The sentence, big type, center-safe for all crops |
| 0:05–0:22  | PROOF ×3  | Three beats, ≤6s each, cadence tightening into the apex at ~0:18 |
| 0:22–0:26  | SYNTHESIS | Claim restated over apex still; mid-roll CTA lower-third here |
| 0:26–0:30  | CTA       | End card ≥2.5s; CTA repeated in post copy |
```

## 60s launch film

The canonical shape (see SKILL.md table). Four to five proof scenes, apex at
~60–65% of runtime, one full second of designed stillness before the ask.

```markdown
| Time      | Beat       | Notes |
|-----------|------------|-------|
| 0:00–0:03 | HOOK       | Product-in-motion or claim; never a logo card |
| 0:03–0:08 | CLAIM      | Kinetic display type; ≤7 words |
| 0:08–0:38 | PROOF ×4   | ≤8s each; one idea each; escalate to the apex ~0:34 |
| 0:38–0:48 | SYNTHESIS  | Claim over strongest shot; still breath at 0:46 |
| 0:48–0:60 | CTA CLOSE  | Calmest, highest-contrast scene; verb + destination held ≥3s; final frame rhymes with frame 1 |
```

## 90s launch film

Only when the product genuinely has 5 distinct provable beats plus a narrative
reason (e.g., a founder VO). The extra 30s go to PROOF and a longer SYNTHESIS —
never to a longer opening. Add a **mid-roll CTA** after the apex; at 90s most
viewers will not reach the end card.

```markdown
| Time      | Beat       | Notes |
|-----------|------------|-------|
| 0:00–0:03 | HOOK       | Same law as 60s |
| 0:03–0:10 | CLAIM      | May add one sub-line (context, not a second claim) |
| 0:10–0:60 | PROOF ×5   | ≤8s each + one 10–12s apex sequence allowed if it earns the hold |
| 0:60–0:64 | MID CTA    | Quiet lower-third echo of the ask, right after the apex |
| 0:64–0:78 | SYNTHESIS  | Claim restated; optional single ledger-backed stat |
| 0:78–0:90 | CTA CLOSE  | As 60s |
```

## Disassembly

Plan the cutdown family at beat-sheet time by tagging beats, so cutdowns are
selections, not re-edits:

- Tag each beat: `[HOOK] [CLAIM] [P1..P5] [APEX] [SYN] [CTA]`.
- **6s bumper** = strongest of {HOOK, APEX} + CTA.
- **Hero loop** = 2 proof micro-moments + rest state; no argument type.
- **30s feed** = HOOK(re-cut to 1.5s) + CLAIM + best 3 proofs + CTA.
- Compose center-safe: keep critical action and type inside the 4:5 center crop of
  the 16:9 master so 1:1/4:5/9:16 crops work without re-animation (`delivery.md`).
- Shoot/render the apex twice if needed: once composed for 16:9, once for vertical.

## Acme

The canonical worked example. Product: **Acme**, an analytics SaaS — "Acme answers
questions about your data in plain English." Claim: **"Answers, not dashboards."**
CTA: **Start free → https://acme.com/signup**. Placement: 60s launch film master; hero loop, 30s
feed cut, 6s bumper planned from the same sheet. Ledger: one row ("answers in under
4 seconds" → user-supplied benchmark doc).

```markdown
| Time      | Beat  | On screen                                            | Type/text                       | Motion                                   | Sound                     | Attention |
|-----------|-------|------------------------------------------------------|---------------------------------|------------------------------------------|---------------------------|-----------|
| 0:00–0:03 | HOOK  | Bare input on dark canvas; a question types itself: "Why did churn spike in March?" | the typed question | cursor blink; type-on at human cadence; NO logo | room tone; single soft key-tick grid | Frame 1 = half-typed question (poster + open loop: you want the answer) |
| 0:03–0:05 | HOOK→ | Enter. Input collapses; an answer card assembles: one sentence + a small chart drawing in | "Trial-to-paid dropped after the pricing change." | card scale 0.98→1 expo-out 400ms; chart line draws 800ms | downbeat lands on Enter | The promised answer arrives — loop closed, credibility opened |
| 0:05–0:08 | CLAIM | Canvas clears to type                                | **"Answers, not dashboards."**  | blur-up + rise 16px, 500ms; held still   | music enters properly     | The thesis, right after proof #0 — say AFTER show |
| 0:08–0:15 | P1    | Full product frame, staged with shadow on canvas: user asks a second question in plain English; answer + chart | lower-third: "Ask in plain English" (4 words) | camera push-in 4% over 6s; UI events 150–240ms | key ticks; answer chime once | New idea per 2s inside one scene: type→submit→answer |
| 0:15–0:22 | P2    | Anomaly badge appears on a metric unprompted; card expands with the why | "Anomalies flag themselves" (3 words) | badge spring (the film's ONE spring); expand 240ms | low pulse on badge        | Pattern interrupt: motion originates from the UI, not the user |
| 0:22–0:28 | P3    | Answer becomes a live report; share sheet; recipient's chat shows the card | "Share answers, not exports" (4 words) | match cut on the card → chat context     | whoosh-less: hard cut on beat | Cut cadence tightens (7s→6s scenes) into the apex |
| 0:28–0:36 | APEX  | A wall of 12 dashboards tiles the frame… and collapses into one sentence answer | "One question. One answer." | tiles converge with 40ms stagger, reading order; 900ms; then HOLD 2s | music drops to a single sustained note | The money shot: accelerated into, then held. This is the clip people share |
| 0:36–0:46 | SYN   | Apex still; wordmark fades in beside the sentence     | "Acme — answers, not dashboards." | fade 400ms; then 1s of full stillness at 0:44 | near-silence            | Logo EARNED here, not spent at 0:00; stillness sets up the ask |
| 0:46–0:60 | CTA   | End card: wordmark, verb, destination; input field from frame 1 sits below, cursor blinking | **"Start free"** / "https://acme.com/signup"  | all motion at rest; cursor blink only    | one resolving chord, then silence | Highest-contrast, calmest scene; held 3s+; blinking input rhymes with frame 1 → loop re-hooks |
```

Cutdown tags applied: bumper = HOOK(0:00–0:05 compressed) + CTA; hero loop = P1 +
APEX micro + rest state with blinking input; feed cut = HOOK(1.5s) + CLAIM + P1 +
P2 + APEX + CTA, captions burned.

Why this sheet works, in one line per law: no logo opener (earned at 0:36); frame
one is a poster and an open loop; something changes every 1.5–3s but the apex is
*held*; every card ≤7 words; the film reads fully muted (all argument is in type +
UI); the CTA is one verb, one destination, at rest, ≥3s; the final frame rhymes
with the first.

## Approval

Present the beat sheet with: total duration, per-beat times, all on-screen words,
the attention rationale, and the planned cutdown tags. Ask for approval explicitly.
Changes after approval re-open the sheet — storyboard and edit follow the sheet,
never the other way around. This is cheap discipline: a word changed in the sheet
costs seconds; the same change after compositing costs hours.
