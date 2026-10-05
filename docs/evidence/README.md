# Evidence and capture provenance

The publicly verified baseline contains 424 distinct original images: 19 retained construction records and 405 reviewed historical observations, including 3 project-interface images. Review covered 434 source files and 424 distinct byte hashes; ten exact duplicate files are represented once. The current local candidate contains 435 distinct originals and 121,821,159 bytes, retaining that entire public baseline plus four before-rebuild images and seven Ridge View Rest / Forest Camp rebuild observations. The seven new images and closed review records are local to the candidate; their public delivery is unverified. The earlier anonymous HTTP receipt at `43655e9` verifies all 424 originals, both modules, the page and manifest. Bounded live desktop/emulated-touch observations passed; strict audit completion and capture promotion remain incomplete because the task profile was retained and stronger capture provenance is unavailable.

## Record categories

| Category | Claim | Admission route |
|---|---|---|
| Construction progress | Bounded appearance with existing source/context proof; never final acceptance | `scripts/add-reviewed-capture.mjs --construction-record` |
| Historical observation | Reviewed historical image, no invented source or date and no final acceptance claim | `scripts/add-reviewed-observation.mjs --review-record` |
| Project interface observation | Reviewed project documentation/interface image, not native Roblox scene evidence | Historical route with `evidenceSubject: "Project interface"` and `captureMode: "Unknown"` |
| Final review | Only a validated formal acceptance receipt | Existing `scripts/add-reviewed-capture.mjs --receipt` route; no new historical image uses it |

## Original-byte and privacy boundary

Each retained image has SHA-256, dimensions and an independent full-original pixel review. Metadata, generated public filename, title, caption, alternate text, rights and authorization are also reviewed. The current owner authorized genuine project captures, including ordinary test-avatar pixels and in-scene test labels. A separate explicit choice approved one exact full Studio/account-interface original, hash `7a981df7297812f6045b7398b3dc747ec4543fa65b7eb49d796773f9895061fb`, with visible account and collaborator controls. Its review record bounds that approval to this one original only. These permissions do not authorize any other or future account-interface capture, credentials, private paths, private wording or other applications' personal content.

Historical images retain null capture timestamps and scale. The image's dimensions are known from its bytes. Source revision is null unless an independent hash-bound record establishes it; recorded source scope must remain explicit. A preservation revision is not the revision that made an old capture. Filenames, file timestamps and camera preparation clocks never supply missing capture dates.

Owner-report project views are eligible after pixel and metadata review. Their origin remains owner-reported and their acquisition route, source and time remain unavailable. Unknown provenance is visible, never replaced with a stronger native acceptance claim. Raw unrelated references and uncleared account surfaces stay withheld. Exclusion rows name a content hash and safe reason without repeating private information.

## Adding a reviewed observation

```sh
node scripts/add-reviewed-observation.mjs --image <original-image> --review-record <observation-review.json>
```

The closed `observation-review-record` schema requires review of the actual original, safe metadata, rights basis, dimensions, byte count, exact image hash and explicit non-acceptance limitations. `sourceRevision` may be null; capture date and scale remain null. The importer validates JPEG/PNG dimensions, preserves bytes, prevents hash or identifier duplicates and atomically replaces the manifest. It rejects extra private fields, missing review, invented dates, malformed revisions and attempts to promote observation to formal acceptance. It cannot inspect pixels or prove permission; the real reviewer must do that before invocation.

The browser uses the same `observation-contract.mjs` admission function, verifies image SHA-256 before rendering and shows historical or project-interface badges separately from construction progress. The full-size original is linked in provenance details. Hash verification runs with at most six requests in flight; it retains original manifest ordering.

`progressive-verification.mjs` reports checked, verified, total and unavailable counts and displays the first verified original immediately. Later successes are batched at 100 ms or 24 images, with a final flush at completion. Background rendering inserts only newly verified cards and preserves existing card/facet nodes, active filters, search text and focus. Failed admission, HTTP or hash checks never enter a display batch. A partially loaded gallery can be browsed while the remaining originals are still being checked.

## Existing strict construction route

The original Edit, scene-placed Play and background HWND admission remains unchanged. Background construction records require exact snapshot/byte/version and bounded UTC acquisition context, PNG dimensions and an explicit limit stating that the record is not a formal headless UI acceptance receipt. Historical admission does not relax these requirements.

Four retained hotel Edit records now explicitly state that they are not final realism evidence or Play mode proof. Their original images and source identities are unchanged. This repairs their admission wording so the strict browser route can display them.

## Verification boundaries

Run `node tests/observation-admission.mjs`, `node tests/gallery-inventory.mjs`, `node tests/progressive-verification.mjs` and `node tests/background-admission.mjs docs/evidence/images/hotel-reception-edit205-001.png`. The inventory check evaluates the page's actual source admission function for every image, compares original hashes and tests negative review/time mutations. Fourteen progressive cases exercise delayed/rejected requests, first-success callbacks, batch/concurrency limits, completion counts and the actual page paint/facet functions through a source DOM model. This verifies source behavior and bytes, not a live browser rendering.

Previous receipts `live-publication-*.json` and `ui/responsive-layout.json` retain the revision and image count they actually measured. A new deployment needs unauthenticated HTTP checks for the page, manifest, shared admission module and every original image, with exact byte hashes and dimensions. HTTP success alone does not prove browser layout or controls. No date or publication claim is inferred from old receipts.

## Additional before-observation batch

The current source candidate adds eleven originals to the 424-image published baseline, preserving every earlier original. Candidate counts are 435 distinct images and 121,821,159 original bytes. The four before frames retain their unsettled-camera limits. Seven new rebuild observations show the rolled-back dark prototype, two intermediate views before final support refinements, and three latest saved Edit-camera views. Their native source revisions are recorded; exact acquisition instant, display scale and theme remain unavailable. Paired one-second clock readings are context only, never image timestamps. None establishes normal-input traversal or whole-place acceptance. Public delivery of the eleven additions is unverified. Six separate raw browser images remain private pending stronger promotion proof and are not part of the historical scene batch.
