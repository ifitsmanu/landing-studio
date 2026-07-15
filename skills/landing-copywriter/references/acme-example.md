# Worked Example — Acme, an analytics SaaS

The complete artifact set for a generic product, end to end: kit → message
map → full copy deck (every string, labeled, with word counts) → claims
ledger → QA results. Acme is the packet's shared worked example — the same
fictional product motion-video's launch film sells — so the copy here should
feel continuous with that film's claim and CTA. Nothing in this file is a
real company, customer, or statistic.

## Contents

1. [The brand kit, filled](#the-brand-kit-filled)
2. [The message map (approval unit)](#the-message-map)
3. [The copy deck](#the-copy-deck)
4. [The claims ledger](#the-claims-ledger)
5. [QA gate results](#qa-gate-results)
6. [Handoff notes](#handoff-notes)

## The brand kit, filled

```yaml
# An instance of the packet's shared kit (canonical schema: landing-page-build),
# trimmed to the fields this skill reads plus the design context it respects.
brand:
  name: "Acme"
  colors: { primary: { bg: "#0A0A0A", fg: "#FAFAF7", accent: "<supplied>" } }
  type: { display: "geometric sans", body: "neutral sans", mono: "for SQL snippets" }
  logo: { files: ["assets/acme-wordmark.svg"] }
product:
  one_liner: "Acme answers questions about your data in plain English."
  category: "analytics assistant"
  audience: >-
    Heads of ops and data leads at 20–500-person SaaS companies. They own
    reporting but aren't analysts; they live in spreadsheets and a BI tool
    someone set up two jobs ago. Objections: security of connected data,
    "our data is too messy", losing SQL control, migration effort.
  ui_material:
    screenshots: ["ask-answer.png", "anomaly-flag.png", "shared-report.png"]
voice:
  tone: ["plain", "confident", "dry"]
  avoid: ["unleash", "exclamation points"]
cta: { verb: "Start free", destination: "https://acme.com/signup" }
proof:
  claims:
    - { id: "claim-001", text: "Median time from question to answer: 11 seconds", source: "metrics/q2-latency.md (p50, prod, 30d)" }
    - { id: "claim-002", text: "Quote from J. Rivera, Head of Ops, Northbeam Logistics", source: "email 2026-04-18, approved verbatim" }
    - { id: "claim-003", text: "400+ teams", source: "CRM export 2026-05 (412, rounded down)" }
    - { id: "claim-004", text: "SOC 2 Type II", source: "compliance/soc2-report-2026.pdf" }
    - { id: "claim-005", text: "Free plan: 14 days, no credit card", source: "pricing config, confirmed by user" }
competitors:
  - { name: "Dashly", source: "<official current page>", buyer_context: "dashboard suite" }
  - { name: "QueryCo", source: "<official current page>", buyer_context: "SQL notebook" }
```

## The message map

The approval unit — signed off before a word of deck copy was written.
Traffic temperature: warm (launch page; referral + newsletter arrivals).

| # | Belief | Section | The one message | Budget |
|---|---|---|---|---|
| 1+2 | "For me, and I get what it is" | Hero | You can ask your data questions in English and get answers — without being an analyst | H1 ≤ 8w · SUB ≤ 22w |
| 3 | "It works" | Product (3 blocks) | Ask→answer, anomalies self-flag, answers are shareable — each shown, not asserted | HDR ≤ 6w · BODY ≤ 40w each |
| 4 | "For teams like mine" | Proof | A named ops lead switched and deleted dashboards; 400+ teams; 11-second median | QUOTE ≤ 35w |
| 5 | "Low-risk" | FAQ (4 Qs) | Data is safe, SQL still available, pricing is plain, migration is nothing | first sentence answers |
| 6 | "Now" | Final CTA | Two minutes to your first answer | 1 line + button |

Skim chain (headers + buttons only, the whole argument):
*Answers, not dashboards. → Ask anything, in English. → Anomalies flag
themselves. → Share the answer, not the query. → Teams like yours already
switched. → Questions, answered. → Two minutes to your first answer. →
Start free.*

Every link is a labeled deck slot, in order: H1 → HDR-1 → HDR-2 → HDR-3 →
HDR-4 → HDR-FAQ → HDR-5 → CTA-F. (Section 2's STRIP rides the skim as proof
between links 1 and 2, but the argument must stand without it.) This chain is
quoted verbatim in SKILL.md's worked example — if either copy changes, change
both.

## The copy deck

Every string on the page, in page order. Slot labels are the deck's
contract with landing-page-design; word counts in brackets. Counting
convention (so the budget check is reproducible): whitespace-separated
words — hyphenated compounds count once; standalone punctuation and symbols
(—, ·, ↓) count zero.

### Section 1 — Hero  *(beliefs 1+2)*

| Slot | Copy | Count |
|---|---|---|
| EYEBROW | For teams without an analyst | [5] |
| H1 | Answers, not dashboards. | [3] |
| SUB | Ask questions about your data in plain English. Acme answers in seconds — no SQL, no dashboard hunting. | [17] |
| CTA-P | Start free | [2] |
| CTA-P-MICRO | Free 14 days · No credit card | [6] |
| CTA-S | See how it works ↓ | [4 — anchor to Section 3] |
| HERO-CAP | "Why did churn spike in March?" — asked and answered, live. | [10] |

*Notes: H1 is the outcome-contrast pattern; competitor-swap kills neither
alternative candidate (`Ask your data anything.` — verb-first; `Your data,
in plain English.` — mechanism), but the contrast pattern positions against
both named competitors in three words. Both facts in CTA-P-MICRO are ledger
rows 5a/5b. The hero screenshot is `ask-answer.png` mid-answer; HERO-CAP
names what it proves.*

### Section 2 — Social proof strip  *(belief 4 seed)*

| Slot | Copy | Count |
|---|---|---|
| STRIP | 400+ teams get their answers from Acme | [7 — ledger row 3] |

### Section 3 — Product, three blocks  *(belief 3; CTA-S anchor target)*

| Slot | Copy | Count |
|---|---|---|
| HDR-1 | Ask anything, in English | [4] |
| BODY-1 | Type the question the way you'd ask a colleague. Acme writes the query, runs it, and answers in a sentence — with the chart to back it up. | [27] |
| CAP-1 | Median time from question to answer: 11 seconds. | [8 — ledger row 1] |
| HDR-2 | Anomalies flag themselves | [3] |
| BODY-2 | Acme watches your metrics while you don't. When churn, spend, or signups break pattern, you get a plain-English explanation of what moved — before anyone asks. | [25] |
| CAP-2 | March 14: trial-to-paid conversion dropped 22% — flagged at 9:02am. | [9 — synthetic data, labeled in-frame] |
| HDR-3 | Share the answer, not the query | [6] |
| BODY-3 | Every answer becomes a link. Your CEO sees the sentence and the chart — not a dashboard with forty tabs and a filter bar. | [23] |
| CAP-3 | One answer, one link, zero “which filter did you use?” | [10] |

*Notes: parallel headers (claim-shaped, ≤6 words). Each block points at its
screenshot; the copy names what the image proves. CAP-2's numbers are
synthetic demo data — the screenshot itself carries a "sample data" label
(in-frame, per the honesty contract), so the caption may narrate it.*

### Section 4 — Proof  *(belief 4)*

| Slot | Copy | Count |
|---|---|---|
| HDR-4 | Teams like yours already switched | [5] |
| QUOTE-1 | "We deleted fourteen dashboards in the first week. People just… ask now. The Monday metrics meeting is twenty minutes shorter." | [20 — ledger row 2] |
| QUOTE-1-ATTR | J. Rivera · Head of Ops, Northbeam Logistics | [—] |
| METRIC-1 | 400+ teams | [ledger row 3] |
| METRIC-2 | 11s median answer | [ledger row 1] |
| METRIC-3 | SOC 2 Type II | [ledger row 4] |
| CTA-ECHO | Start free | [2 — post-proof echo, identical wording] |
| CTA-ECHO-LEAD | Your dashboards won't miss you. | [5] |

### Section 5 — FAQ  *(belief 5; four real objections from the kit's ICP)*

| Slot | Copy |
|---|---|
| HDR-FAQ | Questions, answered. [2] |
| FAQ-1-Q | Is my data safe with Acme? |
| FAQ-1-A | Yes. Acme is SOC 2 Type II certified, connects read-only, and never trains models on your data. Your warehouse stays the source of truth — Acme only queries it. |
| FAQ-2-Q | Can I still write SQL when I need to? |
| FAQ-2-A | Yes — every answer ships with the SQL that produced it, and you can edit and re-run it. Acme removes the requirement, not the option. |
| FAQ-3-Q | What does it cost? |
| FAQ-3-A | Every plan includes every feature; pricing scales with seats. The free trial is 14 days, full product, no credit card. |
| FAQ-4-Q | How long does setup take? |
| FAQ-4-A | Connect your warehouse with read-only credentials and ask your first question — most teams do it inside two minutes. There's nothing to migrate: your data stays where it is. |

*Notes: HDR-FAQ keeps the FAQ visible in the skim chain — a section without
a header is a hole in the skim. First sentence of every answer is the answer
(also what aeo-audit wants). FAQ-3 is the uncomfortable money question,
answered in the plainest register on the page. FAQ-1-A's "never trains
models" claim was user-confirmed and added to the ledger (row 6) before the
deck shipped.*

### Section 6 — Final CTA  *(belief 6)*

| Slot | Copy | Count |
|---|---|---|
| HDR-5 | Two minutes to your first answer | [6 — basis: ledger row 7] |
| CLOSE-SUB | Connect your data, ask a question, get an answer. That's the product. | [12] |
| CTA-F | Start free | [2 — identical wording, third and last placement] |
| CTA-F-MICRO | Free 14 days · Cancel anytime | [5 — rows 5a/5c] |

*Notes: HDR-5 is the message map's row-6 message verbatim, inside the 6-word
header budget. CTA-F-MICRO carries two facts, not three (`cta-copy.md`'s
≤ 2-fact rule — three facts under a button reads as protesting too much):
the close answers the objection of the moment, lock-in, with "Cancel
anytime"; the hero already carried the credit-card fact.*

### Microcopy appendix — form, errors, nav, footer

| Slot | Copy |
|---|---|
| FORM-LABEL-1 | Work email |
| FORM-PLACEHOLDER-1 | you@company.com |
| FORM-SUBMIT | Start free |
| FORM-PRIVACY | We'll only email you about your account. [Privacy policy] |
| FORM-ERR-EMAIL | That email doesn't look complete — check for a typo? |
| FORM-ERR-NET | Something broke on our end. Try again — your info is still here. |
| FORM-SUCCESS | Check your inbox — your workspace link is on its way. |
| NAV | Product · Pricing · Docs · [Start free] |
| ALT-HERO | Acme answering "Why did churn spike in March?" with a one-sentence answer and chart |
| ALT-2 | Acme anomaly alert explaining a drop in trial conversion, on sample data |
| ALT-3 | A shared Acme answer page showing one sentence and one chart |
| FOOTER-CTA | Ask your first question. **Start free** |

## The claims ledger

| # | On-page text | Source | Verified by | Date | Notes |
|---|---|---|---|---|---|
| 1 | "11 seconds" / "11s median answer" | metrics/q2-latency.md | user | 2026-06-02 | p50, prod, 30-day window |
| 2 | QUOTE-1 + attribution | email 2026-04-18 | user | 2026-06-02 | approved verbatim, elision-free |
| 3 | "400+ teams" | CRM export 2026-05 | user | 2026-06-02 | 412, rounded down |
| 4 | "SOC 2 Type II" | compliance/soc2-report-2026.pdf | user | 2026-06-02 | current period |
| 5 | "Free 14 days" / "No credit card" / "Cancel anytime" | pricing config | user | 2026-06-02 | three separate facts, each confirmed |
| 6 | "never trains models on your data" | security whitepaper §3 | user | 2026-06-03 | added during FAQ drafting |
| 7 | "two minutes" (setup / first answer) | onboarding analytics, median | user | 2026-06-03 | median 1m 48s, rounded up |
| — | CAP-2 anomaly numbers | synthetic demo data | — | — | screenshot labeled "sample data" in-frame |

## QA gate results

- **5-second test** — hero alone: *analytics tool; for teams without an
  analyst; the button says Start free.* Pass.
- **Skim test** — the header chain (see message map) states the full
  argument, no label-headers, and all eight links map to labeled deck slots
  (H1 → HDR-1…3 → HDR-4 → HDR-FAQ → HDR-5 → CTA-F). Pass.
- **Competitor-swap** — Dashly cannot run "Answers, not dashboards" (it
  sells dashboards); QueryCo cannot (its product *is* the query). Pass.
- **One-CTA audit** — one destination (`https://acme.com/signup`) at three
  placements, identical wording; one subordinate same-path secondary
  (anchor scroll). Pass.
- **Scent trail** — "Start free" → free signup, no card wall (row 5). Pass;
  destination header echo ("Create your free workspace") noted in handoff.
- **Claims traceability** — every number/quote/badge maps to rows 1–7;
  synthetic data labeled in-frame. Pass.
- **Slop scan** — zero blacklist hits. (Draft 1 had "seamlessly connects";
  the replacement procedure produced FAQ-4-A's "read-only credentials…
  inside two minutes" — the fact the adjective was hiding.)
- **Budget check** — re-run against the final deck under the stated counting
  convention, after the count corrections (SUB 17, HERO-CAP 10, BODY-2 25,
  CAP-2 9, QUOTE-1 20) and three trims the first pass had waved through:
  EYEBROW cut to 5/5, HDR-5 recut to 6/6, CTA-F-MICRO trimmed to two facts.
  Every slot now at or under its ceiling — H1 3/8, SUB 17/22, headers ≤ 6
  (HDR-FAQ 2/6, HDR-5 6/6), bodies ≤ 40 (longest 27), captions ≤ 12 (longest
  10), quote 20/35, buttons 2–4, risk-reversal lines ≤ 8 words · ≤ 2 facts.
  Pass.
- **Read-aloud** — one stumble ("zero 'which filter did you use?'" — kept
  deliberately; it's the ICP's verbatim pain). Pass.
- **Voice conformance** — plain, dry, zero exclamation points; kit taboo
  ("unleash") absent. Pass.

## Handoff notes

To **landing-page-design**: H1 is 3 words — display scale can go maximal.
CTA-P-MICRO must sit inside the hero button's visual group. Section 3
headers are parallel by design; don't reorder blocks (belief order). FAQ is
four items under HDR-FAQ, closed by CTA-F — the page must not end on the FAQ.
To **landing-design-system**: mono face appears once (SQL snippet in
`ask-answer.png` context); confirm the display face holds 3 words at hero
scale with the wordmark clear-space rule.
To **motion-video**: claim, CTA, and beats already aligned with the launch
film; the hero's HERO-CAP question ("Why did churn spike in March?") is the
film's opening frame — keep them identical.
To **seo-audit / aeo-audit**: FAQ answers are direct-first-sentence by
design; title/meta not written here.
To **landing-page-build**: deck is final pending destination-page header
echo (out of scope here — flagged, not fixed).
