param(
  [string]$Root = (Get-Location).Path,
  [int]$ServerPort = 8130,
  [int]$CdpPort = 9223
)

$ErrorActionPreference = "Stop"

function Encode-PathB64([string]$Path) {
  return [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Path))
}

function Send-Cdp($WebSocket, [int]$Id, [string]$Method, $Params = $null) {
  $payload = @{ id = $Id; method = $Method }
  if ($null -ne $Params) { $payload.params = $Params }
  $json = $payload | ConvertTo-Json -Depth 20 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $segment = [ArraySegment[byte]]::new($bytes)
  $WebSocket.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()
}

function Receive-Cdp($WebSocket, [int]$Id, [int]$TimeoutSeconds = 30) {
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  $buffer = New-Object byte[] 1048576
  while ((Get-Date) -lt $deadline) {
    $stream = New-Object System.IO.MemoryStream
    do {
      $segment = [ArraySegment[byte]]::new($buffer)
      $result = $WebSocket.ReceiveAsync($segment, [System.Threading.CancellationToken]::None).Result
      if ($result.Count -gt 0) {
        $stream.Write($buffer, 0, $result.Count)
      }
    } while (-not $result.EndOfMessage)

    $text = [System.Text.Encoding]::UTF8.GetString($stream.ToArray())
    if ([string]::IsNullOrWhiteSpace($text)) { continue }
    $message = $text | ConvertFrom-Json
    if ($message.id -eq $Id) { return $message }
  }
  throw "Timed out waiting for CDP response id $Id"
}

function Invoke-Cdp($WebSocket, [ref]$NextId, [string]$Method, $Params = $null, [int]$TimeoutSeconds = 30) {
  $id = $NextId.Value
  $NextId.Value += 1
  Send-Cdp $WebSocket $id $Method $Params
  return Receive-Cdp $WebSocket $id $TimeoutSeconds
}

function Start-RenderServer {
  param([string]$Root, [int]$Port)
  try {
    $probe = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$Port/" -TimeoutSec 2
    if ($probe.Content -eq "ok") { return }
  } catch {}

  $serverScript = Join-Path $Root "scripts\pdf-render-server.ps1"
  Start-Process -FilePath powershell.exe -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $serverScript, "-Port", $Port, "-Root", $Root) -WindowStyle Hidden | Out-Null
  Start-Sleep -Seconds 2
  $probe = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$Port/" -TimeoutSec 10
  if ($probe.Content -ne "ok") { throw "Render server did not start." }
}

function U([int[]]$Codes) {
  return -join ($Codes | ForEach-Object { [char]$_ })
}

$desktop = U @(0x684C, 0x9762)
$brochureDir = U @(0x753B, 0x518C)
$base = "E:/$desktop/$brochureDir"
$qiyingPdf = U @(0x4F01, 0x8D62, 0x753B, 0x518C)
$yunhaiPdf = U @(0x4E91, 0x6D77, 0x5BA3, 0x4F20, 0x518C)
$xintuoPdf = U @(0x946B, 0x62D3, 0x7535, 0x5B50, 0x753B, 0x518C)

$jobs = @(
  @{ File = "$base/$qiyingPdf.pdf"; Start = 1; End = 6 },
  @{ File = "$base/2023 Qijin Magnet Brochure 7MB.pdf"; Start = 1; End = 8 },
  @{ File = "$base/MAGNETIC SEPARATION.compressed.pdf"; Start = 1; End = 10 },
  @{ File = "$base/MAGNETIC SEPARATION.compressed.pdf"; Start = 11; End = 20 },
  @{ File = "$base/$yunhaiPdf.pdf"; Start = 1; End = 10 },
  @{ File = "$base/$yunhaiPdf.pdf"; Start = 11; End = 20 },
  @{ File = "$base/$yunhaiPdf.pdf"; Start = 21; End = 30 },
  @{ File = "$base/$yunhaiPdf.pdf"; Start = 31; End = 40 },
  @{ File = "$base/$yunhaiPdf.pdf"; Start = 41; End = 50 },
  @{ File = "$base/$yunhaiPdf.pdf"; Start = 51; End = 60 },
  @{ File = "$base/$xintuoPdf.pdf"; Start = 1; End = 10 },
  @{ File = "$base/$xintuoPdf.pdf"; Start = 11; End = 20 },
  @{ File = "$base/$xintuoPdf.pdf"; Start = 21; End = 30 },
  @{ File = "$base/$xintuoPdf.pdf"; Start = 31; End = 40 },
  @{ File = "$base/$xintuoPdf.pdf"; Start = 41; End = 50 },
  @{ File = "$base/$xintuoPdf.pdf"; Start = 51; End = 60 }
)

