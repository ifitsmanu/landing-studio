# Teardowns — the six-company canon

Viewport-by-viewport deconstructions of how the reference companies compose their
landing pages. Read these to get the idiom in your ear before writing a layout
spec. Each entry: **Register · First viewport · Scroll structure · Technique ·
CTA carriage · Portable lesson.**

These describe patterns observed on widely-seen public marketing pages (as of
roughly 2025–2026 — live pages change constantly). The point is never to imitate
any single page but to steal the *portable* pattern under it, re-expressed
through whatever brand kit you're holding. Where a pattern only works because of
that company's specific position (Apple-grade trust, a decade of brand equity),
that caveat is part of the teardown.

## Contents

1. [OpenAI — the product input as the page](#openai)
2. [Anthropic — editorial trust](#anthropic)
3. [Stripe — disciplined density](#stripe)
4. [Linear — screenshots as art](#linear)
5. [Vercel — the workflow is the proof](#vercel)
6. [Framer — the recursive self-demo](#framer)
7. [Cross-cutting patterns](#cross-cutting-patterns)

## OpenAI

**Register**: radical reduction — consumer-scale clarity for a deeply technical
product; the page gets out of the product's way.

- **First viewport**: on the product side (ChatGPT), the hero *is the product's
  input* — a working prompt box under a short invitation. Almost no marketing
  copy; the 5-second promise is delivered by letting you start. On the corporate
  side, an editorial hero: one enormous statement, restrained nav, a single
  primary action.
- **Scroll structure**: very few sections, each one screen-sized and single-idea:
  claim → product surface → use-case tiles (concrete tasks, phrased as the
  user's words) → research/credibility strip → close. The company's published
  work functions as the proof section — credibility by artifact rather than by
  testimonial.
- **Technique**: giant type on near-monochrome; imagery sparse and either
  product-real or abstract-editorial; whitespace does the hierarchy work; use-case
  tiles turn an unbounded product into graspable, specific jobs.
- **CTA carriage**: one verb ("Try/Get ChatGPT"-class), persistent in nav,
  restated at close; developer track cleanly separated onto its own pages rather
  than crowding the consumer page.
- **Portable lesson**: *when the product's core interaction is an input, embed
  the input* (hero archetype 4 in `hero-patterns.md`) — the cheapest honest demo
  that exists. And when a product can do anything, the page must pick specific
  jobs to show; unbounded capability is unmarketable until it's tiled into
  concrete use cases.

## Anthropic

**Register**: editorial trust — a research-lab register applied to a product
page; the page reads like a considered publication, not a funnel.

- **First viewport**: type-led (hero archetype 3): a values-bearing claim in a
  serif-inflected display face on a warm paper-like canvas, one line of
  literal subhead, two clear doors (product and API/developers). No screenshot
  race; the register itself is the differentiation.
- **Scroll structure**: claim → product doors (consumer / developer, as equal
  calm cards) → capability highlights with restrained product surfaces →
  research & safety as first-class sections (the trust argument *is* the
  argument) → news/writing → close. Long-form pages elsewhere on the site do the
  deep proof work; the landing page routes.
- **Technique**: warm neutrals instead of tech-black or SaaS-blue; serif display
  + humanist body; illustration used sparingly with a hand-made quality; wide
  measures avoided; density kept low everywhere — the whitespace communicates
  institutional confidence.
- **CTA carriage**: two doors held in disciplined hierarchy (consumer primary,
  developer adjacent) — the exception that proves the one-CTA rule: it works
  only because the two audiences genuinely cannot share a destination, and each
  door still carries exactly one verb.
- **Portable lesson**: *register is a positioning weapon.* When every competitor
  is dark-mode-and-electric-accent, a warm editorial register reads as the
  grown-up in the room — but it transfers the persuasion burden to words and
  restraint, so it demands a kit with real voice confidence (and makes
  `landing-copywriter` the load-bearing sibling). Use when trust is the product.

## Stripe

**Register**: disciplined density — an enormous amount of information made to
feel inevitable through ruthless hierarchy; the long-running benchmark for
B2B/developer landing craft.

- **First viewport**: split hero (archetype 2): left, a category-owning headline
  ("financial infrastructure"-class claim) + subhead + CTA pair (start / contact
  sales); right, real product UI staged at an angle-free elevation. Behind it,
  the famous animated gradient mesh — a brand asset in its own right, earned by
  the monochrome discipline of everything below it. Enterprise logo row directly
  under the hero.
- **Scroll structure**: hero → logos → a *modular product tour*: one section per
  product area, each with the same intro system (eyebrow-as-product-name, claim,
  supporting line) and a bespoke UI-as-diagram visual → code-and-result section
  for developers (editor left, live product right) → global-scale metrics band →
  enterprise/case strip → dual-door close (start building / talk to sales) →
  encyclopedic footer that functions as a sitemap.
- **Technique**: UI screenshots redrawn as *diagrams* — simplified, labeled,
  connected by flow lines, so a payments dashboard reads as an argument, not a
  screen grab; code blocks that are real and runnable-looking; two audiences
  (developer, enterprise buyer) interleaved section-by-section without either
  feeling like the afterthought; the gradient appears once at full volume and
  then never competes again.
- **CTA carriage**: dual-track by necessity (self-serve dev + sales-led
  enterprise), held straight by strict styling hierarchy and repetition at hero,
  mid, and close — each track keeps one verb throughout.
- **Portable lesson**: *density is not the enemy of premium — flat hierarchy is.*
  A page can carry a dozen sections when the intro system is identical every
  time, each section is one idea, and visuals are simplified toward argument
  (UI-as-diagram) rather than pasted. Steal the repetition-as-composure; skip
  the gradient unless the kit establishes it.

## Linear

**Register**: interface cinematography, stilled — the product's own dark UI
treated as the page's art program; the modern archetype for "premium SaaS dark."

- **First viewport**: centered claim + staged UI below (archetype 1): a short
  category-claim headline in a tight-tracked display cut, one-line subhead, one
  CTA — then the product filling the lower viewport, cropped by the fold,
  edge-faded and softly lit so it reads as an image, not a screenshot. The first
  scroll completes the shot: the reveal is designed into the fold.
- **Scroll structure**: hero → understated logo strip → long single-column run
  of full-width proof sections, each one capability: identical intro system
  (small eyebrow, big claim, quiet lead), then a huge art-directed UI crop;
  cadence broken occasionally by a bento passage compressing minor features →
  quiet close (claim + CTA) → minimal footer. Almost no testimonials; the craft
  itself is positioned as the proof.
- **Technique**: screenshots masked with gradient fades so UI dissolves into
  canvas; glow used as lighting, always pointed at the focal UI; dark theme with
  AA-disciplined ink levels (bright headline, muted body, faint captions);
  micro-motion on reveals kept under perceptual threshold; typography does the
  luxury signaling — one display face, tight leading, enormous scale contrast.
- **CTA carriage**: near-ascetic — nav + hero + close, one verb; the restraint
  is itself a brand statement ("the product sells itself"). Note the caveat:
  this works at Linear's word-of-mouth altitude; an unknown brand should carry
  the CTA at chapter boundaries per the SKILL.md spine.
- **Portable lesson**: *treat screenshots as art-directed images* — crop, mask,
  fade, and light them; match UI theme to page canvas so product and page read
  as one material. This is the single highest-leverage staging idea in the
  catalog and it costs nothing but care.

## Vercel

**Register**: engineering minimalism — near-black-and-white, geometric,
conference-keynote confidence; the page demonstrates taste as a proxy for
product quality.

- **First viewport**: centered claim (archetype 1) in a heavy geometric display
  cut, one-line subhead, **two CTAs held in strict hierarchy** (start deploying
  / talk to sales — the PLG+enterprise dual-track done with a filled primary and
  a ghost secondary); brand geometry (the triangle) as a minimal motif rather
  than decoration.
- **Scroll structure**: hero → logo wall → *the workflow as the flagship proof*:
  the git-push → preview-deploy → ship loop rendered as a diagrammatic sequence
  mixing terminal, code, and dashboard fragments → supporting proof sections
  (performance, scale, framework breadth) with metrics attached → templates/
  starters gallery as a "time-to-first-success" proof → enterprise strip →
  dual-door close → deep footer.
- **Technique**: monochrome discipline with gradient accents rationed to
  moments; terminal and code presented as first-class visuals set in mono;
  metrics stated plainly and specifically; the motif (triangle/gradient)
  recurring just enough to brand the whitespace.
- **CTA carriage**: the cleanest dual-CTA execution in the canon — the two
  buttons never swap weights anywhere on the page; every restatement keeps the
  same pairing and order.
- **Portable lesson**: *for tool products, the workflow loop is the flagship
  proof* — show the loop (input → magic → shipped result) as one composed
  sequence rather than three disconnected feature sections. And if two CTAs are
  genuinely unavoidable, copy the never-swap-weights discipline exactly.

## Framer

**Register**: the recursive self-demo — a website builder whose website is the
demo; capability proven by the artifact you're looking at.

- **First viewport**: high-energy claim + CTA over a hero that visibly *does*
  what the product sells — animated type, live canvas behavior, design-grade
  layout — the page as its own evidence. The wow is the argument.
- **Scroll structure**: hero → social proof early → a run of proof sections each
  of which *is* the capability it describes (the scroll-effects section scrolls
  spectacularly; the localization section switches language before your eyes) →
  templates/community gallery as breadth proof → pricing → close. The page
  structure is conventional; the sections' self-demonstrating execution is the
  differentiation.
- **Technique**: motion as product proof rather than decoration — legitimate
  *because the product is motion*; short loops and interactive fragments over
  static screenshots; density and energy higher than the rest of the canon,
  tuned to a design-audience kit.
- **CTA carriage**: one verb ("start"-class), persistent nav CTA, restated at
  every chapter; free-start friction-reducers attached at the ask.
- **Portable lesson**: *if the product makes web experiences, the page must be
  built with the product and perform its claims* — anything less is
  self-refuting. For every other product, invert the lesson: Framer's motion
  density is *category-licensed*; borrowing it for an analytics kit produces
  decoration, not proof. Motion earns its place exactly when it demonstrates the
  thing being sold — otherwise route it to `motion-video` for one composed loop,
  or cut it.

## Cross-cutting patterns

What all six share — the genre's invariants, which a spec deviates from only
with a written reason:

- **One screen, one idea.** Every company, every section, no exceptions found.
- **The claim is short and the subhead is literal.** 3–8 word headlines over
  one-line plain-language descriptions, everywhere.
- **Logos arrive immediately after the hero** (or credibility-by-artifact where
  logos don't fit the register).
- **Real product, art-directed.** Nobody pastes raw screenshots; nobody ships
  illustration where UI could live. Crop, mask, light, or diagram — but the
  product is always the protagonist.
- **A repeated section-intro system** (eyebrow → claim → lead) is what makes
  long pages feel composed rather than assembled.
- **Accent color is rationed.** One brand moment at full volume (a gradient, a
  glow), then monochrome discipline; the accent marks CTAs and focal moments
  only.
- **The close is a calm echo of the hero** — restated claim, one verb, high
  contrast, nothing else competing.
- **CTA verbs never mutate.** Whatever the verb is, it is the same in the nav,
  the hero, mid-page, and the close.
- **Footers are encyclopedic and argumentatively inert** — nothing load-bearing
  lives only there.
- **Trust budget calibrates the ask.** The stronger the brand, the quieter the
  CTA carriage (Linear, OpenAI); unknown brands must ask explicitly and often
  (per the SKILL.md spine). Copy the confidence, not the silence.
