# Media rights and provenance

This is an operational checklist, not legal advice. Public availability is not permission. A stock-site license may cover copyright while privacy, publicity, trademark, property, artwork, music, and model-release rights still need review.

## Source lanes

- First-party product captures and supplied brand assets are preferred, but ownership and customer-data safety must still be confirmed.
- [Unsplash](https://unsplash.com/license), [Pexels](https://www.pexels.com/license/), and [Pixabay](https://pixabay.com/service/license-summary/) provide broad free-use lanes with different prohibited uses. Check the current full terms for the exact asset and channel at acquisition time.
- Google Fonts are individually licensed. Record the exact family/version/license and prefer self-hosting when privacy, availability, or performance requires it.
- Generated images/video require the tool/model, prompt or edit lineage, source/reference assets, account/license terms, disclosure rules, and human likeness/trademark review.
- A screenshot of a public website is normally a research artifact, not automatically publishable campaign media.

## Required ledger fields

Every release asset records:

- stable ID, local path, and SHA-256 hash;
- asset type and intended job;
- creator, rights owner, source URL, and acquisition date;
- license identifier, full terms URL, and retained terms snapshot;
- allowed channels, modifications, territory, duration/expiry, attribution, and restrictions;
- identifiable people and model-release status;
- trademarks/products/property/artwork and separate permission status;
- first-party data, privacy, consent, and redaction status;
- generative model/tool, inputs, reference rights, and disclosure;
- approver and approval date.

Missing or ambiguous fields remain `unknown` and block that asset from release. They do not default to allowed.

## Capture rules

- Use demo/synthetic data unless real data has explicit public-use authorization.
- Hide credentials, tokens, account identifiers, notifications, browser chrome, internal URLs, and customer information.
- Record whether product behavior is live, staged, simulated, sped up, or composited; disclose material simulation in the experience.
- Preserve editable source and the exact capture/build version.
- Recheck rights when repurposing from a page to paid ads, social, broadcast, events, or templates.

Use the `media-sourcing` skill and `templates/media-ledger.yaml` before implementation.
