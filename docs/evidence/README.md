# Evidence and capture provenance

The gallery publishes only real images captured from Roblox Studio. It does not use mockups, generated scenery, stock imagery, or edited composites as game evidence.

## Required record per image

| Field | Requirement |
|---|---|
| `path` | Public path to the original image bytes |
| `sha256` | SHA-256 of those exact bytes |
| `sourceRevision` | Source revision used for the capture, when available |
| `state` | The actual screen or interaction shown |
| `viewport` | Captured width and height |
| `scale` | Display scale used by the capture route |
| `theme` | Theme shown in the capture |
| `method` | The real capture method and tool |
| `privacyReview` | Reviewer and pass or exclusion result, without private details |
| `capturedAt` | Timestamp and timezone copied only from a validated capture receipt; otherwise `null` |

Original captures stay unchanged. Review image pixels, captions, metadata, and filenames before publication. Never include private source details, machine paths, account data, credentials, or unrelated screen content. A withheld image is recorded with a public-safe reason that does not repeat the sensitive content.

## Present inventory

`docs/evidence/gallery.json` currently contains zero entries. That is an honest pending state, not a sample gallery. The required real Studio capture batch has not reached this repository.

## Adding a reviewed batch

Use `node scripts/add-reviewed-capture.mjs --image <original-image> --receipt <validated-receipt.json>` for each original image. The utility checks the receipt version and required fields, verifies the source file SHA-256 against the receipt, copies the original bytes without image editing, and adds a manifest record. It rejects diagnostic images, failed privacy reviews, duplicate capture IDs, unsupported formats, invalid dates, and path-like capture IDs. It never guesses a timestamp. Inspect image pixels and metadata before invoking it; the utility cannot judge whether the content is safe or realistic.

After the capture is included, rebuild or deploy the static page, inspect it as a visitor, and verify the public page and every image URL independently. Dates come from validated receipts, never filenames or local file timestamps.
