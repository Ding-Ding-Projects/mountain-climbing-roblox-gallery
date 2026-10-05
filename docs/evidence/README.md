# Evidence and capture provenance

The source candidate contains 423 distinct original images: 19 retained construction records and 404 reviewed historical observations, including 2 project-interface images. Review covered 434 source files and 424 distinct byte hashes; ten exact duplicate files are represented once. 1 images remain separately accounted for. Original image bytes total 117,016,058. Public delivery of this expanded candidate is unverified.

## Record categories

| Category | Claim | Admission route |
|---|---|---|
| Construction progress | Bounded appearance with existing source/context proof; never final acceptance | `scripts/add-reviewed-capture.mjs --construction-record` |
| Historical observation | Reviewed historical image, no invented source or date and no final acceptance claim | `scripts/add-reviewed-observation.mjs --review-record` |
| Project interface observation | Reviewed project documentation/interface image, not native Roblox scene evidence | Historical route with `evidenceSubject: "Project interface"` and `captureMode: "Unknown"` |
| Final review | Only a validated formal acceptance receipt | Existing `scripts/add-reviewed-capture.mjs --receipt` route; no new historical image uses it |

## Original-byte and privacy boundary

Each retained image has SHA-256, dimensions and an independent full-original pixel review. Metadata, generated public filename, title, caption, alternate text, rights and authorization are also reviewed. The current owner authorized genuine project captures, including ordinary test-avatar pixels and in-scene test labels. This permission does not authorize unrelated account chrome, credentials, private paths, private wording or other applications' personal content.

Historical images retain null capture timestamps and scale. The image's dimensions are known from its bytes. Source revision is null unless an independent hash-bound record establishes it; recorded source scope must remain explicit. A preservation revision is not the revision that made an old capture. Filenames, file timestamps and camera preparation clocks never supply missing capture dates.

Owner-report project views are eligible after pixel and metadata review. Their origin remains owner-reported and their acquisition route, source and time remain unavailable. Unknown provenance is visible, never replaced with a stronger native acceptance claim. Raw unrelated references and uncleared account surfaces stay withheld. Exclusion rows name a content hash and safe reason without repeating private information.

## Adding a reviewed observation

```sh
node scripts/add-reviewed-observation.mjs --image <original-image> --review-record <observation-review.json>
```

The closed `observation-review-record` schema requires review of the actual original, safe metadata, rights basis, dimensions, byte count, exact image hash and explicit non-acceptance limitations. `sourceRevision` may be null; capture date and scale remain null. The importer validates JPEG/PNG dimensions, preserves bytes, prevents hash or identifier duplicates and atomically replaces the manifest. It rejects extra private fields, missing review, invented dates, malformed revisions and attempts to promote observation to formal acceptance. It cannot inspect pixels or prove permission; the real reviewer must do that before invocation.

The browser uses the same `observation-contract.mjs` admission function, verifies image SHA-256 before rendering and shows historical or project-interface badges separately from construction progress. The full-size original is linked in provenance details. Hash verification runs with at most six requests in flight; it retains original manifest ordering.

## Existing strict construction route

The original Edit, scene-placed Play and background HWND admission remains unchanged. Background construction records require exact snapshot/byte/version and bounded UTC acquisition context, PNG dimensions and an explicit limit stating that the record is not a formal headless UI acceptance receipt. Historical admission does not relax these requirements.

Four retained hotel Edit records now explicitly state that they are not final realism evidence or Play mode proof. Their original images and source identities are unchanged. This repairs their admission wording so the strict browser route can display them.

## Verification boundaries

Run `node tests/observation-admission.mjs`, `node tests/gallery-inventory.mjs` and `node tests/background-admission.mjs docs/evidence/images/hotel-reception-edit205-001.png`. The inventory check evaluates the page's actual source admission function for every image, compares original hashes and tests negative review/time mutations. This verifies source admission and bytes, not a live browser rendering.

Previous receipts `live-publication-*.json` and `ui/responsive-layout.json` retain the revision and image count they actually measured. A new deployment needs unauthenticated HTTP checks for the page, manifest, shared admission module and every original image, with exact byte hashes and dimensions. HTTP success alone does not prove browser layout or controls. No date or publication claim is inferred from old receipts.
