param(
  [string]$SiteUrl = "https://www.cowinmagnet.com",
  [string]$EnvFile = ".env.news-cron.local",
  [string]$LogFile = ".data/news-cron-invocations.log"
)

$ErrorActionPreference = "Stop"

function Read-EnvFile {
  param([string]$Path)
  $values = @{}
  if (-not (Test-Path -LiteralPath $Path)) {
    return $values
  }

  foreach ($line in Get-Content -LiteralPath $Path) {
    if ($line -match "^\s*#" -or $line -notmatch "=") {
      continue
    }
    $idx = $line.IndexOf("=")
    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim().Trim('"')
    if ($key) {
      $values[$key] = $value
    }
  }
  return $values
}

$envValues = Read-EnvFile -Path $EnvFile
$token = $envValues["NEWS_SYSTEM_ADMIN_TOKEN"]
if (-not $token) {
  $token = $envValues["CRON_SECRET"]
}
if (-not $token) {
  throw "NEWS_SYSTEM_ADMIN_TOKEN or CRON_SECRET is required in $EnvFile"
}

$logDir = Split-Path -Parent $LogFile
if ($logDir) {
  New-Item -ItemType Directory -Force -Path $logDir | Out-Null
}

$startedAt = (Get-Date).ToUniversalTime().ToString("o")
$uri = $SiteUrl.TrimEnd("/") + "/api/cron/news-automation"

try {
  $response = Invoke-WebRequest `
    -Uri $uri `
    -Method POST `
    -Headers @{ Authorization = "Bearer $token" } `
    -UseBasicParsing `
    -TimeoutSec 300

  $entry = [pscustomobject]@{
    startedAt = $startedAt
    finishedAt = (Get-Date).ToUniversalTime().ToString("o")
    statusCode = [int]$response.StatusCode
    ok = $true
    body = $response.Content
  }
  $entry | ConvertTo-Json -Compress | Add-Content -LiteralPath $LogFile -Encoding UTF8
  Write-Output $entry.body
} catch {
  $body = ""
  if ($_.Exception.Response) {
    try {
      $reader = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
      $body = $reader.ReadToEnd()
    } catch {}
  }

  $entry = [pscustomobject]@{
    startedAt = $startedAt
    finishedAt = (Get-Date).ToUniversalTime().ToString("o")
    statusCode = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { $null }
    ok = $false
    error = $_.Exception.Message
    body = $body
  }
  $entry | ConvertTo-Json -Compress | Add-Content -LiteralPath $LogFile -Encoding UTF8
  throw
}
