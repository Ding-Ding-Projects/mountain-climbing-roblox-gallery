# Reviewed historical observations

Historical captures are first-class gallery records with explicit limits. They show actual project scenes or project interfaces, including unfinished construction and diagnostic states. They do not prove present source behavior, realism or acceptance.

The original-byte admission route is `scripts/add-reviewed-observation.mjs`. Its closed schema is shared with the browser through `docs/evidence/observation-contract.mjs`. Full-original pixel, metadata, filename, authorization and rights review is required. Captured dimensions, byte count and hash must match the original. Unknown source revision and capture mode remain null and Unknown respectively; capture time and display scale remain null. A known source revision carries its exact scope.

The page renders historical-observation and project-interface badges separately from construction or final review. It displays unavailable provenance honestly, keeps search/facets record-derived and exposes the full original through provenance details. Every image is hash-verified with bounded six-request concurrency before display. Original manifest ordering survives asynchronous verification.

The importer rejects missing original review, extra context fields, unsupported dimensions, mismatched hashes, duplicate originals, invented times/scales, malformed source revisions and acceptance promotion. An interface image cannot be labeled as Roblox Play. A failed import rolls back its newly copied image and review record. Never retry by editing original pixels or inventing provenance.

Per-image review records are public-safe and omit original private paths and source files. The private full-source mapping stays outside the public repository. Public exclusion rows preserve a byte hash and safe reason. Current owner permission covers genuine project test-avatar and ordinary in-scene test labels; it does not cover account chrome, credentials or unrelated personal content.

`tests/observation-admission.mjs` deliberately breaks review and provenance boundaries before accepting the restored record. `tests/gallery-inventory.mjs` evaluates the actual browser admission function for every retained original and deliberately removes original-review proof or invents a date. Current live browser rendering and expanded public delivery require separate evidence.
