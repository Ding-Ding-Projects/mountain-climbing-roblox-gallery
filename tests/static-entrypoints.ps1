$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2
$repository = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$scratch = Join-Path ([IO.Path]::GetTempPath()) ('static-gallery-entrypoints-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $scratch | Out-Null
$image = ([IO.File]::ReadAllText((Join-Path $repository 'docs/evidence/gallery.json')) | ConvertFrom-Json).images[0]
$fixtureManifest = [IO.File]::ReadAllText((Join-Path $repository 'scripts/build.manifest.json'))
function New-Fixture([string]$Name) {
    $target = Join-Path $scratch $Name
    New-Item -ItemType Directory -Path (Join-Path $target 'scripts') -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $target 'docs/evidence/images') -Force | Out-Null
    foreach ($file in @('build.bat','build-installer.bat','scripts/build-gallery.ps1','scripts/build.manifest.json','scripts/preview-gallery.ps1')) { Copy-Item -LiteralPath (Join-Path $repository $file) -Destination (Join-Path $target $file) }
    [IO.File]::WriteAllText((Join-Path $target 'docs/index.html'), '<!doctype html><title>Static export fixture</title>', [Text.UTF8Encoding]::new($false))
    foreach ($file in @('observation-contract.mjs','progressive-verification.mjs')) { Copy-Item -LiteralPath (Join-Path $repository ('docs/evidence/' + $file)) -Destination (Join-Path $target ('docs/evidence/' + $file)) }
    Copy-Item -LiteralPath (Join-Path $repository ('docs/evidence/' + $image.path)) -Destination (Join-Path $target ('docs/evidence/' + $image.path))
    $inventory = @{ schemaVersion=1; images=@($image); excluded=@(); inventoryReview=@{approvedDistinctImages=1} }
    [IO.File]::WriteAllText((Join-Path $target 'docs/evidence/gallery.json'), (ConvertTo-Json $inventory -Depth 12), [Text.UTF8Encoding]::new($false))
    return $target
}
function Run-Entry([string]$Working, [string]$Entry, [string]$Arguments, [int]$Expected, [bool]$SilentEnvironment=$false, [bool]$HideGit=$false) {
    $info = [Diagnostics.ProcessStartInfo]::new()
    $info.FileName = Join-Path $env:SystemRoot 'System32/cmd.exe'
    $info.Arguments = '/d /c ' + $Entry + ' ' + $Arguments
    $info.WorkingDirectory = $Working
    $info.UseShellExecute = $false
    $info.CreateNoWindow = $true
    $info.RedirectStandardOutput = $true
    $info.RedirectStandardError = $true
    $info.EnvironmentVariables['SILENT'] = $(if ($SilentEnvironment) { '1' } else { '0' })
    $info.EnvironmentVariables['RUN_AFTER_BUILD'] = '0'
    if ($HideGit) { $info.EnvironmentVariables['PATH'] = (Join-Path $env:SystemRoot 'System32') }
    $process = [Diagnostics.Process]::Start($info)
    $stdout = $process.StandardOutput.ReadToEndAsync()
    $stderr = $process.StandardError.ReadToEndAsync()
    if (-not $process.WaitForExit(30000)) { $process.Kill(); throw 'Exact root fixture entrypoint exceeded its 30-second bound.' }
    $output = $stdout.GetAwaiter().GetResult() + $stderr.GetAwaiter().GetResult()
    if ($process.ExitCode -ne $Expected) { throw ('Exact root fixture exit mismatch: expected ' + $Expected + ', got ' + $process.ExitCode + '. ' + $output) }
    return $output
}
$cases = 0
$archive = New-Fixture 'archive'
Run-Entry $archive 'build.bat' '/s' 0 | Out-Null
$receipt = [IO.File]::ReadAllText((Join-Path $archive 'dist/gallery-build.json')) | ConvertFrom-Json
if ($null -ne $receipt.sourceRevision -or $receipt.sourceHistory -ne 'source-archive-unverified-history' -or $receipt.freshHostVerified -ne $false -or $receipt.imageCount -ne 1 -or $receipt.fileCount -ne 5) { throw 'Archive export must retain unavailable revision/history and exact content counts.' }
foreach ($file in $receipt.files) { if ((Get-FileHash -LiteralPath (Join-Path $archive ('dist/gallery/' + $file.path))).Hash.ToLowerInvariant() -ne $file.sha256) { throw 'Independent archive output hash differs.' } }
$cases++
Run-Entry $archive 'build.bat' '--unsupported' 64 | Out-Null; $cases++
$installer = Run-Entry $archive 'build-installer.bat' '/s' 2
if ($installer -notmatch 'NOT_APPLICABLE' -or $installer -notmatch 'No installer was produced') { throw 'Installer entrypoint must state exact non-applicability.' }; $cases++
$imagePath = Join-Path $archive ('docs/evidence/' + $image.path)
$originalBytes = [IO.File]::ReadAllBytes($imagePath)
$broken = [byte[]]$originalBytes.Clone(); $broken[0] = $broken[0] -bxor 1; [IO.File]::WriteAllBytes($imagePath, $broken)
Run-Entry $archive 'build.bat' '/s' 1 | Out-Null
[IO.File]::WriteAllBytes($imagePath, $originalBytes)
Run-Entry $archive 'build.bat' '--silent' 0 | Out-Null; $cases++
Run-Entry $archive 'build.bat' '' 0 $true | Out-Null; $cases++
$unowned = New-Fixture 'unowned-output'
New-Item -ItemType Directory -Path (Join-Path $unowned 'dist/gallery') -Force | Out-Null
$manual = Join-Path $unowned 'dist/gallery/manual.txt'; [IO.File]::WriteAllText($manual,'Retained fixture content')
Run-Entry $unowned 'build.bat' '/s' 1 | Out-Null
if ([IO.File]::ReadAllText($manual) -ne 'Retained fixture content') { throw 'Unowned output must remain unchanged.' }; $cases++
$checkout = New-Fixture 'unverifiable-checkout'
[IO.File]::WriteAllText((Join-Path $checkout '.git'),'gitdir: missing-fixture-directory')
$blocked = Run-Entry $checkout 'build.bat' '/s' 1 $false $true
if ($blocked -notmatch 'Git CLI is unavailable' -or $blocked -match 'PASS static export') { throw '.git presence with unavailable Git must not use archive fallback.' }; $cases++
$escape = New-Fixture 'manifest-escape'
$badManifest = $fixtureManifest | ConvertFrom-Json; $badManifest.outputDirectory = '../outside'
[IO.File]::WriteAllText((Join-Path $escape 'scripts/build.manifest.json'), (ConvertTo-Json $badManifest -Depth 8), [Text.UTF8Encoding]::new($false))
Run-Entry $escape 'build.bat' '/s' 1 | Out-Null; $cases++
[Console]::WriteLine('PASS static entrypoints: {0} cases through exact root wrappers; archive null provenance, output hashes, negative original mutation, silent aliases, non-applicable installer, unowned-output retention, unavailable Git and manifest containment.', $cases)
