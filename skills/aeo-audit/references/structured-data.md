# Structured data: current-safe landing-page guidance

Use structured data to describe visible, truthful page content in a vocabulary consumers support.
It is not required for generative AI search, and there is no special AEO/GEO schema type.

## Verify before every recommendation

Feature support changes. At audit time, check:

- Google Search Gallery and the documentation for the exact feature/type;
- Google's general structured-data and spam guidelines;
- Schema.org vocabulary and validator;
- the current documentation of any non-Google consumer named in the report.

Record the URL and access date. Search snippets, old audits, and third-party SEO articles are not
eligibility evidence.

## Removed defaults

- Google deprecated FAQ rich results in May 2026. Do not propose `FAQPage` as Google rich-result
  work. Keep visible FAQ content only when users need it.
- Google removed HowTo rich results. Do not propose `HowTo` as Google rich-result work.
- Do not add either type for unspecified “other engines.” Name and verify the consumer first.
- Do not add markup solely to make a graph larger or to repeat page copy for AI systems.

## Candidate graph

Select only nodes the page earns:

```text
Organization
  <- publisher - WebSite
                    <- isPartOf - WebPage
                                      -> about -> SoftwareApplication | Product | Service
                                      -> breadcrumb -> BreadcrumbList (appropriate subpages)
                                      -> video -> VideoObject (real embedded public video)
```

Use absolute canonical URLs and stable fragment `@id` values. Reuse the same entity ID instead of
emitting conflicting Organization/Product nodes from multiple templates.

## Property rules

- `name`, `description`, logo, URL, price, availability, rating, review, customer, and certification
  values must match visible content and the approved evidence ledger.
- `sameAs` is identity equivalence, not a list of every profile or mention. Use only verified official
  profiles.
- Choose `SoftwareApplication`, `Product`, or `Service` based on the actual offering and the current
  consumer documentation. Do not force a product type to chase a rich result.
- Never add `aggregateRating` without real, visible, sourceable reviews collected under the applicable
  feature policies.
- Offers and prices require current visible parity, currency, availability, and correct ownership.
- `VideoObject` requires a real visible video and current required properties such as thumbnail and
  date; verify the exact documentation at implementation time.
- `BreadcrumbList` represents a real navigational hierarchy, not a made-up keyword path.

## Example skeleton

Replace every placeholder with approved project data and delete unearned nodes/properties:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "<brand.name>",
      "url": "https://example.com/"
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com/",
      "name": "<site name>",
      "publisher": { "@id": "https://example.com/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/page/#webpage",
      "url": "https://example.com/page/",
      "name": "<visible page title>",
      "isPartOf": { "@id": "https://example.com/#website" },
      "about": { "@id": "https://example.com/page/#offering" }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://example.com/page/#offering",
      "name": "<product name>",
      "description": "<visible factual description>"
    }
  ]
}
```

This is a structural example, not a complete or universally eligible graph. Add required properties
only when true and visible; otherwise choose a more accurate type or omit the node.

## Validation sequence

1. Extract markup from the raw HTTP response and rendered DOM; explain any intentional difference.
2. Parse JSON and validate Schema.org vocabulary.
3. Run the current Google Rich Results Test only for types Google currently lists as eligible.
4. Walk every property against visible content and the evidence ledger.
5. Check for duplicate/conflicting nodes across templates and route variants.
6. Verify canonical URLs, protocol, host, trailing-slash policy, and `@id` references.
7. Test representative production URLs after deployment.
8. Monitor Search Console enhancements and performance where a relevant report exists.

Passing a validator does not prove eligibility, display, ranking, citation, or correctness. Report
each of those separately.
