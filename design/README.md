# Design references

The gallery uses a field-journal direction: charcoal and deep alpine blue surfaces, high-visibility glacier cyan, warm route-marker orange, compact uppercase location metadata, and large image frames only when genuine captures exist. The page avoids a decorative landscape illustration so the Roblox captures remain the sole visual evidence.

Material Designer was not available in the active tool set. This checked-in reference and the state inventory below are the sanctioned local handoff for this implementation slice.

## States

| State | Initial content | User action | Evidence status |
|---|---|---|---|
| Gallery, no captures | Honest empty state, search and filters remain available | Search or open settings | Implemented in source, not yet captured from a deployed page |
| Gallery, reviewed captures | Only manifest entries with reviewed receipts | Search, open image detail, export inventory | Awaiting genuine capture inputs |
| Settings | Local language, theme, dialog emoji, and vocabulary-file controls | Change a setting or load/reset a valid file | Implemented in source, not yet captured from a deployed page |
| Pattern workbench | Pattern, flags, sample input, matches, and explanation | Build and preview a search pattern | Implemented in source, not yet captured from a deployed page |
| Help and evidence | Provenance requirements and contract inventory | Open evidence guidance | Implemented in source, not yet captured from a deployed page |

## Viewports and assets

- Intended minimum viewport: 320 CSS pixels.
- Desktop reference viewport: 1440 × 900 CSS pixels.
- Theme: dark alpine palette, with a complete light theme toggle.
- Type: system sans-serif stack, no remote fonts.
- Image policy: zero stock or generated game images. The only gallery images may be reviewed captures from the actual experience.
- Capture time: never inferred from a filename or file timestamp.
