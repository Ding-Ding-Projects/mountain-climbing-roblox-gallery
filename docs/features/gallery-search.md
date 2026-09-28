# Gallery search

The gallery defaults to plain-text title, caption, location, and activity search. The adjacent pattern workbench lets a visitor deliberately switch to regular-expression matching, choose JavaScript flags, inspect valid and invalid patterns, and preview matching captions. The list is filtered locally in the browser. No query or preference is sent to a server.

The first gallery state contains no cards until reviewed image records have been added to `docs/evidence/gallery.json`. A pattern that matches nothing reports an empty result instead of showing sample material.

## Failure modes and privacy

Invalid expressions are shown as an inline error, not executed. Long query input is bounded. Image captions and metadata are treated as text. The gallery does not render remote URLs as images. Each image is verified against its recorded SHA-256 before it can be displayed.

## Verification

The current source includes plain-text filtering, opt-in pattern filtering, flag selection, result counts, and hash verification. Built-page interaction evidence and reviewed image receipts remain pending.

## Suggested articles

- [Evidence and capture provenance](../evidence/README.md)
- [Accessibility and language controls](accessibility-and-language.md)
