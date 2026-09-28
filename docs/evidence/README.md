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
| `scale` | Display scale used by the capture route, or `null` when unavailable |
| `theme` | Theme shown in the capture, or `not-applicable` for world captures |
| `method` | The real capture method and tool |
| `privacyReview` | Reviewer label and pass or exclusion result, without private details |
| `capturedAt` | Timestamp and timezone copied only from a validated capture receipt; otherwise `null` |

Original captures stay unchanged. Review image pixels, captions, metadata, and filenames before publication. Never include private source details, machine paths, account data, credentials, or unrelated screen content. A withheld image is recorded with a public-safe reason that does not repeat the sensitive content.

## Present inventory

The gallery source and latest verified hosted manifest contain four construction images: a forest ascent overview, supported summit aircraft stairs, a partial daytime summit approach, and a short night-lit trailhead segment. The two new route images are original Edit-mode captures labeled as unfinished progress; they prove neither final realism nor Play behavior, complete traversal, collision, or full-route night continuity. Their original bytes, source revisions, privacy reviews, rights reviews, and metadata reviews are recorded individually under `records/`. [The latest publication receipt](live-publication-004.json) confirms public HTTP delivery and hash agreement for all four images. A cave image remains withheld pending complete pixel, metadata, caption, and rights review. The owner authorized public use of both supplied door types, but that permission alone does not establish that this specific image is ready. The gallery does not claim the withheld image is available.

## Interface verification

Browser captures under `ui/` document an earlier gallery revision's responsive layout and interaction states. They are not game-world evidence and do not add records to the gallery inventory. The responsive report binds each image to its source revision and includes viewport measurements, accessibility-tree checks, and resource results. The publication receipt binds direct HTTP delivery to its named revision; it does not prove current browser interaction or later image delivery without a fresh check.

## Adding a reviewed batch

Use `node scripts/add-reviewed-capture.mjs --image <original-image> --receipt <validated-receipt.json>` for final-review captures. For accepted Edit-mode construction records, use `node scripts/add-reviewed-capture.mjs --image <original-image> --construction-record <review-record.json>`. The construction record requires explicit limitations, privacy review, rights review, source revision, original file hash, and source dimensions. Its manifest entry has `receiptValidated: false` and cannot be mistaken for final evidence. The utility copies original bytes without image editing and rejects diagnostic class names, failed reviews, duplicate capture IDs, unsupported formats, invalid dates, and unsafe paths. It never guesses a timestamp. Inspect image pixels and metadata before invoking it; the utility cannot judge whether the content is safe or realistic.

After an image is included, inspect the source page behavior and state every remaining feature or verification gap. After publication, verify unauthenticated page access and every image URL independently from its source checkpoint. Dates come from validated receipts, never filenames or local file timestamps.
