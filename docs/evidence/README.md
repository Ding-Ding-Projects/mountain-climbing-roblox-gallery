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

The current source candidate contains eleven construction images: four route and landscape views, three original historical facility views, and four new scene-placed Play-mode Bakery appearance views. The latest verified hosted manifest remains the seven-image revision. [Publication receipt 007](live-publication-007.json) records public HTTP 200 responses for the page, manifest, and those seven images, with every image SHA-256 matching at source revision `fcbb06c86738f3196340435cfe9b8deda8856494`. The four new Bakery images remain pending public delivery verification. They show only project-built side wall, roof, chimney, counter, bread, oven, and room signs; they do not establish physical entry, room circulation, collision, service operation, persistence, realism, or whole-facility acceptance. Their unchanged original bytes, source provenance, pixel and metadata reviews, rights basis, captions, and limitations are recorded in `gallery.json`. The three historical images do not depict the current Bakery pilot or establish acceptance of the pictured facilities. The earlier four-image receipt remains available as a historical delivery record. A cave image remains withheld pending complete pixel, metadata, caption, and rights review. Other images with an owner-review requirement, obsolete construction state, diagnostic blur, or no current per-image public-use qualification remain withheld.

## Interface verification

Browser captures under `ui/` document an earlier gallery revision's responsive layout and interaction states. They are not game-world evidence and do not add records to the gallery inventory. The responsive report binds each image to its source revision and includes viewport measurements, accessibility-tree checks, and resource results. The publication receipt binds direct HTTP delivery to its named revision; it does not prove current browser interaction or later image delivery without a fresh check.

## Adding a reviewed batch

Use `node scripts/add-reviewed-capture.mjs --image <original-image> --receipt <validated-receipt.json>` for final-review captures. For accepted Edit- or scene-placed Play-mode construction records, use `node scripts/add-reviewed-capture.mjs --image <original-image> --construction-record <review-record.json>`. Construction records require explicit limitations, privacy review, rights review, source revision, original file hash, and source dimensions. Edit-mode source paths are limited to approved repository evidence folders. Play-mode records require `sourcePath: null` and validated scene-only context, and cannot claim physical entry or whole-facility acceptance. Their manifest entry has `receiptValidated: false` and cannot be mistaken for final evidence. The utility copies original bytes without image editing and rejects diagnostic class names, failed reviews, duplicate capture IDs, unsupported formats, invalid dates, and unsafe paths. It never guesses a timestamp. Inspect image pixels and metadata before invoking it; the utility cannot judge whether the content is safe or realistic.

After an image is included, inspect the source page behavior and state every remaining feature or verification gap. After publication, verify unauthenticated page access and every image URL independently from its source checkpoint. Dates come from validated receipts, never filenames or local file timestamps.
