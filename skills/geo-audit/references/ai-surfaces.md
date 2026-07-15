# AI surfaces: current-source access map

This file is an audit checklist, not a permanent crawler registry. Verify every row against the
linked official vendor documentation at audit time and record the access date.

## Separate four functions

1. **Search/index crawler:** builds or improves a retrievable search index.
2. **User fetcher:** accesses a page in response to a user request.
3. **Training crawler/token:** controls possible model-development use.
4. **Browser agent:** interacts with rendered controls and accessibility semantics.

The same vendor may use several. A decision about training is not automatically a decision about
search visibility or a user's requested fetch.

## Current official references

| Vendor | Search/retrieval | User fetch / agent | Training control | Official source |
|---|---|---|---|---|
| OpenAI | `OAI-SearchBot` | verify current browser/agent behavior; OpenAI recommends accessible ARIA semantics | `GPTBot` | https://help.openai.com/en/articles/12627856-publishers-and-developers-faq and https://openai.com/searchbot |
| Anthropic | `Claude-SearchBot` | `Claude-User` | `ClaudeBot` | https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler |
| Perplexity | `PerplexityBot` | `Perplexity-User` | the official crawler page says these two are not foundation-model training crawlers | https://docs.perplexity.ai/docs/resources/perplexity-crawlers |
| Google | `Googlebot` supports ordinary Search and its generative features | verify current agent products separately | `Google-Extended` is a robots token for specified Gemini training/grounding uses and does not control Google Search | https://developers.google.com/search/docs/fundamentals/ai-optimization-guide and Google's crawler docs |
| Microsoft | verify current Bing/Copilot documentation | verify current agent product | verify current training controls | official Microsoft/Bing webmaster docs at audit time |

OpenAI may publish additional purpose-specific agents such as ads landing-page validation. Add them
only when that workflow is in scope and verify the current official documentation.

## Access audit

### 1. Business decision

For each vendor/function, record `allow`, `block`, or `undecided`, the reason, owner, affected paths,
and review date. Public marketing content and private/customer content may require different rules.

### 2. robots and meta directives

Read the effective top-level and subdomain `robots.txt`, page-level meta robots, and `X-Robots-Tag`.
Do not paste a generic block/allow list. Confirm syntax and that the crawler can access the page needed
to read a `noindex` or other directive.

### 3. WAF/CDN verification

Robots policy does not prove network access. Inspect bot-management settings, allow/deny rules,
rate limits, and current official IP ranges where vendors publish them. A spoofed user-agent is not
proof of genuine crawler access. Server/CDN logs and verified IP/host guidance are stronger evidence.

### 4. Raw response and rendered page

Fetch key URLs without relying on browser state. Confirm the canonical content, links, metadata, and
approved facts are present in a usable response. Then test the rendered DOM and accessibility tree for
browser agents. Client rendering support differs by system and can change; do not assert one universal
rule for all AI fetchers.

### 5. Walls and states

Check authentication, geo restrictions, age gates, cookie/consent interstitials, bot challenges,
paywalls, redirects, localization, and error pages. Record the actual response each intended consumer
receives.

### 6. Logs and referrals

Use logs to verify real requests, status, rate limiting, and propagation. OpenAI documents
`utm_source=chatgpt.com` on ChatGPT search referrals; verify current behavior and preserve the
parameter through the conversion journey. Define equivalent source handling only from observed data
or vendor docs.

## Google generative-search guardrails

Google's current official guidance states:

- existing technical SEO and index/snippet eligibility remain foundational;
- valuable, unique, non-commodity, people-first content matters;
- no special generative-search schema is required;
- no fixed content chunking is required;
- no AI-specific rewrite style is required;
- `llms.txt` does not help or hurt Google Search visibility because Google ignores it;
- scaled low-value generated content can violate spam policies;
- image and video quality and accessible, usable pages remain useful.

Link the current guide in the audit rather than paraphrasing it as a new ranking recipe:
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

## `llms.txt`

`llms.txt` is a proposed Markdown convention used by some documentation products as a navigation or
content map. Its presence on a vendor's docs does not prove ranking or citation use.

Decision rule:

- For Google Search: no visibility benefit; Google says it ignores the file.
- For another named consumer: verify current official documented use and purpose.
- For internal/agent navigation: it may be useful if the project can keep it accurate.
- Never rank it above indexability, original content, primary evidence, accessibility, or measurement.

If shipped, generate it from a maintained source of truth, test every link, include no private data,
assign an owner, and make no ranking guarantee.

## Agent-friendly pages

Use semantic landmarks, native controls, descriptive accessible names, explicit roles/states only
where native semantics are insufficient, stable destinations, visible error/success states, and
usable small-width layouts. Test the journey with the target agent/browser when available. The same
work improves assistive-technology and automated-browser reliability.
