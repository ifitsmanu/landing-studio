# Sound — the three-layer system

Sound in this genre is structural before it is audible: the music's grid is the
edit's ruler. But the mute-first mandate rules everything — most plays are
silent (`attention.md`), so sound is a **reward layer** for viewers who opt in,
never a load-bearing wall. If removing all audio breaks the film's meaning, the
film is broken, not the mix.

## Contents

1. [Layer 1 — music as the edit grid](#music-as-the-edit-grid)
2. [Layer 2 — UI foley](#ui-foley)
3. [Layer 3 — voiceover](#voiceover)
4. [Mixing: ducking and silence](#mixing)
5. [Licensing and loudness](#licensing-and-loudness)
6. [The mute-first mandate](#the-mute-first-mandate)

## Music as the edit grid

Choose the track **before** compositing — the music is the film's ruler, not its
wallpaper:

- **Pick for grid, not vibe alone**: instrumental, steady tempo (90–125 BPM
  covers the genre), clear transients to cut on, no vocals competing with type,
  and a structure with at least one build and one drop/resolution you can map
  to the apex and the CTA.
- **The math**: at 120 BPM a beat is 500ms and a 4-beat bar is 2s. Scene
  durations become musical phrases — a 4-bar scene is 8s (exactly the proof-
  scene ceiling; not a coincidence, the genre converged on it). Author the beat
  sheet in seconds, then snap cuts to the nearest bar or half-bar in the edit.
- **Cut on the beat — mostly.** Land scene changes on downbeats; let one or two
  meaningful cuts arrive a half-beat early (anticipation) so the grid doesn't
  become a metronome. The apex lands ON the track's drop or its biggest
  downbeat, full stop.
- **Map the energy curve to the spine**: intro energy under HOOK/CLAIM, build
  through PROOF, peak at APEX, strip back to near-silence for SYNTHESIS, one
  resolving figure under the CTA. If the track fights this shape, wrong track.
- Edit the *music* to fit the film (trim bars, repeat a section) rather than
  stretching the film to fit the music — the attention budget outranks the
  arrangement.

## UI foley

Sparse, synced, and diegetic — the sound the product would make if software made
sounds:

- **Sync to interface events exactly**: a soft tick on click, a muted key
  cadence under typing, a low pulse when the anomaly badge lands, a small chime
  (once) when the answer arrives. Foley lands on the same frame as the visual
  event — off-by-two-frames foley is worse than none.
- **Budget: a handful per scene.** Foley on every event turns the film into a
  slot machine. Score the events that carry meaning (the ask, the answer, the
  apex), let the rest pass silently.
- **No whooshes on cuts.** Transitions in this genre are geometric, not
  aerodynamic. The whoosh is the sonic preset-bounce.
- Keep one foley palette: same family of sounds, pitched consistently, quiet
  relative to music (foley sits −12 to −18 dB under the music bed).

## Voiceover

Optional, by audience register:

- **Engineer-narrated** (the Anthropic register): plain, unpolished, first-
  person — powerful for developer/technical audiences because it *is* the
  credibility. Record dry, minimal processing.
- **Founder VO**: legitimate for vision-scale launches (90s films); keep the
  script in the kit's voice, present tense, zero adjectives.
- **No VO** (the Linear register): type carries everything; the default for
  feature/changelog films and anything feed-first.
- Never: movie-trailer voice, text-to-speech that pretends otherwise (label
  synthetic VO if used), or VO that just reads the on-screen cards (pick one
  carrier per line — if the card says it, the voice shouldn't, and vice versa).

## Mixing

- **Duck under meaning**: music drops −6 to −9 dB under VO and under key proof
  moments where foley must read. Automate the ducks to the beat sheet, not to a
  compressor's guess.
- **Silence is the loudest cue you own.** Two scheduled uses: strip to near-
  silence (or a single sustained note) at the apex hold, and again on the CTA
  card — one resolving chord, then actual quiet. After 50 seconds of bed, that
  quiet is what makes the ask feel inevitable rather than shouted.
- Start the mix at the film's *end*: set the CTA's quiet first, the apex's drop
  second, then fill the rest — it guarantees the two moments that convert get
  the dynamic headroom.

## Licensing and loudness

- **Licensed music only** — a platform copyright claim mutes or demonetizes the
  film precisely where it's performing best. Track the license (source, terms,
  proof) alongside the claims ledger. Library music with a paid license beats a
  famous track you can't clear, every time.
- **Loudness targets**: −14 LUFS integrated for streaming/social masters, true
  peak ≤ −1 dBTP. Keynote/venue masters follow the venue's spec (ask; default
  −20 LUFS with headroom). Don't master hot — platforms normalize down and
  crush the dynamics you designed.
- Deliver a **mute-safe master** (the same file must work with audio stripped:
  `delivery.md` hero-loop lane ships `-an` variants).

## The mute-first mandate

The QA order is the design order (`qa.md`): the muted watch comes first because
it's the majority product. Concretely:

- Every meaning-carrying sound has a visual twin (the chime has the card; the
  drop has the apex hold; the VO has type or captions).
- Captions: sidecar `.vtt/.srt` always; burned captions on feed cutdowns
  (`delivery.md`). Caption the VO verbatim, not paraphrased.
- The sound-on pass should feel like a *reward* — the film you already
  understood, now with a pulse — not like the missing half.
