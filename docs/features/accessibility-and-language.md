# Accessibility and language controls

Navigation uses native buttons, explicit focus styles, visible text labels, and a responsive layout designed from 320 CSS pixels upward. Visitors can select English, Cantonese, or bilingual copy, switch between light and dark themes, and keep those choices in browser-local storage. Dialog emoji and independent language-specific playfulness sliders are also local preferences.

The settings section has a local JSON picker. Files are bounded in size and parsed before storage; the UI reports invalid input and supports replacement and clear. The source does not contain any private vocabulary data. Browser-local data can be removed by clearing this page's storage.

## Failure modes and privacy

If browser storage is unavailable, controls remain usable for the current page view and the page announces that persistence is unavailable. No preference, search, uploaded file, or capture metadata is transmitted. Screen-reader labels stay explicit and controls remain keyboard-operable.

## Verification

The responsive search and filter controls were checked in an isolated browser at desktop and 320 CSS-pixel touch-emulated sizes. Both had no horizontal overflow; tested controls were at least 44 pixels high, and the accessibility tree had no unnamed interactive controls. This focused check does not replace screen-reader testing, large-text verification, or full-page accessibility review. These captures belong to their recorded source revision, not the later settings and command-palette search changes.

## Gallery search and filters

Search and its record-derived capture type, location, and stage facets have complete English, Cantonese, and bilingual labels, choices, mode notices, validation messages, preview summaries, and empty states. Native buttons provide keyboard and touch operation with visible focus and minimum 44-pixel targets. The adjacent pattern builder restores focus to its opening control when closed. Focused browser checks verified keyboard open/close, a touch filter selection, no unnamed interactive controls, and no horizontal overflow at 929×1004 and 320×800. Screen-reader testing and the remaining universal page contracts are still pending. Measurements and captures are linked from [the responsive report](../evidence/ui/responsive-layout.json).

## Settings and command-palette search

The settings view and command palette now have separate indexed searches, each defaulting to plain text and supporting an explicit bounded-regex mode with preview, anchor insertion, literal escaping, and invalid-pattern refusal. Search labels, result labels, builder actions, status, and empty-state copy update for English, Cantonese, and bilingual modes. Results are keyboard- and touch-activated buttons that navigate to settings controls, including the local file picker, status, and clear action. Search state stays in browser-local storage.

Current source checks passed for inline JavaScript parsing, unique IDs, label targets, literal selectors, localized-key coverage, and five pattern cases. The isolated browser route was unavailable for this revision, so responsive behavior, screen-reader output, keyboard and touch interaction, and captures for these controls remain unverified.

## Suggested articles

- [Gallery search](gallery-search.md)
- [Settings and command-palette search](settings-search.md)
- [Evidence and capture provenance](../evidence/README.md)
