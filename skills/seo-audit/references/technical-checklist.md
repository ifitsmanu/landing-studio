# Technical checklist — command-level, portable

The runnable half of the audit. Every check below states the command (floor-level:
`curl` + text tools unless noted), what a healthy result looks like, what failure
looks like, and the severity to assign. Substitute the audited domain for
`$DOMAIN` throughout — it is an input, never a constant.

Work through the sections in order: each one assumes the previous passed. There is
no value in measuring the Web Vitals of a page that is noindexed.

## Contents

1. [Setup — enumerate the URL set](#setup--enumerate-the-url-set)
2. [Crawlability & indexation](#crawlability--indexation)
3. [Canonicalization](#canonicalization)
4. [Status codes & redirects](#status-codes--redirects)
5. [Sitemap & robots](#sitemap--robots)
6. [Rendering parity](#rendering-parity)
7. [HTTPS & security surface](#https--security-surface)
8. [Mobile baseline](#mobile-baseline)
9. [Core Web Vitals](#core-web-vitals)
10. [Structured-data baseline](#structured-data-baseline)
11. [Severity assignment guide](#severity-assignment-guide)

## Setup — enumerate the URL set

Build the audit's URL list before checking anything, from three sources merged:

```bash
# 1. Sitemap URLs
curl -s "https://$DOMAIN/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g'

# 2. Nav + footer links from the homepage (internal only)
curl -s "https://$DOMAIN/" | grep -o 'href="[^"]*"' | sed 's/href="//;s/"//' \
  | grep -E "^(/|https?://$DOMAIN)" | sort -u

# 3. Any URLs the user names (campaign pages, legacy paths that should redirect)
```

A landing/marketing site typically yields 3–30 URLs. Keep the merged list in a
working file; every subsequent section iterates over it. URLs in the nav but not
the sitemap (or vice versa) are themselves a finding (MED) — the two should agree.

## Crawlability & indexation

The gate everything else waits behind. Check **all three** noindex vectors — the
classic production incident is a staging directive that survives deploy in exactly
one of them.

```bash
# 1. HTTP header noindex (the one people forget)
curl -sI "https://$DOMAIN/" | grep -i 'x-robots-tag'
# Healthy: no output. Fail: any line containing noindex/none → CRIT.

# 2. Meta robots in HTML
curl -s "https://$DOMAIN/" | grep -io '<meta[^>]*name=["'\'']robots["'\''][^>]*>'
# Healthy: absent, or content="index, follow" (redundant but harmless).
# Fail: noindex/none on a page meant to rank → CRIT.

# 3. robots.txt actually blocking
curl -s "https://$DOMAIN/robots.txt"
# Healthy: 200, text/plain, no `Disallow: /` under User-agent: *,
# and a `Sitemap:` line present.
# Fail: `Disallow: /` → CRIT. Missing Sitemap line → MED.
# robots.txt returning 5xx is itself CRIT: Google treats a 5xx robots.txt
# as "assume everything is disallowed" until it can fetch it again.
```

Run all three across the full URL set, not just the homepage — per-route headers
and per-template meta tags diverge (a `/pricing` rendered by a different layout can
carry a directive the homepage doesn't).

Also check the inverse leak: internal-only surfaces (staging subdomains, preview
URLs, `/admin`, parameterized duplicates) that *are* indexable. Search
`site:$DOMAIN` and scan for URLs that shouldn't be there → HIGH if a preview or
staging host is indexed (also a security-adjacent flag for the user).

## Canonicalization

One page, one URL. Four axes multiply into up to 16 addressable variants of the
same page; exactly one may return 200 and all others must 301 to it in one hop.

```bash
# The variant matrix for the homepage (repeat pattern for key pages):
for u in "http://$DOMAIN" "http://www.$DOMAIN" "https://$DOMAIN" "https://www.$DOMAIN" \
         "https://$DOMAIN/" "https://$DOMAIN//" "https://${DOMAIN^^}" ; do
  curl -s -o /dev/null -w "%{http_code}  %{redirect_url}  $u\n" "$u"
done
# Healthy: exactly one 200 (the canonical form); every other row is a 301
# pointing DIRECTLY at the canonical form (not at another redirect).
```

```bash
# rel=canonical on each indexable URL:
curl -s "https://$DOMAIN/" | grep -io '<link[^>]*rel=["'\'']canonical["'\''][^>]*>'
```

Judge the canonical tag against five rules:

1. **Present on every indexable page** — absent → MED (Google guesses; sometimes
   wrong, always slower).
2. **Self-referencing** on the page's own canonical URL — a page canonicalizing
   elsewhere is deliberately ceding its ranking; verify that's intended.
3. **Absolute URL**, matching the canonical host/protocol/slash form exactly —
   relative or mismatched-host canonicals → HIGH.
4. **Points at a 200** — a canonical aimed at a redirect or a noindexed page sends
   contradictory signals → HIGH.
5. **Points on-domain** — a canonical to a different domain (template default left
   over from a theme, a copied boilerplate) silently deindexes the page → CRIT.

Trailing-slash and case policy: whichever form the site picks, it must pick *once*.
Mixed internal links (`/pricing` in nav, `/pricing/` in footer) split signals and
double crawl cost → MED, fix at the link source and the redirect layer together.

## Status codes & redirects

```bash
# Status for every URL in the set:
while read -r u; do
  curl -s -o /dev/null -w "%{http_code}  $u\n" "$u"
done < urls.txt
# Healthy: all 200. Any 3xx here means the sitemap/nav links a non-canonical
# form (MED). 404 on a linked URL → HIGH. 5xx anywhere → CRIT.

# Redirect chains (each legacy/variant URL should reach its target in ≤1 hop):
curl -s -o /dev/null -L -w "%{num_redirects} hops → %{url_effective}\n" "http://www.$DOMAIN/old-path"
# 2+ hops → MED (each hop leaks signal and latency); loops → CRIT.
# 302 where 301 is meant (permanent moves) → MED.
```

Soft-404 check: fetch a deliberately nonexistent path and confirm it returns a
real 404/410, not a 200 with a "not found" body:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://$DOMAIN/definitely-not-a-page-$RANDOM"
# 200 here → MED: soft 404s pollute the index and burn crawl on garbage.
```

## Sitemap & robots

The sitemap is a *promise list*: only URLs you want indexed, in their canonical
form, currently returning 200.

```bash
curl -s "https://$DOMAIN/sitemap.xml" | head -50   # or the index + children
```

Checks, each against the enumerated URL set:

- **Exists, valid XML, referenced by robots.txt** — missing on a multi-page site →
  MED (small sites survive without one; the finding notes that).
- **Only canonical 200 indexable URLs** — a sitemap entry that redirects, 404s, or
  carries noindex is a contradiction Google resolves by trusting the sitemap less
  → MED per class of offender.
- **Honest `lastmod`** — Google uses lastmod only when it proves reliable; a
  sitemap that stamps every URL with the deploy date teaches Google to ignore the
  field → LOW, but fix it (drop lastmod entirely rather than fake it).
- **Coverage** — every page you *want* ranked is present; money pages missing from
  the sitemap → MED.

## Rendering parity

Landing pages built on client-heavy frameworks can serve a near-empty HTML shell
and hydrate everything after. Google renders JavaScript, but rendered-only content
is indexed later, ranked with less certainty, and invisible to every non-Google
consumer of the page. The primary claim, H1, title, and CTA must exist in the raw
HTML response.

```bash
# What does the crawler see BEFORE JavaScript?
curl -s "https://$DOMAIN/" -A "Mozilla/5.0 (compatible; Googlebot/2.1)" > raw.html
grep -c '<h1' raw.html          # 0 → the H1 is client-rendered → HIGH
grep -io '<title>[^<]*' raw.html
# Compare against the hydrated DOM when a headless browser is available;
# meaningful text present only post-hydration → HIGH for primary content,
# MED for secondary content.
```

Also compare Googlebot-UA vs default-UA responses — any difference beyond
personalization is cloaking risk → flag for the user immediately.

Fix direction by stack (examples, not requirements): Next.js/Astro-class → move the
hero and primary copy to server-rendered output; Framer/Webflow-class → usually
fine by default, verify rather than assume; SPA-only stacks → prerender or SSR the
marketing routes specifically.

## HTTPS & security surface

```bash
curl -sI "https://$DOMAIN/" | grep -i 'strict-transport-security'   # HSTS: LOW if absent
curl -s "https://$DOMAIN/" | grep -io 'src=["'\'']http://[^"'\'']*' # mixed content → HIGH
curl -s -o /dev/null -w "%{http_code}\n" "http://$DOMAIN/"          # must 301 to https → else HIGH
```

Mixed content breaks the padlock and browser trust — treat any `http://`
subresource on an `https://` page as HIGH regardless of what it loads.

## Mobile baseline

Google indexes mobile-first; the mobile rendering *is* the page.

```bash
curl -s "https://$DOMAIN/" | grep -io '<meta[^>]*name=["'\'']viewport["'\''][^>]*>'
# Absent → HIGH: the page renders desktop-scaled on phones, and every CWV
# field metric follows it down.
```

With a headless browser available, verify at a mobile viewport: no horizontal
scroll, tap targets ≥ ~44px (the CTA above all), no interstitial covering the
content on entry (intrusive interstitials are a documented ranking suppressor →
HIGH when the primary content is blocked).

## Core Web Vitals

Two data planes — never conflate them in findings:

- **Field data** (CrUX, via the PageSpeed Insights API) is real users over 28 days
  and is what ranking uses. It is the **verdict**.
- **Lab data** (Lighthouse) is one synthetic run. It is the **debugger** — use it
  to explain a field failure, never to declare a pass.

```bash
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://$DOMAIN/&strategy=mobile" \
  > psi.json
# Field (the verdict):   .loadingExperience.metrics  → percentile values
# Lab (the debugger):    .lighthouseResult.audits    → diagnostics per metric
# Low-traffic pages may have no field data ("loadingExperience" absent) —
# then lab is all you have; say so in the finding and downgrade certainty.
```

Thresholds at p75, mobile: **LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1**. Failing any
one on a money page → HIGH. Passing lab but failing field → still HIGH (the field
is right; find what lab doesn't simulate — device class, network, cache state,
third-party variance).

Diagnose in attention terms, anchored on the brand kit's CTA:

| Metric | Attention meaning | The usual landing-page offenders |
|---|---|---|
| LCP | Time until the promise (hero) is visible | Client-rendered hero; hero image not preloaded or lazy-loaded by blanket policy; blocking web-font load on the display face; video hero without a poster; slow TTFB from unneeded dynamic rendering |
| INP | Time until the CTA responds to the click | Hydration cost on interaction; third-party scripts (chat, consent, analytics, session replay) monopolizing the main thread; oversized JS bundles on a page that is mostly static |
| CLS | The CTA doesn't move under the click | Images/embeds without intrinsic dimensions; web fonts swapping without `size-adjust`/metric fallbacks; consent banners and announcement bars injected without reserved space |

Standard fixes to reach for first: preload the LCP image
(`<link rel="preload" as="image">` or the framework's priority prop);
`font-display: swap` plus metric-compatible fallbacks on kit typefaces;
explicit `width`/`height` (or `aspect-ratio`) on all media; defer every
third-party script and load chat-class widgets on interaction; reserve layout
space for anything injected late. A marketing page is mostly static — its JS
budget should embarrass an app, and a finding may reasonably say so with numbers.

## Structured-data baseline

This skill's scope is *validity and safety*, not answer design (that's aeo-audit).

```bash
curl -s "https://$DOMAIN/" | grep -io '<script[^>]*application/ld+json[^>]*>' -A0
# Extract each JSON-LD block and parse it (jq or any JSON parser).
```

- JSON-LD present but unparseable → MED (broken markup is worse than none).
- `Organization` / `WebSite` baseline present with name, url, logo consistent with
  the brand kit → healthy; absent → LOW here (upgrade path noted for aeo/geo).
- Markup describing content that isn't on the page (review stars with no reviews,
  fake FAQ) → HIGH: spammy structured data risks manual action. Flag and remove.
- Anything answer-shaped or specialized → don't audit its design here; log the
  handoff note to **aeo-audit**.

## Severity assignment guide

When a check doesn't map cleanly, assign by asking in order:

1. **Does it stop the page from being indexed or served?** → CRIT.
   (noindex, robots block, 5xx, canonical off-domain, robots.txt 5xx, redirect loop)
2. **Does it measurably suppress ranking or the click for a money page?** → HIGH.
   (failing CWV field data, missing/duplicate titles, client-rendered primary
   content, mixed content, indexed staging hosts, no viewport, spammy markup)
3. **Does it leak signal, budget, or trust without blocking anything?** → MED.
   (redirect chains, soft 404s, sitemap contradictions, mixed slash policy,
   missing canonicals, nav/sitemap disagreement)
4. **Is it polish with a real but small upside?** → LOW.
   (HSTS, lastmod hygiene, favicon set, baseline schema absence)

One escalation rule: any MED that sits directly on the **query → SERP → page → CTA**
chain for the kit's primary CTA page escalates one level. The homepage's redirect
chain matters more than a blog post's.
