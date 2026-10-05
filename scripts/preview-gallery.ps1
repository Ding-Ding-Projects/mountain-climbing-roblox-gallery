param([Parameter(Mandatory=$true)][string]$Root, [Parameter(Mandatory=$true)][string]$ReadyFile)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2
$Root = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar)
$receipt = [IO.File]::ReadAllText((Join-Path $Root '.static-export-receipt.json')) | ConvertFrom-Json
if ($receipt.managedBy -ne 'mountain-climbing-static-export' -or $receipt.copiedAndReadbackVerified -ne $true) { throw 'Preview requires a verified owned static export.' }
$files = @{}
foreach ($file in $receipt.files) { $files[$file.path] = $file }
$types = @{ '.html'='text/html; charset=utf-8'; '.json'='application/json'; '.mjs'='text/javascript'; '.js'='text/javascript'; '.css'='text/css'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp'; '.svg'='image/svg+xml'; '.md'='text/plain; charset=utf-8'; '.txt'='text/plain; charset=utf-8'; '.woff'='font/woff'; '.woff2'='font/woff2' }
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 0)
$listener.Start()
$port = $listener.LocalEndpoint.Port
$state = @{ url = ('http://127.0.0.1:' + $port + '/'); pid = $PID; expiresAfterSeconds = 1800; sourceRevision = $receipt.sourceRevision; publicDeployment = $false }
[IO.File]::WriteAllText($ReadyFile, (ConvertTo-Json $state), [Text.UTF8Encoding]::new($false))
$clock = [Diagnostics.Stopwatch]::StartNew()
try {
    while ($clock.Elapsed.TotalSeconds -lt 1800) {
        if (-not $listener.Pending()) { Start-Sleep -Milliseconds 50; continue }
        $client = $listener.AcceptTcpClient()
        $client.ReceiveTimeout = 3000
        $client.SendTimeout = 5000
        $stream = $client.GetStream()
        $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 4096, $true)
        $fileStream = $null
        try {
            $request = $reader.ReadLine()
            $headerBytes = 0
            do { $line = $reader.ReadLine(); if ($null -eq $line) { break }; $headerBytes += $line.Length; if ($headerBytes -gt 8192) { throw 'Request headers exceed the local preview bound.' } } while ($line.Length -ne 0)
            $status = '404 Not Found'; $length = 0; $type = 'text/plain'; $head = $false
            if ($request -match '^(GET|HEAD) ([^ ]+) HTTP/1\.[01]$') {
                $head = $Matches[1] -eq 'HEAD'
                $target = [Uri]::UnescapeDataString(($Matches[2] -split '\?')[0]).TrimStart('/')
                if (-not $target) { $target = 'index.html' }
                if ($files.ContainsKey($target)) {
                    $path = [IO.Path]::GetFullPath((Join-Path $Root $target))
                    if (-not $path.StartsWith($Root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Preview request escapes the verified export.' }
                    $cursor = $path
                    while ($cursor.Length -ge $Root.Length) { if ((Get-Item -LiteralPath $cursor -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Preview reparse points are unsupported.' }; if ($cursor -eq $Root) { break }; $cursor = [IO.Path]::GetDirectoryName($cursor) }
                    $fileStream = [IO.File]::Open($path, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::Read)
                    $sha = [Security.Cryptography.SHA256]::Create()
                    try { $actual = ([BitConverter]::ToString($sha.ComputeHash($fileStream))).Replace('-','').ToLowerInvariant() } finally { $sha.Dispose() }
                    if ($actual -ne $files[$target].sha256 -or $fileStream.Length -ne $files[$target].bytes) { throw 'Preview input differs from its verified build receipt.' }
                    $fileStream.Position = 0
                    $status = '200 OK'; $length = $fileStream.Length
                    $extension = [IO.Path]::GetExtension($target).ToLowerInvariant()
                    if ($types.ContainsKey($extension)) { $type = $types[$extension] }
                }
            } else { $status = '405 Method Not Allowed' }
            $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $length`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n")
            $stream.Write($header, 0, $header.Length)
            if ($fileStream -and -not $head) { $fileStream.CopyTo($stream, 65536) }
        } catch {
            try { $response = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 400 Bad Request`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"); $stream.Write($response, 0, $response.Length) } catch {}
        } finally { if ($fileStream) { $fileStream.Dispose() }; $reader.Dispose(); $stream.Dispose(); $client.Close() }
    }
} finally { $listener.Stop() }
