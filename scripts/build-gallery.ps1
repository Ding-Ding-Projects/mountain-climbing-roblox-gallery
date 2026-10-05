$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd([IO.Path]::DirectorySeparatorChar)
$silent = $env:SILENT -eq '1'
$run = $env:RUN_AFTER_BUILD -eq '1'
$installer = $false
foreach ($argument in $args) {
    switch ($argument.ToLowerInvariant()) {
        '/s' { $silent = $true }
        '--silent' { $silent = $true }
        '/run' { $run = $true }
        '--run' { $run = $true }
        '--installer' { $installer = $true }
        '--help' { [Console]::WriteLine('Usage: build.bat [/s|--silent] [/run|--run]. SILENT=1 and RUN_AFTER_BUILD=1 are supported. build-installer.bat reports non-applicability with exit 2.'); exit 0 }
        default { [Console]::Error.WriteLine('ERROR: Unsupported build argument: {0}', $argument); exit 64 }
    }
}
function Hash-File([string] $File) { return (Get-FileHash -LiteralPath $File -Algorithm SHA256).Hash.ToLowerInvariant() }
function Assert-Contained([string] $Parent, [string] $Child) {
    $prefix = [IO.Path]::GetFullPath($Parent).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    $resolved = [IO.Path]::GetFullPath($Child)
    if (-not $resolved.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { throw 'Resolved build path escapes its declared parent.' }
    return $resolved
}
function Assert-PlainPath([string] $Path, [string] $Boundary) {
    $current = [IO.Path]::GetFullPath($Path)
    while ($current.Length -ge $Boundary.Length) {
        if (Test-Path -LiteralPath $current) {
            if ((Get-Item -LiteralPath $current -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Build inputs and outputs must not contain reparse points.' }
        }
        if ($current -eq $Boundary) { break }
        $current = [IO.Path]::GetDirectoryName($current)
    }
}
function Read-StaticFiles([string] $Directory, [string] $Base) {
    foreach ($item in @(Get-ChildItem -LiteralPath $Directory -Force | Sort-Object Name)) {
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Static source contains a reparse point.' }
        if ($item.PSIsContainer) { Read-StaticFiles $item.FullName $Base }
        else {
            $relative = $item.FullName.Substring($Base.Length + 1).Replace('\', '/')
            if ($manifest.allowedExtensions -notcontains $item.Extension.ToLowerInvariant()) { throw ('Undeclared static input extension: ' + $relative) }
            [pscustomobject]@{ path = $relative; bytes = $item.Length; sha256 = Hash-File $item.FullName }
        }
    }
}
function Read-SourceState {
    if (-not (Test-Path -LiteralPath (Join-Path $root '.git'))) { return [pscustomobject]@{ revision = $null; tree = $null; history = 'source-archive-unverified-history' } }
    $command = Get-Command git.exe -ErrorAction SilentlyContinue
    if (-not $command) { throw 'This checkout has .git but Git CLI is unavailable. Tracked-source status and revision cannot be validated; no archive fallback is permitted.' }
    $status = @(& $command.Source -C $root status --porcelain --untracked-files=normal)
    if ($LASTEXITCODE -ne 0) { throw 'Git CLI could not validate the source checkout.' }
    if ($status.Count -ne 0) { throw 'Build requires a clean tracked source: staged, unstaged or untracked changes are present.' }
    $revision = (& $command.Source -C $root rev-parse HEAD | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or $revision -notmatch '^[a-f0-9]{40,64}$') { throw 'Source commit cannot be validated.' }
    $tree = (& $command.Source -C $root rev-parse 'HEAD^{tree}' | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or $tree -notmatch '^[a-f0-9]{40,64}$') { throw 'Source tree cannot be validated.' }
    return [pscustomobject]@{ revision = $revision; tree = $tree; history = 'clean-git-checkout' }
}
$clock = [Diagnostics.Stopwatch]::StartNew()
try {
    if ($PSVersionTable.PSVersion -lt [Version]'5.1') { throw 'Windows PowerShell 5.1 or later is required by the operating-system static-export route.' }
    $manifestPath = Join-Path $PSScriptRoot 'build.manifest.json'
    $initialManifestHash = Hash-File $manifestPath
    $manifest = [IO.File]::ReadAllText($manifestPath) | ConvertFrom-Json
    if ($manifest.schemaVersion -ne 1 -or $manifest.projectType -ne 'static-gallery' -or $manifest.sourceDirectory -ne 'docs' -or $manifest.outputDirectory -ne 'dist/gallery' -or $manifest.receiptPath -ne 'dist/gallery-build.json') { throw 'Unsupported static build manifest.' }
    if ($installer) {
        if ($manifest.installer.applicable -ne $false -or $manifest.installer.exitCode -ne 2) { throw 'Installer non-applicability must be explicit in the static manifest.' }
        [Console]::Error.WriteLine('NOT_APPLICABLE: {0} No installer was produced.', $manifest.installer.reason)
        exit 2
    }
    [Console]::WriteLine('Runtime: built-in Windows PowerShell {0}; static export needs no downloaded compiler, SDK or runtime. No administrator action is required.', $PSVersionTable.PSVersion)
    $state = Read-SourceState
    if ($state.history -eq 'source-archive-unverified-history') { [Console]::WriteLine('Source archive: content-bound export only. Commit, history and fresh-host verification are unavailable.') }
    $source = Assert-Contained $root (Join-Path $root $manifest.sourceDirectory)
    $dist = Assert-Contained $root (Join-Path $root 'dist')
    $output = Assert-Contained $dist (Join-Path $root $manifest.outputDirectory)
    $receiptPath = Assert-Contained $dist (Join-Path $root $manifest.receiptPath)
    Assert-PlainPath $source $root
    Assert-PlainPath $dist $root
    if (-not (Test-Path -LiteralPath $source -PathType Container)) { throw 'Declared docs source directory is missing.' }
    $files = @(Read-StaticFiles $source $source)
    if ($files.Count -eq 0) { throw 'Declared static source is empty.' }
    $map = @{}
    foreach ($file in $files) { if ($map.ContainsKey($file.path)) { throw 'Static input paths collide.' }; $map[$file.path] = $file }
    foreach ($required in $manifest.requiredPaths) { if (-not $map.ContainsKey($required)) { throw ('Required static input missing: ' + $required) } }
    $gallery = [IO.File]::ReadAllText((Join-Path $source 'evidence/gallery.json')) | ConvertFrom-Json
    if ($gallery.schemaVersion -ne 1 -or @($gallery.images).Count -ne $gallery.inventoryReview.approvedDistinctImages) { throw 'Gallery inventory count is inconsistent.' }
    $hashes = @{}
    $imageBytes = [long]0
    foreach ($image in $gallery.images) {
        if ($image.path -notmatch '^images/[A-Za-z0-9][A-Za-z0-9._-]{1,127}\.(jpg|jpeg|png|webp)$') { throw 'Gallery image path is outside the approved static images directory.' }
        $key = 'evidence/' + $image.path
        if (-not $map.ContainsKey($key) -or $map[$key].sha256 -ne $image.sha256) { throw ('Gallery original SHA-256 mismatch: ' + $image.captureId) }
        if ($hashes.ContainsKey($image.sha256)) { throw 'Gallery original bytes are duplicated.' }
        $hashes[$image.sha256] = $true
        $imageBytes += $map[$key].bytes
    }
    if (-not (Test-Path -LiteralPath $dist)) { New-Item -ItemType Directory -Path $dist | Out-Null }
    $lockPath = Join-Path $dist 'gallery-build.lock'
    Assert-PlainPath $lockPath $root
    $lock = [IO.File]::Open($lockPath, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
    try {
        $staging = Assert-Contained $dist (Join-Path $dist ('gallery-staging-' + [Guid]::NewGuid().ToString('N')))
        New-Item -ItemType Directory -Path $staging | Out-Null
        foreach ($file in $files) {
            $target = Assert-Contained $staging (Join-Path $staging $file.path)
            New-Item -ItemType Directory -Force -Path ([IO.Path]::GetDirectoryName($target)) | Out-Null
            [IO.File]::Copy((Join-Path $source $file.path), $target, $false)
            if ((Get-Item -LiteralPath $target).Length -ne $file.bytes -or (Hash-File $target) -ne $file.sha256) { throw ('Export readback mismatch: ' + $file.path) }
            if ((Hash-File (Join-Path $source $file.path)) -ne $file.sha256) { throw ('Source changed during export: ' + $file.path) }
        }
        $after = Read-SourceState
        if ($after.revision -ne $state.revision -or $after.tree -ne $state.tree) { throw 'Source revision changed during export.' }
        $finalInputs = @(Read-StaticFiles $source $source)
        if ($finalInputs.Count -ne $files.Count) { throw 'Static source file inventory changed during export.' }
        foreach ($file in $finalInputs) { if (-not $map.ContainsKey($file.path) -or $map[$file.path].sha256 -ne $file.sha256 -or $map[$file.path].bytes -ne $file.bytes) { throw ('Static source changed during export: ' + $file.path) } }
        $manifestHash = Hash-File $manifestPath
        if ($manifestHash -ne $initialManifestHash) { throw 'The build manifest changed during export.' }
        $receipt = [ordered]@{ schemaVersion = 1; managedBy = 'mountain-climbing-static-export'; sourceRevision = $state.revision; sourceTree = $state.tree; sourceHistory = $state.history; freshHostVerified = $false; manifestSha256 = $manifestHash; sourceDirectory = 'docs'; outputDirectory = 'dist/gallery'; fileCount = $files.Count; imageCount = @($gallery.images).Count; imageBytes = $imageBytes; files = $files; copiedAndReadbackVerified = $true; installerProduced = $false }
        $json = ConvertTo-Json $receipt -Depth 8
        [IO.File]::WriteAllText((Join-Path $staging '.static-export-receipt.json'), $json, [Text.UTF8Encoding]::new($false))
        if (Test-Path -LiteralPath $output) {
            Assert-PlainPath $output $root
            $oldReceiptPath = Join-Path $output '.static-export-receipt.json'
            if (-not (Test-Path -LiteralPath $oldReceiptPath -PathType Leaf)) { throw 'Existing output has no owned export receipt; it is retained and will not be overwritten.' }
            $oldReceipt = [IO.File]::ReadAllText($oldReceiptPath) | ConvertFrom-Json
            if ($oldReceipt.managedBy -ne 'mountain-climbing-static-export' -or $oldReceipt.outputDirectory -ne 'dist/gallery') { throw 'Existing output ownership cannot be verified; it is retained.' }
            $retained = Assert-Contained $dist (Join-Path $dist ('gallery-retained-' + [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssZ') + '-' + [Guid]::NewGuid().ToString('N').Substring(0,8)))
            Move-Item -LiteralPath $output -Destination $retained
        }
        Move-Item -LiteralPath $staging -Destination $output
        [IO.File]::WriteAllText($receiptPath, $json, [Text.UTF8Encoding]::new($false))
        $readback = [IO.File]::ReadAllText($receiptPath) | ConvertFrom-Json
        if ($readback.managedBy -ne $receipt.managedBy -or $readback.fileCount -ne $files.Count -or $readback.imageCount -ne @($gallery.images).Count -or $readback.manifestSha256 -ne $manifestHash) { throw 'Final export receipt readback differs.' }
        foreach ($file in $files) { if ((Hash-File (Join-Path $output $file.path)) -ne $file.sha256) { throw ('Final export hash differs: ' + $file.path) } }
    } finally { $lock.Dispose() }
    [Console]::WriteLine('PASS static export: {0} files, {1} original images, {2} image bytes; every copied file hash read back.', $files.Count, @($gallery.images).Count, $imageBytes)
    [Console]::WriteLine('Output: dist/gallery. Receipt: dist/gallery-build.json (SHA-256 {0}). Source: {1}. Elapsed: {2:N3} seconds.', (Hash-File $receiptPath), $state.history, $clock.Elapsed.TotalSeconds)
    if (-not $silent -and -not $run) { $run = (Read-Host 'Open the verified loopback preview? [y/N]') -match '^(y|yes)$' }
    if ($run) {
        $ready = Assert-Contained $dist (Join-Path $dist ('preview-' + [Guid]::NewGuid().ToString('N') + '.json'))
        $previewScript = Join-Path $PSScriptRoot 'preview-gallery.ps1'
        $process = Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList @('-NoLogo','-NoProfile','-ExecutionPolicy','Bypass','-File',('"' + $previewScript + '"'),'-Root',('"' + $output + '"'),'-ReadyFile',('"' + $ready + '"')) -WindowStyle Hidden -PassThru
        $until = [DateTime]::UtcNow.AddSeconds(10)
        while (-not (Test-Path -LiteralPath $ready) -and [DateTime]::UtcNow -lt $until -and -not $process.HasExited) { Start-Sleep -Milliseconds 100 }
        if (-not (Test-Path -LiteralPath $ready)) { if (-not $process.HasExited) { $process.Kill() }; throw 'Task-owned loopback preview did not become ready within 10 seconds.' }
        $preview = [IO.File]::ReadAllText($ready) | ConvertFrom-Json
        if ($preview.url -notmatch '^http://127\.0\.0\.1:[0-9]+/$') { throw 'Preview did not return the approved loopback endpoint.' }
        Start-Process $preview.url
        [Console]::WriteLine('Preview opened on a task-owned loopback endpoint. It expires after 30 minutes; it is not a public deployment.')
    }
    exit 0
} catch {
    [Console]::Error.WriteLine('ERROR: Static gallery build did not complete: {0}', $_.Exception.Message)
    exit 1
}
