# Gallery search

The gallery defaults to plain-text title, caption, location, activity, stage, and capture-type search. Three facet groups are generated from the verified records, so their choices never claim values absent from the current inventory. Search results combine the text query with every selected facet. The adjacent builder opens beside the field and switches to regex only when a valid pattern is explicitly applied. In regex mode, the main search field and builder pattern stay synchronized. Invalid patterns refuse application and return no stale matches. The test-text preview shows match counts, replacement output, elapsed time, and the current gallery records matched. Search and filtering run locally. No query or preference is sent to a server.

The verified source currently has one construction-progress record. Facet values are derived from verified records, not sample content. A pattern that matches nothing reports an empty result instead of showing sample material. Start, end, and word-boundary controls insert anchors at the caret; the literal action escapes the current search text before testing it.

## Failure modes and privacy

Invalid expressions and unsupported flags are shown inline and never applied. Patterns are limited to 128 characters, test text to 512 characters, and repeated ambiguous groups or quantified alternatives are refused before matching. This risk screen is bounded and does not prove all JavaScript expressions safe. Image captions and metadata are treated as text. Image paths must match the local evidence-image filename format and resolve relative to the evidence manifest; remote URLs and traversal paths are rejected. Each image is verified against its recorded SHA-256 before it can be displayed.

All search labels, facet legends and choices, builder actions, errors, mode notices, empty states, and preview summaries support English, Cantonese, and bilingual copy. Filter chips and builder actions use native buttons with visible keyboard focus and at least 44-pixel targets. At narrow widths the facet groups stack and the anchored builder becomes an inline panel under its search field.

## Verification

The current source includes record-derived type, location, and stage facets; plain-text-first filtering; explicit regex opt-in; synchronized query and pattern fields; validation refusal; sample and gallery match previews; anchor insertion; literal escaping; bilingual/bilingual-mode strings; keyboard-focus restoration; and image-hash verification. Browser/runtime interaction, accessibility, 320-pixel layout, and published-page evidence remain pending.

## Suggested articles

- [Evidence and capture provenance](../evidence/README.md)
- [Accessibility and language controls](accessibility-and-language.md)
