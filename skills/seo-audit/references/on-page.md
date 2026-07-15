# On-page — what searchers and sharers actually see

The technical checklist earns the page a seat in the index; this file audits
everything a human then judges: the SERP result, the shared link card, and the
page's structure as an argument. The organizing fact: **the title + description +
URL triple is the page's first CTA**, rendered in an interface the brand doesn't
control, competing against nine rivals and an answer box. Audit it as ad copy.

All copy this audit *recommends* obeys two rules: it may contain only numbers that
trace to a source in the brand kit, and final wording belongs to
**landing-copywriter** — findings specify what the copy must achieve (keyword,
length, promise, register), not its exact final phrasing, unless the fix is trivial.

## Contents

1. [Titles](#titles)
2. [Meta descriptions](#meta-descriptions)
3. [OG / Twitter cards](#og--twitter-cards)
4. [Heading structure](#heading-structure)
5. [Images & alt text](#images--alt-text)
6. [Internal linking](#internal-linking)
7. [URL slugs](#url-slugs)

## Titles

Extract every title in the URL set and audit them as a *set* first, then
individually:

```bash
while read -r u; do
  printf '%s → ' "$u"; curl -s "$u" | grep -io '<title>[^<]*' | sed 's/<title>//'
done < urls.txt
```

**Set-level checks:**

- **Unique** — duplicate titles across URLs → HIGH (they tell Google the pages are
  interchangeable, and it will pick one for you).
- **Consistent suffix pattern** — `Page promise — {kit.name}` (or the `|` variant;
  either, but one). The homepage inverts: it leads with the name because the brand
  query is its primary intent: `{kit.name} — {distilled one-liner}`.

**Per-title checks:**

- **Length ~50–60 characters** (the real limit is ~580px of rendered width;
  characters are the workable proxy). Over → truncated mid-promise; far under →
  wasted claim on the page's single highest-CTR surface. → MED.
- **Front-load the query term.** The mapped query's head term (from
  `references/keyword-mapping.md`) belongs in the first half of the title, phrased
  as the searcher phrases it — not as internal product vocabulary. The kit's
  `product.one_liner` supplies the semantic core; the keyword map supplies the wording.
- **Aligned, or it gets rewritten.** Google rewrites a large share of titles, and
  rewrites correlate with title–query mismatch. A rewritten title is the brand's
  first impression written by an algorithm. Alignment between title, H1, and the
  mapped intent is the practical defense → misalignment is MED, rising to HIGH on
  the primary CTA page.
- **No stuffing, no boilerplate.** `Analytics | Dashboards | BI | Reports — Acme`
  reads as spam to both audiences that matter. One promise per title — the same
  one-idea discipline the whole packet enforces.

Title formulas by page type (structural targets for the copywriter, using the Acme
kit as the worked stand-in):

| Page type | Formula | Acme example (structure, not copy) |
|---|---|---|
| Homepage | `{name} — {distilled one-liner}` | `Acme — Answers from your data in plain English` |
| Feature / use-case | `{capability as searcher phrases it} — {name}` | `Natural-language data queries — Acme` |
| Pricing | `{name} Pricing — {qualifier from kit}` | `Acme Pricing — Plans for data teams` |
| Comparison | `{name} vs {competitor}: {decision axis}` | `Acme vs DashCo: which fits a lean data team` |
| Blog/informational | `{question or claim the post answers}` | `Why dashboards go unread (and what replaces them)` |

## Meta descriptions

Not a ranking factor; a **click-through factor** — the supporting line under the
headline. Google rewrites descriptions that don't match the query even more
aggressively than titles, so the same alignment logic applies.

```bash
curl -s "$u" | grep -io '<meta[^>]*name=["'\'']description["'\''][^>]*>'
```

- **Present on every mapped page** → missing on a money page is HIGH (Google will
  excerpt something; excerpts don't sell); missing on minor pages MED.
- **~150–160 characters** — over gets truncated at the ellipsis, usually right
  before the point.
- **Structure: promise → differentiator → pivot toward the CTA.** The kit's
  `product.one_liner` supplies the promise; a kit proof point (sourced!) supplies the
  differentiator; the kit's single CTA verb supplies the pivot. The description
  should make the click feel like the obvious next step of a thought the searcher
  already started.
- **Unique per page** — duplicated descriptions → MED.
- **Claims discipline** — a number in a meta description is a public claim; no kit
  source, no number. Flag any existing description carrying an unsourced stat.

## OG / Twitter cards

Every share — Slack, iMessage, LinkedIn, X — renders the page as a card. A missing
card is a designed brand impression forfeited at exactly the moment someone chose
to advocate for the product.

```bash
curl -s "$u" | grep -io '<meta[^>]*\(property\|name\)=["'\'']\(og\|twitter\):[^>]*>'
```

Required set per indexable page, judged against the kit:

| Tag | Spec | Notes |
|---|---|---|
| `og:title` | May differ from `<title>` | Social strips the SERP context; the OG title can be punchier and drop the brand suffix (the card shows the logo/domain already) |
| `og:description` | ≤ ~200 chars | Same promise discipline as meta description |
| `og:image` | 1200×630, < ~1MB served | Designed from kit colors/type/logo — production routes to **landing-design-system**; keep text inside the center-safe zone (platforms crop edges) and legible at ~500px wide |
| `og:url` | The canonical URL, exactly | A mismatch splits share counts across variants |
| `og:type` | `website` for marketing pages | |
| `twitter:card` | `summary_large_image` | Falls back to OG for the rest |

Missing `og:image` on the primary CTA page → MED (LOW elsewhere). A *broken*
og:image URL (404s, blocked by robots) is worse than none → MED. Verify the image
URL actually returns 200 with an image content-type — don't trust the tag.

## Heading structure

Extract the outline and read it aloud — it should reconstruct the page's argument
without the page:

```bash
curl -s "$u" | grep -io '<h[1-6][^>]*>[^<]*' | sed 's/<h\([1-6]\)[^>]*>/H\1: /'
```

Rules, with reasoning:

- **A clear page-topic heading carries the mapped intent in plain language.**
  Missing hierarchy or conflicting page-topic headings are findings. Multiple H1
  elements are not an automatic search defect when semantics remain clear. The
  primary heading and title should agree semantically, not necessarily verbatim.
- **No skipped levels; headings mark structure, not font size.** An H4 chosen
  "because it looked right" under an H2 is a styling decision leaking into
  semantics → MED. The visual size belongs to CSS (route persistent conflicts to
  **landing-design-system**'s type scale).
- **The outline test resolves the brand-voice tension.** Premium landing pages use
  evocative section headlines ("Answers, not dashboards") — keep them; the packet's
  whole voice depends on them. The requirement is that the *outline as a whole*
  still communicates: the H1 states the intent plainly, and section H2s, read in
  order, trace the argument hook → proof → CTA. When every heading is pure
  atmosphere and the outline reads as poetry with no subject, flag the *outline*
  (MED) and hand the rewrite to landing-copywriter with the instruction "keep the
  voice; restore the argument" — often fixed by making one or two H2s carry the
  secondary keyword naturally.
- **Headings are not navigation chrome.** Nav labels, footer column titles, and
  card labels marked up as headings pollute the outline → LOW–MED.
- **One visible H1.** An `sr-only` H1 that differs from the visual headline is a
  parity smell (and an accessibility one) → MED.

## Images & alt text

Alt text serves three consumers at once — screen readers, image search, and the
crawler's understanding of the page — and the same decision tree serves all three:

1. **Does the image carry meaning the text doesn't?** → alt describes the *content
   or function*, one sentence, no `image of…` prefix. Product screenshots (from the
   kit) deserve real description: what the UI shows, not "app screenshot" → missing
   alt on meaningful images is MED.
2. **Is it decorative** (texture, divider, ambience)? → `alt=""` exactly — empty,
   present. A *missing* attribute makes screen readers announce the filename;
   keyword-stuffed alt on decoration reads as spam → LOW–MED.
3. **Is it the logo-as-link?** → alt is the brand name from the kit, nothing more.

Performance intersections (these overlap CWV; file the finding once, in whichever
lane has the stronger evidence):

- **Intrinsic dimensions on every image** (`width`/`height` or `aspect-ratio`) —
  the single cheapest CLS fix.
- **The LCP/hero image is preloaded and never lazy-loaded.** Blanket
  `loading="lazy"` policies that catch the hero are a classic self-inflicted LCP
  failure → HIGH. Everything below the fold: lazy is correct.
- **Modern formats** (AVIF/WebP with fallbacks) and honest intrinsic sizes — a
  4000px source in a 600px slot is bandwidth spent against your own LCP → MED.
- **Descriptive filenames** (`dashboard-query-view.avif`, not `final-final-2.png`)
  — minor image-search signal, major maintainability one → LOW.

## Internal linking

Links are how authority and attention route through the site. On a landing site
the graph is small, which makes defects proportionally larger.

Checks:

- **Reachability: every mapped page within ≤3 clicks of the homepage**, and every
  page in the sitemap linked from somewhere. Orphans (in sitemap, linked from
  nowhere) → HIGH for money pages, MED otherwise. Build the graph from the crawl:
  extract `href`s per page, diff against the URL set.
- **Descriptive anchors.** `Learn more`, `Click here`, and bare `Read →` teach the
  crawler nothing about the destination and force the reader to hunt for context.
  The anchor should name the destination's promise ("See how query routing works",
  not "Learn more") → MED when systemic. Exception: a *repeated card pattern* where
  the card's heading carries the semantics and the link is supplementary is
  acceptable — flag the pattern only when the anchor is the sole signal.
- **The conversion path is link-privileged.** The page carrying the kit's primary
  CTA should be linked from every page (nav and/or persistent header CTA), and
  high-value pages (home, top blog posts) should link *toward* commercial pages
  where an honest contextual link exists. A blog that never links to the product
  pages is hoarding authority in the attic → MED.
- **One CTA discipline extends to links.** Competing high-emphasis links adjacent
  to the primary CTA dilute it — this is a conversion finding as much as an SEO
  one; log it and route the layout decision to **landing-page-design**.
- **No internal links to redirects or 404s** — link straight to final URLs
  (evidence from the status-code pass) → MED.
- **Footer strategy** — the footer is the site-wide index: canonical URLs,
  descriptive labels, no keyword-stuffed link farms (→ MED if present).

## URL slugs

Slugs are read three times: in the SERP (trust signal), in the share (context
signal), and forever (migration cost). Rules: lowercase, hyphen-separated, short,
human-readable, no dates on evergreen pages, no IDs or parameters on marketing
routes. `/pricing` beats `/plans-and-pricing-2024` beats `/index.php?page=7`.

Inconsistent slug style across the site → LOW. An entrenched bad slug on a ranking
page is usually **not worth migrating** — a redirect spends more signal than an
ugly slug leaks; say so explicitly in the finding rather than triggering a
gratuitous URL migration. New pages from the keyword map get clean slugs from
birth.
