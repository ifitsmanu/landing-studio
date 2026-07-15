# Hero Patterns — the first viewport

The hero is the page's poster, hook, and most-seen artifact: every visitor renders
it, and for many traffic sources it is the only viewport guaranteed exposure. Design it
as a standalone product first, then make sure the rest of the page keeps its
promise. Everything here is parameterized on the brand kit — no pattern below
assumes a palette, a typeface, or a product category.

## Contents

1. [The 5-second promise](#the-5-second-promise)
2. [Anatomy in depth](#anatomy-in-depth)
3. [Above-the-fold math](#above-the-fold-math)
4. [The six archetypes](#the-six-archetypes)
5. [Staging real product UI](#staging-real-product-ui)
6. [Background systems](#background-systems)
7. [Failure gallery](#failure-gallery)

## The 5-second promise

Show a fresh reader the first viewport for five seconds, then take it away. They
must be able to answer four questions:

1. **What is this?** — a category or an outcome, in words they already use.
2. **Is it for me?** — the kit's `audience` should recognize themselves in the
   subhead or the proof row without being named clumsily.
3. **Why believe it?** — one visible piece of evidence: the product doing the
   thing, or borrowed trust (logos, a rating, one sourced stat).
4. **What do I do?** — the kit's one CTA, unmistakably the most clickable thing.

Why five seconds: that's the realistic attention advance a cold visitor extends
before deciding to scroll, click, or leave. A hero that needs ten seconds of
reading, a scroll animation to finish, or a video to explain itself has spent
attention it was never given. Design the hero to work as a **static screenshot**
— that is also literally how it will appear in link previews and social cards.

The promise also sets the page's debt: every section below exists to make the
hero's claim survive scrutiny. A hero that overclaims writes checks the proof
sections can't cash; a hero that underclaims (a feature name instead of an
outcome) never earns the scroll at all. Calibrate the claim to the strongest
thing the kit's `proof` rows can actually support.

## Anatomy in depth

Reading order is layout order. Each part exists to earn the next.

### Eyebrow (optional)

≤4 words above the headline: a category label ("Analytics"), a news hook
("Now with SSO"), or a credibility chip ("Backed by …" — ledgered). Set small,
often in the accent or a neutral, generous letter-spacing. Cut it first when the
viewport is tight; never let it steal the headline's first fixation.

### Headline — the h1

- **≤10 words, ideally 4–8.** Shorter headlines set larger and read as more
  confident; length and conviction are inversely correlated in this genre.
- **The only h1 on the page** (the structure audit and seo-audit both check this).
- **Outcome or claim, not feature inventory.** "Answers, not dashboards" beats
  "AI-powered natural-language analytics platform." The subhead carries the
  literal description so the headline doesn't have to.
- **2 lines maximum at desktop, 3 at mobile.** Specify the break points in the
  spec if the line break changes meaning; a widowed single word on line two
  undermines the largest type on the page.
- Set in the kit's display face at the top of the type scale; exact size belongs
  to `landing-design-system`, but the intent is "unmissably the largest text on
  the page, by a wide margin."

### Subhead

- **≤25 words, 1–2 lines, measure ≤60ch.** Its job is literal comprehension: what
  the product is, for whom, and the mechanism if it's surprising. If the headline
  is the poetry, the subhead is the prose — a visitor should be able to repeat it
  to a colleague as a description.
- One register quieter than the headline (body face or lighter weight, muted fg).

### CTA row

- **One primary**: the kit's `cta.verb` on the kit's `cta.destination`, in the
  accent, the highest-contrast interactive element in the viewport. Verb-first
  labels ("Start free", "Book a demo", "Get the app") — never "Learn more" as
  primary; "learn more" is what the rest of the page is for.
- **At most one secondary**, visibly demoted (ghost/text style): docs, demo video,
  or the sales-track alternative for dual-audience products. If the kit supplies
  two asks of equal weight, stop and establish a primary hierarchy — competing
  primary CTAs measurably depress both.
- **Reduce friction in-line**: a caption under the button ("Free tier · No card
  required") answers the objection at the moment it forms — but only with claims
  the kit's proof rows support.

### Proof line

One quiet row inside the first viewport: 4–6 customer logos (monochromed to the
kit's neutral so they don't out-shout the CTA), or a rating with count, or one
sourced stat. Every element traces to a kit `proof` row — an unproven logo wall
is fabrication, the fastest way to void the whole page's credibility. If the kit
has no proof yet (pre-launch), skip the row rather than fake it; a clean hero
with no logos reads as new, a fake one reads as dishonest.

### Visual

The product, shown doing the claim — the full craft is in
[Staging real product UI](#staging-real-product-ui). The visual is the hero's
evidence; text-only heroes are a deliberate exception (archetype 3), not a
default.

## Above-the-fold math

Do not design for a mythical fold, but do design for realistic first paints:

- **Desktop**: assume ~1280–1440 × ~700–800px of *usable* height after browser
  chrome. Nav takes 56–80px. The headline, subhead, CTA, and at least the top of
  the visual should be visible in that window. A hero that pushes its CTA below
  1000px tall has hidden the ask from the first paint.
- **Laptop 13″**: ~1280 × ~650 usable. This is the honest test size — heroes
  designed on 27″ monitors routinely fail it.
- **Mobile**: ~390 × ~660 usable. The stack (headline → subhead → CTA) must land
  the CTA within the first screenful; the visual may sit just below the fold as
  the reward for the first swipe (`responsive.md` has the full stack rules).
- **Height discipline**: test viewport-locked heroes on short, tall, mobile, and
  browser-chrome-constrained screens. Prefer content-driven sizing when a viewport
  lock creates clipping or excessive empty space.

## The six archetypes

Choose by what the product's best evidence is, not by taste. Each entry: shape,
when to choose it, risks.

### 1. Centered claim + staged UI below

Headline/subhead/CTA centered; the product visual full-width beneath, often
cropped by the fold so the first scroll completes it. The modern default
(Linear and Vercel both live here — see `teardowns.md`).

- **Choose when**: the claim is short and strong, and the UI is landscape and
  genuinely good-looking.
- **Risks**: the visual below the fold must be *earned* by the claim above it;
  weak headline + centered layout = a poster with nothing on it.

### 2. Product-forward split

Text column left (headline, subhead, CTA, proof), staged UI right, roughly
40/60. Stripe's long-running shape.

- **Choose when**: the UI is portrait-ish or croppable to a tall panel, or the
  headline needs more supporting text (complex/regulated products).
- **Risks**: text and visual can compete; establish hierarchy and verify the visual
  at its actual column width. On mobile, define an intentional stack/order.

### 3. Type-only manifesto

No product visual in the first viewport: an oversized claim, a subhead, the CTA,
lots of canvas. Anthropic's register; also the shape for brand-led or pre-product
pages.

- **Choose when**: trust/positioning *is* the product, the UI isn't the story, or
  the kit has no shippable screenshots yet.
- **Risks**: the words carry everything — this archetype transfers the whole
  burden to `landing-copywriter`; a mediocre claim set huge is mediocre, loudly.
  Proof must then arrive immediately in section 2.

### 4. Live product embed

The actual product, interactive, in the hero — an input box that really works, a
sandboxed editor, a calculator. OpenAI's prompt-box hero is the canonical case:
when the product *is* an input, embed the input.

- **Choose when**: the product's core interaction is self-explanatory, fast
  (<2s to first delight), and safe to expose unauthenticated.
- **Risks**: a slow or confusing embed is a live demo failing on stage, forever.
  Provide a static fallback for no-JS/reduced conditions, and make the CTA still
  visible — the embed demos, the button converts.

### 5. Motion loop hero

A short silent product film as the visual. **Production routes to
`motion-video`** — this skill only sets the carriage rules: designed poster frame
(the loop may never fire), few-MB budget, autoplay muted loop, CTA and headline
never inside the video, `prefers-reduced-motion` swaps in the poster.

- **Choose when**: the product's magic is inherently temporal (generation,
  automation, real-time collaboration) and a still genuinely can't carry it.
- **Risks**: the most expensive archetype to do well and the most damaging to
  LCP when done carelessly; if a still can carry the claim, use the still.

### 6. Form-forward

The conversion form itself in the hero — waitlist email capture, or signup for
products sold on scarcity/launch momentum.

- **Choose when**: the page has exactly one job and it's capture (pre-launch,
  invite-gated, event registration).
- **Risks**: asking before proving inverts the argument; keep the form to one
  field, and let the rest of the page exist for the unconvinced who scroll past.

## Staging real product UI

The screenshot is a portrait of the product; treat it with portrait-level care.

- **Crop to the money feature.** The whole app at 30% scale shows everything and
  proves nothing. Crop to the view that demonstrates the hero's claim, large
  enough that its text is legible or deliberately abstracted — half-legible UI
  text is the worst of both.
- **Stage, don't paste.** Generous canvas margin around the shot; soft, single
  light-source elevation (one shadow system page-wide — tokens via
  `landing-design-system`); a hairline border if the UI bg is close to the page
  bg; optional minimal window chrome (plain bar, no fake OS buttons pretending to
  be real). Full-bleed edge-to-edge screenshots are for docs, not heroes.
- **Masking and fade** are the premium moves: let the shot bleed off one edge or
  fade at the bottom to imply continuation (Linear's signature — see
  `teardowns.md`). The crop line should never amputate a UI element mid-control.
- **Perspective restraint**: flat, or ≤ a few degrees of tilt. Isometric
  floating-panel collages and heavy 3D mockups are the strongest single
  template-tell in the genre.
- **Match UI theme to page canvas** when possible (dark UI on dark canvas, light
  on light); a mismatched slab punches a hole in the composition. If the product
  only has one theme, stage it on a neutral surface band instead of raw canvas.
- **Data honesty**: synthetic data must be plausible, internally consistent
  (totals sum, dates ordered), and never impersonate real customers. Any real
  number legible in the shot is an on-page claim and needs a kit `proof` row.
- **Resolution**: export at 2×, compress hard (this image is usually the LCP
  element — see `responsive.md` §performance), and art-direct a tighter crop for
  mobile rather than scaling the desktop shot down.
- **If it moves, it's a `motion-video` deliverable** — including "just a little
  cursor movement." The line is: files with a timeline belong to that skill;
  CSS entrance transitions on the static shot belong here.

## Background systems

The background's job is to make the foreground inevitable, never to compete.

- **Start from the kit's bg and earn every addition.** The reference canon is
  overwhelmingly flat color or near-flat: a single radial glow behind the visual,
  a faint grid/dot field, subtle noise. One idea, maximum.
- **Glows point at the focal point** — behind the staged UI or the headline, in
  the accent at low opacity, never floating in a corner for balance.
- **Gradient meshes** (the Stripe move) are a brand commitment, not a garnish:
  they work at Stripe because everything else on the page is disciplined
  monochrome. If the kit doesn't establish gradients, don't introduce them here.
- **Contrast is non-negotiable**: any text over a decorated background must still
  pass the kit's AA pairs at the *lightest* point of the decoration. If the
  decoration forces a scrim, the decoration is too loud.
- **Motion in backgrounds** (drifting gradients, particle fields) sits at the
  bottom of the priority list and the top of the regret list; if used, it must be
  imperceptible in a screenshot comparison and disabled under reduced motion.

## Failure gallery

Name the failure to avoid building it:

| Failure | What it looks like | Fix |
|---|---|---|
| **The riddle** | Clever headline, no comprehension in 5s | Move literalness into the subhead; test on someone cold |
| **The feature dump** | Headline lists three capabilities | One claim; features become proof sections |
| **The two-ask hero** | Two equal buttons | Choose a primary; demote the other to ghost/text |
| **The pasted screenshot** | Full app, full-bleed, tiny text | Crop to the money feature, stage on canvas |
| **The 3D collage** | Floating tilted panels, isometric phones | Flat, staged, one shot |
| **The empty poem** | Type-only hero with a weak claim | Either strengthen the claim or show the product |
| **The 100vh void** | Sparse content stranded in a viewport-locked hero | Size to content; cap the height |
| **The logo lie** | Impressive logo row with no source | No `proof` row, no logo — ship clean instead |
| **The video wall** | Autoplay hero video with text baked in, no poster | Route to `motion-video` carriage rules; text lives in HTML |
| **The hidden ask** | CTA below the first paint | Restack; CTA within ~700px desktop, first screenful mobile |

## Worked example — Acme hero (archetype 1)

- **Eyebrow**: none (claim is strong alone).
- **Headline**: "Answers, not dashboards." — 4 words, display face, 2-line max
  never triggered.
- **Subhead**: "Acme answers questions about your data in plain English — ask,
  and get the chart, the number, and the why." (≤25 words; literal.)
- **CTA row**: [Start free] primary in accent → https://acme.com/signup; "View docs"
  ghost secondary (mono-adjacent audience). Caption: "Free tier · No card
  required" (backed by a pricing proof row).
- **Proof line**: 5 customer logos, monochromed to neutral, each ledgered.
- **Visual**: the answer view — question typed at top, generated chart + one-line
  answer below — cropped to that panel, 2× export, dark UI on near-black canvas,
  single accent glow behind it, bottom edge fading into the proof section so the
  first scroll completes the shot.
- **Fold math**: nav 64px; headline+subhead+CTA land by ~520px; top third of the
  visual visible at 700px desktop; mobile stacks headline → subhead → CTA in the
  first screenful, visual as the first-swipe reward.
