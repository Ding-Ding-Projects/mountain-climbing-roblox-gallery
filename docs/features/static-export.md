# Static gallery build entrypoints

`build.bat` is the canonical local build entrypoint. It uses the operating system's Windows PowerShell 5.1 component and one checked-in `scripts/build.manifest.json`; no third-party runtime or privileged toolchain is required. A missing operating-system component is an explicit unsupported-host failure, not a guessed fresh-host success. The entrypoint uses only a per-process execution-policy choice and changes no persistent security, power or login setting.

The supported package is a byte-preserved static export of `docs/`, the existing GitHub Pages source. Inputs are constrained to declared extensions and exact required entrypoints, modules and inventory. Reparse points and path escape are rejected. Every original image hash and inventory count is checked before export; every copied file is read back; source and manifest are checked again before completion. Git checkouts require actual Git CLI status/revision/tree proof and a clean source. Genuine source archives instead record null revision and `source-archive-unverified-history`; they never claim commit or fresh-host proof.

Output is ignored `dist/gallery`. A receipt records the exact source revision/tree when known, content/manifest hashes, file and image counts and per-file readback. Existing output without an owned receipt is retained and stops replacement. Prior owned output is moved to a unique retained directory, preserving bytes; no recursive deletion occurs. An exclusive build lock prevents two writers from replacing the export concurrently.

Use `/s`, `--silent` or `SILENT=1` for no prompts. Explicit `/run`, `--run` and `RUN_AFTER_BUILD=1` are supported; the verified export is served by a hidden task-owned loopback TCP listener on an operating-system-assigned port, with a 30-minute limit. It accepts bounded GET/HEAD requests, serves only receipt-listed files, rechecks their hashes, preserves JavaScript MIME for modules and writes no request logs. The preview is local and is not a deployment. No preview starts from a silent build without explicit run selection.

`build-installer.bat` invokes the same manifest/helper route and returns exit 2 with NOT_APPLICABLE. The gallery has no installed application target or Squirrel payload; no fake installer, signing material or release is created. Exit 1 means a real build failure, 3 means the operating-system runtime is unavailable, and 64 means unsupported arguments. Wrappers preserve the child's exit status.

## Verification state

Source parsing passed. Exact-root build execution and independent output/receipt readback are pending the clean source checkpoint. No fresh-machine or preview-launch run is claimed yet. Tests and runtime checks elsewhere in this repository remain separate from this package-producing route; no workflow, host setting or image approval changes were made.
