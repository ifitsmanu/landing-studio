# Keyword-to-page mapping — intent → promise → CTA

The strategic half of the audit. Technical and on-page lanes ask "is the page
sound?"; this lane asks "is it the *right* page?" A keyword map is a contract:
every query the brand should win maps to exactly one URL whose title, H1, and CTA
answer that query's intent. Everything else in the packet then has a target —
landing-page-design composes toward mapped intents, landing-copywriter writes
toward them, and this audit re-checks against them.

Honesty rules for this lane, stated up front:

- **Never fabricate search volumes.** Without user-supplied data (Search Console,
  keyword-tool exports), prioritize by intent, not by invented numbers, and label
  every estimate as an estimate.
- **Derive queries from the kit, not from imagination.** The brand kit's one-liner,
  ICP, proof points, and named competitors generate the seed set; a query with no
  kit ancestry needs the user's confirmation before it enters the map.
- **The map recommends; the user decides.** New-page recommendations are findings
  with a rationale, not unilateral roadmap items.

## Contents

1. [Intent taxonomy](#intent-taxonomy)
2. [Deriving the query set from the brand kit](#deriving-the-query-set-from-the-brand-kit)
3. [The map table](#the-map-table)
4. [Diagnosing the map](#diagnosing-the-map)
5. [Cannibalization detection](#cannibalization-detection)
6. [Prioritizing without volume data](#prioritizing-without-volume-data)
7. [Single-page sites](#single-page-sites)
8. [Worked example — Acme](#worked-example--acme)

## Intent taxonomy

Four intents, each with a natural page owner. Mapping a query to a page with the
wrong intent-shape is the most common strategic defect — the page can be flawless
and still never rank, because it isn't what the searcher meant.

| Intent | The searcher wants… | Natural owner | Signals in the query |
|---|---|---|---|
| **Navigational** | This specific brand/site | Homepage (brand queries), specific pages (`{name} pricing`, `{name} login`) | Contains the brand name |
| **Informational** | To understand something | Blog, docs, guides | how / what / why / guide / examples |
| **Commercial investigation** | To choose between options | Comparison pages, alternatives pages, use-case pages | best / vs / alternative / for {ICP} / review |
| **Transactional** | To act now | Landing page, pricing, signup | buy / pricing / trial / demo / {category} tool |

Two consequences worth internalizing:

- **Landing pages own commercial + transactional intent; blogs own informational.**
  A landing page targeting "what is {category}" will lose to every honest guide;
  a blog post targeting "{category} pricing" converts nobody it attracts. The map
  enforces the division.
- **Intent proximity to conversion is the default priority axis.** Transactional
  and commercial queries sit one step from the kit's CTA; informational queries sit
  three. When resources force a choice, the map defends the close-in queries first.

## Deriving the query set from the brand kit

Each kit field generates a query family. Work through them in order; the output is
the seed list the map is built from.

| Kit field | Generates | Pattern |
|---|---|---|
| `name` | Navigational set | `{name}`, `{name} pricing`, `{name} demo`, `{name} reviews`, `{name} docs` |
| `product.one_liner` | Head terms | The category noun and its honest synonyms — what the product *is* to a stranger |
| `icp` / audience | Qualified modifiers | `{category} for {ICP}`, `{ICP} {job-to-be-done}` — these convert best because the page can speak the searcher's role directly |
| `proof` / capability claims | Feature queries | Each provable capability, phrased as searchers phrase it (not internal feature names) |
| `competitors` (named) | Comparison set | `{name} vs {competitor}` (both directions), `{competitor} alternative`, `best {category} tools` |
| `cta` destination | The conversion endpoint | Not a query source — the terminus every mapped page must route toward |

Then translate vocabulary: the kit speaks the brand's language; the map must speak
the *searcher's*. "Natural-language analytics" (internal) vs "ask questions about
your data" (human) can be different query universes. Where user data exists (GSC
query strings are ideal), let real phrasing win; where it doesn't, flag vocabulary
guesses for user confirmation.

Cluster the seed list by intent: queries that one page can honestly satisfy
together form one cluster. The cluster — not the individual query — is the mapping
unit. Splitting one intent across many thin pages is as damaging as cramming many
intents into one.

## The map table

One row per cluster. This table ships inside the findings document (part 4 of the
output contract) and becomes the shared targeting reference for the whole packet.

```markdown
| Cluster (representative query) | Intent | Demand | Mapped URL | Title now | H1 now | CTA present? | Status |
|---|---|---|---|---|---|---|---|
| "{name}" + brand variants | Nav | GSC: 480/mo | / | ✓ aligned | ✓ | ✓ primary | OK |
| "{category} for {ICP}" | Commercial | est: med† | /for-{icp} | — | — | — | GAP |
| "{name} vs {competitor}" | Commercial | est: low† | — | — | — | — | GAP |
| "{capability} how-to" | Info | GSC: 90/mo | /blog/x AND /features/y | dup | dup | mixed | CANNIBAL |

† estimate — no volume data supplied; ranked by intent proximity, not volume.
```

Status vocabulary — every row gets exactly one:

- **OK** — mapped, aligned (title/H1/CTA agree with the intent), no competitor row.
- **MISALIGNED** — a page exists but its title/H1/content answer a different
  intent than the cluster's. Fix: retarget the page or remap the cluster.
- **GAP** — no page owns the cluster. Fix: recommend the page (route creation to
  landing-page-design + landing-copywriter) or consciously decline the cluster.
- **CANNIBAL** — two or more URLs compete for the cluster (see below).
- **DECLINED** — deliberately not pursued (wrong ICP, unwinnable head term,
  forbidden claim territory). Recording declines keeps the map honest and stops
  the same idea resurfacing every quarter.

## Diagnosing the map

With the table built, three families of finding fall out:

**Gaps.** The classic landing-site gaps, in rough order of conversion value:
the `for-{ICP}` page (commercial, high-fit, low competition), the comparison pages
for each named competitor (highest-intent traffic that exists — a searcher typing
`{name} vs {competitor}` is days from a decision; if the brand doesn't host that
comparison, the competitor or an affiliate will), and the pricing page as an
indexable page rather than a modal. Each gap becomes a finding: severity by intent
proximity (a missing comparison page for a named competitor → HIGH-as-opportunity;
document it as such rather than forcing the defect framing).

**Misalignments.** Page exists, wrong shape. Evidence: the page's current title/H1
against the cluster's intent. The fix is always one of exactly two — change the
page to fit the intent, or change the mapping and find the intent a real home.
Never "optimize" a page toward two intents at once; that manufactures tomorrow's
cannibalization.

**Unowned brand SERP.** Search the brand name and inspect the first page: the
site's own result with correct title/snippet, plus how much of the remaining SERP
the brand controls (docs, repos, social profiles, review sites). A competitor
ranking for `{name} alternative` above the brand's own comparison content is a
standing finding. Deeper brand-entity work (knowledge panels, cross-web
consistency) routes to **geo-audit** — note the handoff, don't duplicate it.

## Cannibalization detection

Two pages competing for one query split clicks, links, and ranking signals —
usually both lose to a rival with one page. Detection, cheapest first:

1. **Map collisions** — while building the table, two URLs claiming one cluster.
2. **Title/H1 duplication** — near-duplicate titles found in the on-page pass are
   cannibalization until proven otherwise.
3. **`site:` probes** — `site:$DOMAIN "{query}"` surfacing multiple relevant URLs.
4. **GSC ground truth** (when granted) — one query showing impressions across
   multiple URLs over time, especially with rank instability (the URLs take turns).

Resolution ladder, least destructive first:

1. **Differentiate** — sharpen each page toward a genuinely different intent
   (works when the "cannibalization" was actually two intents mislabeled as one).
2. **Consolidate** — merge the weaker page into the stronger; 301 the loser.
3. **Canonicalize** — when both pages must exist for users (a campaign variant),
   point the secondary's canonical at the primary.
4. **De-optimize** — retitle/retarget the accidental competitor (the blog post
   that outgrew its lane) toward the informational phrasing it actually serves.

## Prioritizing without volume data

No keyword tool, no GSC — still a defensible priority order, built from three
kit-derived axes instead of volume:

1. **Intent proximity** — transactional > commercial > navigational-support >
   informational. A dozen visits from `{name} vs {competitor}` outconvert a
   thousand from a definition query.
2. **ICP specificity** — queries containing the kit's ICP language beat generic
   category terms: cheaper to win and pre-qualified when won.
3. **Winnability** — head terms in a mature category are multi-year projects;
   modified and comparison terms are winnable in months. An early-stage site's map
   should be honest about which head terms are DECLINED-for-now.

State the method in the findings document so the user knows the ranking is
principled inference, not measurement — and name what data would upgrade it
(a GSC grant is free and takes minutes; say so).

## Single-page sites

A one-page landing site still gets a map — it's just short, and its discipline is
concentration rather than coverage:

- The page owns **exactly two clusters**: the brand's navigational set and ONE
  commercial/transactional cluster distilled from the kit's one-liner. Title, H1,
  and the single CTA all serve that one cluster.
- Everything else in the seed list is either DECLINED or a **new-page
  recommendation** — the map is where "we need a pricing page / comparison page"
  becomes a documented, prioritized finding instead of a vague instinct.
- Section anchors (`/#pricing`) are not pages: they can't hold their own title,
  meta, or mapped intent. When a section keeps attracting its own query cluster,
  that's the map telling you it wants to be a page.

## Worked example — Acme

Kit recap: **Acme**, "answers questions about your data in plain English"; ICP:
data leads at mid-size SaaS; CTA **Start free → https://acme.com/signup**; competitors
**DashCo**, **Chartly**. Site: `/`, `/pricing`, `/blog/*`. No volume data supplied;
priorities are intent-ranked and labeled as such.

| Cluster (representative) | Intent | Demand | Mapped URL | Status | Action |
|---|---|---|---|---|---|
| "acme", "acme analytics" | Nav | GSC n/a | `/` | CANNIBAL | `/blog/what-is-acme` outranks `/` — retarget the post to informational phrasing; strengthen `/` brand title |
| "ask questions about your data", "natural language analytics" | Commercial | est: med† | `/` | MISALIGNED | `/` title is "Home \| Acme" — retitle to carry the head term (on-page finding #2) |
| "analytics for SaaS data teams" | Commercial | est: med† | — | GAP | Recommend `/for-data-teams` — highest-fit commercial page; route to landing-page-design + copywriter |
| "acme vs dashco" / "dashco alternative" | Commercial | est: low† | — | GAP | Recommend `/vs/dashco`; a searcher here is days from deciding, and currently a third party hosts the comparison |
| "acme pricing" | Nav/Trans | est: low† | `/pricing` | OK | Confirm indexable (it is) and title pattern |
| "why dashboards go unread" | Info | est: low† | `/blog/dashboards-unread` | OK | Link the post to `/for-data-teams` once it exists — blog currently links to no commercial page (internal-linking finding) |
| "business intelligence" (head term) | Commercial | est: high† | — | DECLINED | Mature head term; unwinnable at current authority — revisit after the comparison and ICP pages earn links |

† estimates — no volume data supplied; ranked by intent proximity per the method above.

Reading the map: the two GAPs and the CANNIBAL row are the strategy findings; the
MISALIGNED row is already covered by an on-page finding; the DECLINED row is the
map preventing wasted effort. Every recommended page routes creation out of this
skill by name — the map targets, the packet builds.
