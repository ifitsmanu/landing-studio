# Teardowns — the nine-company canon

Beat-level deconstructions of how the best software companies compose launch
motion. Read these to get the idiom in your ear before writing a beat sheet.
Each entry: **Hook · Structure · Technique · CTA · Portable lesson.** The films
referenced are widely-seen public launch materials; the point is not to imitate
any single one but to steal the *portable* pattern under it.

## Contents

1. [Anthropic — honest-demo minimalism](#anthropic)
2. [OpenAI — real-time as spectacle](#openai)
3. [Google — emotion-first, and the cautionary tale](#google)
4. [Apple — materiality and inevitability](#apple)
5. [Linear — interface cinematography](#linear)
6. [Vercel — code as motion](#vercel)
7. [Stripe — UI as diagram](#stripe)
8. [Raycast — keyboard rhythm](#raycast)
9. [Framer — the recursive self-demo](#framer)
10. [Cross-cutting patterns](#cross-cutting-patterns)

## Anthropic

**Register:** honest-demo minimalism. The "Keep thinking" brand campaign runs
quiet type-led spots; the product side (computer use, Claude Code demos) is
engineer-narrated screen capture with almost no editorial dressing.

- **Hook:** the product already mid-task at frame one — a real screen, a real
  prompt, an engineer's voice explaining what you're watching. No sting, no music
  bed drama.
- **Structure:** task stated → model works in real time (or lightly compressed
  with the compression visible) → result inspected honestly, including hesitation
  and imperfection. The imperfections are load-bearing: they make the impressive
  parts believable.
- **Technique:** long takes instead of montage; the cursor and terminal are the
  actors; type cards are sparse, declarative, and few; palette restricted to the
  product's own UI plus a warm neutral canvas. Brand spots invert this — pure
  kinetic type on paper-like backgrounds, one accent, enormous restraint.
- **CTA:** quiet and singular — a URL or "available today in…" card, never a
  hard sell.
- **Portable lesson:** *credibility is an aesthetic.* Showing the seams (real
  speed, real misses, plain narration) reads as confidence. When your product is
  genuinely good, the most persuasive move is to lower the production drama and
  raise the proof density.

## OpenAI

**Register:** real-time as spectacle; the demo IS the film.

- **Hook (GPT-4o spring launch):** live, unedited-feeling interaction — the
  model interrupted mid-sentence, responding with laughter in its voice. The hook
  is riskiness itself: "this could fail, and it isn't."
- **Structure:** escalating capability ladder — each demo one notch harder than
  the last, ending on the one that makes the audience gasp (the apex is
  *scheduled*, not accidental). Announcement films intercut demo with plain title
  cards carrying model names and availability.
- **Technique:** minimal grade, real UI, big sans titles on black/white; Sora
  launches pioneered **prompt-as-caption** — the input text displayed as the
  caption over the output, making the artifact self-documenting. Brand films
  favor a single visual motif carried across the entire piece rather than variety.
- **CTA:** availability as the ask — "rolling out today", "try it in ChatGPT".
  The date/availability card functions as the CTA.
- **Portable lesson:** *sequence demos as an escalation ladder with a scheduled
  apex,* and let the input be visible — showing the prompt/question alongside the
  output is the cheapest honesty device in the genre (Acme's typed question is
  exactly this).

## Google

**Register:** emotion-first consumer storytelling wrapped around capability beats.

- **Hook ("Dream Job" Gemini Super Bowl spot):** a human situation — a father
  rehearsing for a job interview — before any UI. Product enters as a supporting
  character in an emotional arc.
- **Structure:** human stakes → product assists naturally in-context → emotional
  payoff → product card. Capability beats are embedded in dialogue, not listed.
- **Technique:** cinematic live action intercut with real phone UI at legible
  scale; capability captions timed to the assist moments; the brand's colors
  arrive through the product surface, not a grade.
- **CTA:** product name + one-line availability; the emotion does the selling.
- **The cautionary tale — Gemini hands-on, December 2023:** a beautifully
  produced demo implied fluid real-time multimodal conversation; it emerged the
  film was edited from still-frame prompts with latency removed and interactions
  restructured, disclosed only in a description note. Coverage of the deception
  outlived coverage of the model. Beat-level failure: *the craft was excellent,
  which made it worse* — polish transferred credibility the underlying interaction
  hadn't earned. This is why the honesty contract requires labels **in-frame**
  ("sped up", "simulated"), a claims ledger, and real speed by default. A
  disclosure a viewer must go find is not a disclosure.
- **Portable lesson:** emotion-first works when the product-assist moments are
  *real and specific*; and any gap between what the film implies and what the
  product does is a debt that compounds with production quality.

## Apple

**Register:** materiality-first reveal; motion as inevitability.

- **Hook:** the object itself — macro hardware detail, or the UI treated *as* a
  material — moving before any words.
- **Structure:** reveal → capability montage on a strict music grid → human
  vignettes → spec/claim cards → close on the product + one line. Product films
  live inside keynotes and are re-cut into standalone spots without restructuring
  (disassembly planned upfront — the practice `beat-sheets.md` formalizes).
- **Technique:** transitions read as *inevitable* — each shot's composition
  contains the seed of the next (match cuts on shape, motion vectors continued
  across cuts, origin-aware morphs). Type is set sparse and enormous; claims are
  short enough to be typography. Sound design is fused to motion 1:1 — every
  visual event has an audio identity.
- **CTA:** almost pure availability — product name, date, price. Decades of
  accumulated trust let the ask be nearly silent; note this and do NOT copy it
  for an unknown brand: unknown brands must ask explicitly.
- **Portable lesson:** *design transitions on shared geometry* so the film feels
  like one continuous object; and cut to the music grid strictly enough that the
  film would still feel edited with the audio removed.

## Linear

**Register:** interface cinematography — the modern archetype for this whole skill.

- **Hook:** the product UI, full-bleed and already in motion — an issue view
  assembling, a command palette invoked — over a dark, calm canvas.
- **Structure:** release films are capability chapters: type card names the
  feature (2–4 words) → the UI performs it in one staged take → next chapter.
  No narrative wrapper, no humans; cadence does the storytelling.
- **Technique:** the canonical two-tempo grammar — a slow drifting camera
  (gentle push-ins, pans between panels) over UI whose internal events are fast
  and crisp. The UI is widely understood to be **rebuilt/staged for the film**
  rather than raw-recorded: perfect data, perfect cursor paths, perfect timing —
  every pixel intentional, and *honest* because it demonstrates real shipped
  features. Reveals stagger in reading order; the accent appears only where the
  feature lives; typography and easing never vary within a film.
- **CTA:** a quiet end card — wordmark + one line + URL. The changelog context
  itself is warm traffic, so the ask is soft ("available now").
- **Portable lesson:** *stage the UI like a set.* Rebuild for crispness, keep the
  demonstration truthful, and let a small, unwavering motion vocabulary do the
  brand work. When in doubt about this genre, ask "what would the Linear cut of
  this look like" — then adapt it to the kit rather than cloning it.

## Vercel

**Register:** code-as-motion; developer material as the visual system.

- **Hook:** code, terminal output, or deployment UI animating as the opening
  image — the audience's own daily material, elevated.
- **Structure:** conference idents and launch films build from primitive brand
  geometry (the triangle) into product surface; feature clips are short
  command → deploy → result arcs. `npm i` to production URL is a three-act story.
- **Technique:** monospace type as a first-class display face; terminal text
  reveals timed like kinetic type; black/white with a restrained gradient accent;
  material/geometry idents rendered with physical lighting so the mark feels
  fabricated, not drawn.
- **CTA:** a command or a "Deploy" — the developer taxonomy row in `cta.md`.
  The ask is an artifact, not a pitch.
- **Portable lesson:** *for developer products, the terminal is the stage* — a
  command typing itself, output streaming, a URL appearing is a complete
  narrative arc with built-in truth (you can't fake a terminal convincingly to
  people who live in one — so don't dress it, time it).

## Stripe

**Register:** UI as diagram; complexity made legible in motion.

- **Hook:** an animated diagram already mid-flow — money moving through nodes, an
  API call fanning out — rendered in the product's own visual language.
- **Structure:** problem topology (the messy way) → the product as the clean
  path through it → the UI/API doing it for real → docs-flavored close. Sessions
  films intercut speaker with these motion diagrams as the primary visual.
- **Technique:** diagrams *are* UI: same type, same tokens, same corner radii as
  the product, so schematic and screenshot feel continuous; flows animate
  directionally (left→right = money/time) with dots-along-paths as the recurring
  motif; color encodes meaning (one accent per actor), never decoration.
- **CTA:** "Start now / Read the docs" — split intentionally by audience, but any
  single film still carries one primary ask.
- **Portable lesson:** *when the product's value is invisible plumbing, animate
  the diagram in product-native styling* — this is the Motion Canvas lane in
  `tech.md`, and the strongest pattern available for infra/API products.

## Raycast

**Register:** keyboard-rhythm choreography; speed as the message.

- **Hook:** hotkey → launcher opens → action completes, all within the first
  ~2 seconds. The speed of the product IS the hook.
- **Structure:** chains of micro-demos, each a keystroke-to-outcome arc of 2–4s,
  cut to a driving grid; features accumulate like verses; ends on wordmark +
  short ask.
- **Technique:** keycap overlays timed exactly to input events; UI response
  animations kept at real product speed (fast) while the camera stays calm;
  cursorless — keyboard-first is the product's identity, so the film's grammar
  matches the product's grammar; music with a strong transient grid so keystrokes
  land *on* beats.
- **CTA:** "Download" — one verb, hot-adjacent audience, perfectly matched.
- **Portable lesson:** *match the film's rhythm to the product's input rhythm.*
  A keyboard product cuts on keystrokes; a canvas product glides; an analytics
  product breathes in question→answer cycles (Acme's grid does exactly this).

## Framer

**Register:** the recursive self-demo — the tool demonstrating itself building
the demonstration.

- **Hook:** a canvas where something recognizably real (often Framer's own site)
  is being assembled at speed.
- **Structure:** build-up arc: blank canvas → components fly in → interactions
  wired → publish → the result is the thing you're watching. The medium proves
  the message with zero narration debt.
- **Technique:** screen-captured (or staged) canvas manipulation with the
  cursor as protagonist; time-compression labeled by obvious speed-ramps
  (honest because visibly stylized); the published result shown live in a real
  browser frame as the payoff beat.
- **CTA:** "Start for free" — warm verb for an audience that just watched the
  entire capability loop.
- **Portable lesson:** *if the product makes things, make the film's own artifact
  with it on screen* — recursion is the highest-density proof available, and the
  build-up arc (blank → assembled) is an innately watchable shape.

## Cross-cutting patterns

What the whole canon agrees on — the skill's laws are these observations,
generalized:

1. **The product is the protagonist**; humans, when present, are context.
2. **No one opens on a logo.** The logo closes; the product opens.
3. **Small motion vocabularies, strictly kept** — every one of these companies is
   identifiable from 10 seconds of easing.
4. **Cuts live on a music grid** even when the music is nearly ambient.
5. **Claims are short enough to be typography**; proof is shown before or with
   the claim, never after a pile of adjectives.
6. **Honesty is a stylistic choice with compounding returns** — the canon's most
   respected films are its most transparent (Anthropic's long takes, OpenAI's
   visible prompts, Framer's visible speed-ramps), and its one famous failure
   (Gemini 2023) is a *dishonesty* failure, not a craft failure.
7. **The ask matches the audience temperature** — from Apple's near-silent
   availability card to Raycast's "Download", each verb fits how warm the
   audience already is.
