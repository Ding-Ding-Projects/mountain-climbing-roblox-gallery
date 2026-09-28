# Accessibility and language controls

Navigation uses native buttons, explicit focus styles, visible text labels, and a responsive layout designed from 320 CSS pixels upward. Visitors can select English, Cantonese, or bilingual copy, switch between light and dark themes, and keep those choices in browser-local storage. Dialog emoji and independent language-specific playfulness sliders are also local preferences.

The settings section has a local JSON picker. Files are bounded in size and parsed before storage; the UI reports invalid input and supports replacement and clear. The source does not contain any private vocabulary data. Browser-local data can be removed by clearing this page's storage.

## Failure modes and privacy

If browser storage is unavailable, controls remain usable for the current page view and the page announces that persistence is unavailable. No preference, search, uploaded file, or capture metadata is transmitted. Screen-reader labels stay explicit and controls remain keyboard-operable.

## Verification

These controls are implemented in source. Runtime, screen-reader, touch-device, large-text, and real capture checks are still pending.

## Suggested articles

- [Gallery search](gallery-search.md)
- [Evidence and capture provenance](../evidence/README.md)
