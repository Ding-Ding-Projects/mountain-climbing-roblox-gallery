# Gallery search

The gallery defaults to plain-text title, caption, location, activity, stage, and capture-type search. Three facet groups are generated from the verified records, so their choices never claim values absent from the current inventory. Search results combine the text query with every selected facet. The adjacent builder opens beside the field and switches to regex only when a valid pattern is explicitly applied. In regex mode, the main search field and builder pattern stay synchronized. Invalid patterns refuse application and return no stale matches. The test-text preview shows match counts, replacement output, elapsed time, and the current gallery records matched. Search and filtering run locally. No query or preference is sent to a server.

The verified source currently has one construction-progress record. Facet values are derived from verified records, not sample content. A pattern that matches nothing reports an empty result instead of showing sample material. Start, end, and word-boundary controls insert anchors at the caret; the literal action escapes the current search text before testing it.

## Failure modes and privacy

Invalid expressions and unsupported flags are shown inline and never applied. Patterns are limited to 128 characters, test text to 512 characters, and repeated ambiguous groups or quantified alternatives are refused before matching. This risk screen is bounded and does not prove all JavaScript expressions safe. Image captions and metadata are treated as text. Image paths must match the local evidence-image filename format and resolve relative to the evidence manifest; remote URLs and traversal paths are rejected. Each image is verified against its recorded SHA-256 before it can be displayed.

All search labels, facet legends and choices, builder actions, errors, mode notices, empty states, and preview summaries support English, Cantonese, and bilingual copy. Filter chips and builder actions use native buttons with visible keyboard focus and at least 44-pixel targets. At narrow widths the facet groups stack and the anchored builder becomes an inline panel under its search field.

## Verification

The current source includes record-derived type, location, and stage facets; plain-text-first filtering; explicit regex opt-in; synchronized query and pattern fields; validation refusal; sample and gallery match previews; anchor insertion; literal escaping; bilingual-mode strings; keyboard-focus restoration; and image-hash verification. Focused browser interaction passed on source revision `9afe0b77b628eb04bab0dc17f43bdf6776cac6c4`: plain-text match and empty state, invalid-pattern refusal, preview before Apply, valid application, return to plain text, Cantonese and bilingual copy, facet state and focus, and Enter/Escape builder operation.

The responsive repair was verified against source revision `93abe3583cb61cb35438d3ec236835189ebf54d9`. At a 929×1004 browser window, the measured CSS viewport was 885×900 after browser chrome and scrollbars; the search field measured 560.92 CSS pixels and each of three facet columns measured 261.91 pixels. At a 320×800 emulated touch viewport, the search field measured 292.81 pixels and each facet measured 288.81 pixels. Neither viewport had horizontal overflow. Visible controls met the 44-pixel minimum. Enter opens the pattern builder and moves focus into it; Escape closes it and restores focus. A touch selection updates the location filter. The accessibility tree contained no unnamed interactive controls in either viewport. The desktop and mobile checks reported no page exceptions, console errors, failed requests, or non-success responses. See [the measured report](../evidence/ui/responsive-layout.json) and its original captures.

The focused negative regression, full cross-feature accessibility contract, screen-reader testing, and public-page verification remain pending. Source and local browser evidence do not prove deployment.

## Suggested articles

- [Evidence and capture provenance](../evidence/README.md)
- [Accessibility and language controls](accessibility-and-language.md)
