param(
  [string]$Root = (Get-Location).Path,
  [int]$CdpPort = 9225
)

$ErrorActionPreference = "Stop"

function Send-Cdp($WebSocket, [int]$Id, [string]$Method, $Params = $null) {
  $payload = @{ id = $Id; method = $Method }
  if ($null -ne $Params) { $payload.params = $Params }
  $json = $payload | ConvertTo-Json -Depth 20 -Compress
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $segment = [ArraySegment[byte]]::new($bytes)
  $WebSocket.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()
}

function Receive-Cdp($WebSocket, [int]$Id, [int]$TimeoutSeconds = 60) {
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  $buffer = New-Object byte[] 2097152
  while ((Get-Date) -lt $deadline) {
    $stream = New-Object System.IO.MemoryStream
    do {
      $segment = [ArraySegment[byte]]::new($buffer)
      $result = $WebSocket.ReceiveAsync($segment, [System.Threading.CancellationToken]::None).Result
      if ($result.Count -gt 0) { $stream.Write($buffer, 0, $result.Count) }
    } while (-not $result.EndOfMessage)

    $text = [System.Text.Encoding]::UTF8.GetString($stream.ToArray())
    if ([string]::IsNullOrWhiteSpace($text)) { continue }
    $message = $text | ConvertFrom-Json
    if ($message.id -eq $Id) { return $message }
  }
  throw "Timed out waiting for CDP response id $Id"
}

function Invoke-Cdp($WebSocket, [ref]$NextId, [string]$Method, $Params = $null, [int]$TimeoutSeconds = 60) {
  $id = $NextId.Value
  $NextId.Value += 1
  Send-Cdp $WebSocket $id $Method $Params
  return Receive-Cdp $WebSocket $id $TimeoutSeconds
}

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (!(Test-Path $chrome)) { throw "Chrome not found." }

$profileRoot = Join-Path $Root ".data\chrome-profile-copy"
$outDir = Join-Path $Root ".data\lead-sheets-auth"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$ids = @(
  "1IeqivQ1Xx5Te0_oNfm4qfEMO0vrxK8fbcC55ngjZW4w",
  "17bhNfSJmnTuGNkxytApUEAPIM9QOT3rYJhk2W656z6o",
  "1jNTs4dW_rr6kLm7sPQPDKfzeWUJo2o0zUYigSEg_Ttc",
  "1S6SE01GR2lCZWfx69xDaWf1mwINnFIyfN_YBCZtFu28"
)

$args = @(
  "--disable-gpu",
  "--no-sandbox",
  "--remote-debugging-port=$CdpPort",
  "--user-data-dir=$profileRoot",
  "--profile-directory=Profile 1",
  "https://docs.google.com/spreadsheets/u/0/"
)
$proc = Start-Process -FilePath $chrome -ArgumentList $args -PassThru -WindowStyle Hidden

try {
  $version = $null
  for ($i = 0; $i -lt 40; $i++) {
    try {
      $version = Invoke-RestMethod "http://127.0.0.1:$CdpPort/json/version" -TimeoutSec 2
      break
    } catch { Start-Sleep -Milliseconds 500 }
  }
  if (!$version) { throw "Could not connect to Chrome CDP." }

  $tabs = Invoke-RestMethod "http://127.0.0.1:$CdpPort/json/list" -TimeoutSec 5
  $page = $tabs | Where-Object { $_.type -eq "page" } | Select-Object -First 1
  if (!$page) { throw "No CDP page target found." }

  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $ws.ConnectAsync([uri]$page.webSocketDebuggerUrl, [System.Threading.CancellationToken]::None).Wait()
  $nextId = [ref]1
  Invoke-Cdp $ws $nextId "Runtime.enable" | Out-Null
  Invoke-Cdp $ws $nextId "Page.enable" | Out-Null
  Start-Sleep -Seconds 5

  $results = @()
  foreach ($id in $ids) {
    $csvUrl = "https://docs.google.com/spreadsheets/d/$id/export?format=csv&gid=0"
    $expr = @"
(async () => {
  const res = await fetch('$csvUrl', { credentials: 'include' });
  const text = await res.text();
  return JSON.stringify({ status: res.status, url: res.url, text });
})()
"@
    $response = Invoke-Cdp $ws $nextId "Runtime.evaluate" @{ expression = $expr; awaitPromise = $true; returnByValue = $true } 120
    $json = $response.result.result.value | ConvertFrom-Json
    $safe = $id + ".csv"
    $path = Join-Path $outDir $safe
    [System.IO.File]::WriteAllText($path, [string]$json.text, [System.Text.Encoding]::UTF8)
    $head = ([string]$json.text -split "`n" | Select-Object -First 3) -join " | "
    $results += [pscustomobject]@{ Id = $id; Status = $json.status; Bytes = ([System.Text.Encoding]::UTF8.GetByteCount([string]$json.text)); Path = $path; Head = $head }
  }

  $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", [System.Threading.CancellationToken]::None).Wait()
  $results | ConvertTo-Json -Depth 4
} finally {
  if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }
}