Start-RenderServer -Root $Root -Port $ServerPort

$edgeCandidates = @(
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Google\Chrome\Application\chrome.exe"
)
$edge = $edgeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (!$edge) { throw "No Edge or Chrome executable found." }

$profile = Join-Path $Root ".data\edge-cdp-profile"
New-Item -ItemType Directory -Force -Path $profile | Out-Null

$edgeArgs = @(
  "--headless",
  "--disable-gpu",
  "--no-sandbox",
  "--remote-debugging-port=$CdpPort",
  "--user-data-dir=$profile",
  "about:blank"
)
$edgeProcess = Start-Process -FilePath $edge -ArgumentList $edgeArgs -PassThru -WindowStyle Hidden

try {
  $version = $null
  for ($i = 0; $i -lt 30; $i++) {
    try {
      $version = Invoke-RestMethod "http://127.0.0.1:$CdpPort/json/version" -TimeoutSec 2
      break
    } catch { Start-Sleep -Milliseconds 500 }
  }
  if (!$version) { throw "Could not connect to Edge CDP." }

  $tabs = Invoke-RestMethod "http://127.0.0.1:$CdpPort/json/list" -TimeoutSec 5
  $page = $tabs | Where-Object { $_.type -eq "page" } | Select-Object -First 1
  if (!$page) { throw "No CDP page target found." }

  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $ws.ConnectAsync([uri]$page.webSocketDebuggerUrl, [System.Threading.CancellationToken]::None).Wait()
  $nextId = [ref]1
  Invoke-Cdp $ws $nextId "Page.enable" | Out-Null
  Invoke-Cdp $ws $nextId "Runtime.enable" | Out-Null

  foreach ($job in $jobs) {
    $fileb64 = Encode-PathB64 $job.File
    $url = "http://127.0.0.1:$ServerPort/viewer?fileb64=$([uri]::EscapeDataString($fileb64))&start=$($job.Start)&end=$($job.End)"
    Invoke-Cdp $ws $nextId "Page.navigate" @{ url = $url } | Out-Null

    $done = $false
    $last = ""
    $deadline = (Get-Date).AddSeconds(240)
    while ((Get-Date) -lt $deadline) {
      Start-Sleep -Milliseconds 900
      $expr = "document.getElementById('status') ? document.getElementById('status').textContent : document.body.innerText"
      $res = Invoke-Cdp $ws $nextId "Runtime.evaluate" @{ expression = $expr; returnByValue = $true } 10
      $last = [string]$res.result.result.value
      if ($last -like "done *") { $done = $true; break }
      if ($last -like "error:*") { throw "Render error for $($job.File) $($job.Start)-$($job.End): $last" }
    }
    if (!$done) { throw "Timed out rendering $($job.File) $($job.Start)-$($job.End). Last status: $last" }
    Write-Output "Rendered $($job.File) pages $($job.Start)-$($job.End): $last"
  }

  $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", [System.Threading.CancellationToken]::None).Wait()
} finally {
  if ($edgeProcess -and -not $edgeProcess.HasExited) {
    Stop-Process -Id $edgeProcess.Id -Force
  }
}
