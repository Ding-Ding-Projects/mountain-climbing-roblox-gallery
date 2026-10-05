# Gallery handoff

## Current source candidate

The candidate contains **435 distinct original images totaling 121,821,159 bytes**. It preserves all 424 originals in the verified public baseline at `43655e9a5dc66ca6731cfb965d00c405d0877c65`, plus four earlier before-rebuild observations and seven new Ridge View Rest / Forest Camp rebuild observations. All 435 image hashes are unique in the source manifest, and no image is excluded.

The seven new images were independently inspected as complete originals. Their paired closed review records match the original JPEG hashes and 1476 × 1080 dimensions. They are Edit-camera scene observations only:

- `ridge-rebuild-first-prototype-edit229-20261005` records a dark first prototype that was later rolled back for lighting and route refinement.
- `ridge-rebuild-lit-after-edit229-20261005` and `ridge-reception-lounge-after-edit229-20261005` show intermediate appearances before final sign-support refinement.
- `forest-east-detour-after-edit229-20261005` shows the bounded eastern route before final rail-end support refinement.
- `ridge-reception-final-edit229-20261005`, `ridge-hall-final-edit229-20261005`, and `forest-east-approach-final-edit229-20261005` show the latest saved Edit appearance after the bounded support refinements.

The source revisions are recorded per image in `docs/evidence/records/` and summarized in `docs/features/rebuild-observations.md`. Exact acquisition time, display scale, and theme remain unavailable. Paired one-second clock readings are context only. These images do not prove normal-input traversal, collision behavior, service operation, complete gameplay, or whole-place acceptance. Owner authorization covers these seven genuine scene-only captures and their reviewed content.

## Public state

The last verified public baseline remains 424 images / 118,029,333 image bytes at `43655e9a5dc66ca6731cfb965d00c405d0877c65`. Its receipt is `docs/evidence/live-publication-424-20261005.json`; hosting run `37367865389` succeeded. Workflow `37374105568` also succeeded for gallery source `4fdc7f9506969b1012ea08bcad7f1e4a8e8221ea`, which contains 428 images, not the current 435-image candidate. Neither run proves delivery of the seven new images.

The current candidate has not yet been rebuilt, integrated into main, published, or anonymously verified. No receipt exists for 435-image delivery. The broader browser audit remains incomplete: earlier bounded desktop and emulated-touch observations cover the 424-image revision only; strict audit completion and stronger capture promotion remain unavailable because the exact browser profile was retained.

## Changed files

- `docs/evidence/gallery.json` admits seven new closed historical-observation records while preserving the preceding 428 records.
- `docs/evidence/images/` contains the seven byte-preserved JPEG originals; `docs/evidence/records/` contains their seven public-safe review records.
- `docs/features/rebuild-observations.md` describes each scene, source revision, SHA-256, phase and limitation.
- `README.md`, `docs/features/README.md`, `docs/evidence/README.md`, and `ROADMAP.md` report the 435-image candidate and distinguish local admission from public verification.
- `HANDOFF.md` and `CLOSEOUT_PROMPT.md` carry the current handoff state.

## Verification and next work

The existing importer accepted each of the seven review records and checked each source file's exact SHA-256, byte count and dimensions before copying original bytes. All seven new hashes are distinct from each other and from the prior manifest hashes. The source candidate has 435 image files totaling 121,821,159 bytes. No test suite was run in this publication lane.

Next steps are to run the exact root `build.bat /s` on clean source, integrate the completed candidate into main, push main and prove the remote ref with `git ls-remote`, then verify anonymously that the live page and manifest deliver all 435 originals with exact hashes and decoded dimensions. A new delivery receipt and final public update must bind to the exact published source revision. Keep the gallery issue #1 and rolling progress Discussion #2 current. Do not claim browser, gameplay or whole-place acceptance from HTTP delivery.

The public Status Hub route is unavailable in this session; its authenticated tools are not exposed. Status Hub delivery remains unperformed. The exact private source mapping and raw capture storage remain outside this repository. Existing strict capture limits and the pending broader page-contract work remain open.
