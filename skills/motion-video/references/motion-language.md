# Motion Language — easing, timing, and the signature

A film's motion system is a *language*: a small vocabulary used with perfect
consistency. Viewers can't name easing curves, but they can feel when two
elements in the same film speak different dialects — and "templated" is the word
they reach for. Every table here exists to keep the vocabulary small and the
grammar strict.

## Contents

1. [Two-tempo grammar](#two-tempo-grammar)
2. [The curve vocabulary](#the-curve-vocabulary)
3. [The duration scale](#the-duration-scale)
4. [Stagger discipline](#stagger-discipline)
5. [Springs — emphasis only](#springs)
6. [Direction of meaning](#direction-of-meaning)
7. [Deriving a motion signature from the kit](#deriving-a-motion-signature)
8. [The restraint checklist](#the-restraint-checklist)

## Two-tempo grammar

The genre's core grammar (Linear is its archetype): **fast product inside a slow
camera.** Two clocks run simultaneously:

| Layer | Duration | Easing | Examples |
|---|---|---|---|
| **UI events** (product clock) | 150–300ms | ease-out | Clicks, toggles, panels, results appearing |
| **Camera** (film clock) | 2–6s | ease-in-out | Push-ins, pans, drifts at 3–8% scale/travel |

Why it works: the fast layer says *the product is quick*; the slow layer says
*we are calm and in control*. Collapse the two tempos into one — everything
medium-speed — and the film reads as neither fast nor confident. The camera
never stops dead mid-scene (a frozen camera reads as a rendering hitch); it
eases into a hold or hands off to a cut.

Camera moves are small: a push-in of 3–8% over a full scene. Beyond ~10% the
move announces itself and UI pixels visibly scale-blur.

## The curve vocabulary

Pick **2–3 curves total** for the film — the vocabulary IS the consistency. The
default family (the genre's house style, offered as the overridable kit default):

| Role | Curve | cubic-bezier | Feel |
|---|---|---|---|
| **Entrance / reveal** | Expo-out | `(0.16, 1, 0.3, 1)` | Arrives fast, lands soft — confident |
| **UI event** | Quart-out | `(0.25, 1, 0.5, 1)` | Crisp response, no drama |
| **Camera / transition** | Standard in-out | `(0.65, 0, 0.35, 1)` | Weightful, symmetric, calm |
| (Exit — reuse) | Quart-in or plain fade | `(0.5, 0, 0.75, 0)` | Departs without ceremony |

Rules:

- **Never `linear`** for anything visible except continuous ambient drift
  (a slow pan that must not pulse) and type-on cursors.
- **Never default CSS `ease`** — its early peak reads generic precisely because
  it's everywhere.
- Entrances decelerate (out-curves); exits accelerate (in-curves); things that
  travel while on screen use in-out. Violating this mapping is what makes motion
  feel "off" in ways viewers can't articulate.
- If the brand kit supplies a motion signature, its curves replace this table
  wholesale — don't blend the two families.

## The duration scale

Like a type scale: few steps, used everywhere, no in-betweens invented mid-edit.

| Token | Duration | Used for |
|---|---|---|
| `dur-1` | 150ms | Micro feedback: hover states, toggles, ripples |
| `dur-2` | 240ms | Standard UI events: panels, cards, results |
| `dur-3` | 400ms | Emphasized entrances: a scene's key element, type reveals |
| `dur-4` | 800ms | Scene transitions, large morphs, chart draws |
| `camera` | 2000–6000ms | The film clock |

Under 100ms motion isn't perceived as motion (fine for feedback, wasted on
storytelling); over 500ms a *UI* event starts reading as slow software — the one
thing this genre must never imply. Hold camera moves and transitions to the long
end; hold product events to the short end. That contrast is the two-tempo
grammar restated in numbers.

## Stagger discipline

When multiple elements enter, they enter as a *sequence with one focal element
per instant* — never simulcast, never random.

- **Offset: 30–80ms** between siblings. Under 30ms reads as simultaneous (so why
  stagger?); over ~100ms reads as elements queueing at a door.
- **Order: reading order** — top-to-bottom, left-to-right (or the locale's
  order), or data order when meaning demands (a timeline staggers by time).
  Center-out is acceptable for radial compositions only.
- **Cap the total:** first-to-last ≤ 400ms regardless of count. Twelve items at
  80ms is a full second of doorway-queue; compress the offset as count grows
  (the Acme apex: 12 tiles × 40ms = 440ms ≈ cap).
- Each staggered element uses the same curve and duration — the *offset* is the
  only variable. Varying all three per element is visual static.

## Springs

Physical/spring easing is an **emphasis device, budget: one per film** — the
badge that pops, the element the whole scene exists to introduce. It works
because it breaks the established vocabulary; use it twice and there is no
vocabulary left to break.

- Keep it tight: damping high enough for ≤1 visible overshoot. Multi-bounce
  reads as a preset (the anti-template list in `kinetic-type.md` applies to UI
  too).
- Springs never touch: type, camera, or exits.

## Direction of meaning

Motion direction is semantic, and the film must be consistent about it:

- **New content enters from where it conceptually comes from**: the next step
  from the right (forward), fresh data from below (arriving), a response from
  the input that caused it (origin-aware — the panel grows *from* the button
  that opened it).
- **Exits go the way things leave**: dismissed items exit the way they came;
  completed items exit forward (left, in an LTR film).
- **Progress moves one way.** If time/money/flow moves left→right in scene 2, it
  moves left→right in scene 5 (Stripe's diagrams are rigorous about this).
- The camera only moves *toward* meaning: push in on what matters next, pan in
  reading order. A camera move with no semantic target is decoration — cut it.

## Deriving a motion signature

One recurring, ownable move makes ten seconds of film recognizably one brand's.
If the kit doesn't supply a signature, derive one from what it does supply and
propose it (never impose silently):

1. **From the logo's geometry** — a mark built on circles suggests radial
   reveals; a slanted wordmark suggests a consistent diagonal wipe axis.
2. **From the product's input rhythm** — keyboard products cut on keystrokes
   (Raycast), canvas tools glide, chat/query products breathe in ask→answer
   cycles (Acme).
3. **From the accent's job** — if the accent marks interactivity in the product,
   the signature can be "the accent arrives last in every scene, on the thing
   you'd click."

A signature is ONE move used 3–5 times per film at meaningful moments — not a
transition pack. Write it into the kit (`brand-kit.md`) so future films speak
the same dialect.

## The restraint checklist

Run before compositing is called done; every "yes" is a cut:

- [ ] Any motion you can't justify in one sentence of *meaning* (not "it looked
      cool")?
- [ ] More than 3 easing curves in the film?
- [ ] More than one spring?
- [ ] Any element that bounces, flips, spins, or elastically overshoots?
- [ ] Two simultaneous focal motions anywhere? (Frame-step to check.)
- [ ] A camera move during another camera move?
- [ ] Particles, floating shapes, lens flares, film grain, light leaks?
- [ ] Stock footage of hands typing / offices / cities?
- [ ] A transition you took from a pack rather than built from shared geometry?

The genre's paradox, worth internalizing: the *more* is deleted, the more
expensive the film looks. Restraint is not the absence of craft — it is the
visible evidence of it.
