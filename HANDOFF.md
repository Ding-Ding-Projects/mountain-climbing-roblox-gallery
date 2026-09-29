# Handoff

## Version 80 and Bakery progress, 2026-09-29

Version 80 recovery is recorded in the source project, and Bakery construction repairs have progressed. Roblox Studio Play startup, state read, and stop each timed out after 300 seconds. No new Bakery capture has been accepted for publication. This reports source progress only; visual review and native acceptance remain pending. The four existing reviewed gallery images are unchanged.

**廣東話：** Version 80 已記錄為源項目恢復，Bakery 施工修復亦有進展。Roblox Studio 的 Play 啟動、狀態讀取同停止操作，各自等待 300 秒後超時。暫無新 Bakery 圖片獲接納發布。以上只反映源碼進度；視覺檢視同原生項目驗收仍待完成。現有四張已審核畫廊圖片保持不變。

## Current state

### Additional route captures, 2026-09-28

Two original Roblox Studio MCP Edit-mode JPEGs were reviewed and added to the gallery source: `summit-approach-eye-005` and `trail-lantern-night-001`. Both are 1264×830 and retain their original bytes. Their source revisions are `c279302487145c124fff1c7cb98f192a902f4e8c` and `2e8c494fc82240625bcea843786dd7a1501c0712`; SHA-256 values are `e3df6d1a925093e5e36ba8add1f55f003bdb824670b970b5da88b1c2b6efd205` and `d82bf43847dc5699ab4511f26c7a68db537e1be08443bfcf913c9bd8eb867032`. Capture time, timezone, scale, and theme are unavailable or not applicable. Pixel and source review found no avatar, interface, private data, or identifiable supplied model. The captions limit the first image to a partial measured route section and the second to the first short night-lit segment; the second also discloses the foreground tree obstruction. Neither proves full traversal, complete night continuity, final realism, or Play behavior. Review records are in `docs/evidence/records/`; the images are in `docs/evidence/images/` and the manifest is `docs/evidence/gallery.json`.

Other inspected candidates were excluded: `summit-terrain-overview-001.jpg`, `summit-terrain-overview-002.jpg`, and `summit-terrain-west-003.jpg`, where broad coarse rock bands dominate; `summit-terrain-settled-009.jpg`, which shows a documented unresolved terrain defect; `summit-approach-night-006.jpg` and `summit-approach-night-007.jpg`, which are too dark and show obstructed route geometry; older lake views with a large rectangular water mass or visible generated rock assemblies; the forest camp view, which predates roof and foundation corrections; the summit lantern image with most of the right side blocked by nearby tree geometry; and Play captures that show an avatar, HUD, supplied door, or unresolved lighting. Trailhead captures with supplied doors or the previously rejected text-block sign were also excluded. These exclusions remain review records for this selection and are not gallery cards.

The public `main` at `08f3effa734a473e6114df847b8a6a17440de055` is deployed and serves the four-image manifest. Direct unauthenticated HTTP checks verified the page, manifest, and each image, with image hashes matching the manifest; `docs/evidence/live-publication-004.json` records the response details. The receipt binds those responses to deployed `main` at `08f3effa734a473e6114df847b8a6a17440de055`. Browser interaction, accessibility-tree review, responsive verification, and visual browser capture remain unverified.

The public gallery repository was empty at task start. A static gallery surface, design reference, evidence rules, and a hand-written completeness inventory have been added. Four images, forest ascent, supported summit aircraft stairs, partial summit approach, and a short night-lit trail segment, have been reviewed as Edit-mode construction progress with source revision and image SHA-256 provenance. None is final realism evidence or Play proof. A cave construction image remains withheld pending direct review of its pixels, metadata, caption, and distribution terms. The owner authorized both supplied door types, but that permission alone does not establish that this specific capture is ready for publication.

An earlier two-image public delivery was verified on 2026-09-28 at 18:58 UTC and is recorded in `docs/evidence/live-publication-002.json`; `docs/evidence/live-publication.json` retains the earlier one-image proof. The latest four-image verification is recorded separately in `docs/evidence/live-publication-004.json`. Public HTTP delivery does not complete the page contract or verify current browser interaction.

Gallery search source includes verified-record facets for capture type, location, and stage; plain-text-first filtering; an adjacent anchored JavaScript regex builder; invalid-pattern refusal; synchronized search and pattern input; and sample plus current-record match previews. Search controls and statuses have English, Cantonese, and bilingual copy. Focused interaction checks passed on source revision `9afe0b77b628eb04bab0dc17f43bdf6776cac6c4`. The responsive repair was then verified on `93abe3583cb61cb35438d3ec236835189ebf54d9` at 929×1004 and an emulated 320×800 touch viewport. The measured search widths were 560.92 CSS pixels and 292.81 CSS pixels respectively; facet widths were 261.91 pixels at desktop and 288.81 pixels at 320. Both viewports had no horizontal overflow, visible controls met the 44-pixel minimum, keyboard open/close restored focus, a touch filter worked, the accessibility tree had no unnamed interactive controls, and browser resource checks reported no exceptions, console errors, failed requests, or non-success responses. Original captures, hashes, and build identities are recorded in `docs/evidence/ui/responsive-layout.json`. The focused negative regression, screen-reader review, full page contract, and current hosted-browser interaction verification remain pending.

## Settings and command-palette search update

Settings and command-palette search are implemented in source revision `a79d053535cd10b0e679521395ee9e399f26639c` and delivered in the public HTML. That revision has not been rebuilt in the approved isolated browser route or recaptured.

The approved isolated browser route is unavailable in the current task environment. Current settings/palette interaction, accessibility tree, 320-pixel layout, and capture proof remain unverified. `docs/features/settings-search.md` describes the feature and its limits.

## Remaining work

1. Obtain further genuine Studio captures only when their pixels and distribution rights are reviewable; keep the cave capture withheld until its specific pixels, metadata, caption, and applicable terms have been reviewed.
2. Obtain a validated capture receipt for any capture intended to prove a final or runtime state. All four current images remain construction progress only.
3. Complete the mandatory page feature inventory and built-page verification without upgrading source-only work into evidence.
4. Complete current browser interaction, accessibility-tree, responsive layout, and visual capture checks through the approved isolated route. Keep the already verified public HTTP delivery distinct from those checks.

## Limits

No Material Designer creation or export tool was exposed in the available tools. The Status Hub client returned `MISSING_INGEST_TOKEN`, so no session record was written. The local design handoff records the design-tool limitation. The public page and four reviewed construction images are delivered; current browser runtime and final game-quality evidence remain unavailable.
