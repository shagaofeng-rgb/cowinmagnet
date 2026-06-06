param(
  [int]$Port = 8130,
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()

$pdfJsDir = Join-Path $Root ".data\pdf-tools"
$outRoot = Join-Path $Root "docs\brochure\source-pages"
New-Item -ItemType Directory -Force -Path $outRoot | Out-Null

function Write-Bytes($Response, [byte[]]$Bytes, [string]$ContentType) {
  $Response.ContentType = $ContentType
  $Response.ContentLength64 = $Bytes.Length
  $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
  $Response.OutputStream.Close()
}

function Safe-Name([string]$Name) {
  return (($Name -replace '[\\/:*?"<>|]', '_') -replace '\s+', '_')
}

function Decode-PathParam($Request, [string]$PlainName = "path", [string]$Base64Name = "fileb64") {
  $encoded = $Request.QueryString[$Base64Name]
  if (![string]::IsNullOrWhiteSpace($encoded)) {
    return [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encoded))
  }
  return $Request.QueryString[$PlainName]
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response

  try {
    $path = $request.Url.AbsolutePath

    if ($path -eq "/pdf.mjs" -or $path -eq "/pdf.worker.mjs") {
      $filePath = Join-Path $pdfJsDir ($path.TrimStart("/"))
      Write-Bytes $response ([System.IO.File]::ReadAllBytes($filePath)) "text/javascript; charset=utf-8"
      continue
    }

    if ($path -eq "/file") {
      $filePath = Decode-PathParam $request
      Write-Bytes $response ([System.IO.File]::ReadAllBytes($filePath)) "application/pdf"
      continue
    }

    if ($path -eq "/save-page" -and $request.HttpMethod -eq "POST") {
      $source = Decode-PathParam $request "source" "sourceb64"
      $page = "{0:D3}" -f [int]$request.QueryString["page"]
      $dir = Join-Path $outRoot (Safe-Name ([System.IO.Path]::GetFileName($source)))
      New-Item -ItemType Directory -Force -Path $dir | Out-Null
      $target = Join-Path $dir "page-$page.png"
      $fs = [System.IO.File]::Open($target, "Create")
      try { $request.InputStream.CopyTo($fs) } finally { $fs.Close() }
      Write-Bytes $response ([System.Text.Encoding]::UTF8.GetBytes("saved")) "text/plain; charset=utf-8"
      continue
    }

    if ($path -eq "/viewer") {
      $file = Decode-PathParam $request "file" "fileb64"
      $fileb64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($file))
      $start = [int]$request.QueryString["start"]
      $end = [int]$request.QueryString["end"]
      if ($start -le 0) { $start = 1 }
      if ($end -le 0) { $end = $start }

      $html = @"
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 20px; background: #f5f7f8; color: #123; font-family: Arial, sans-serif; }
    canvas { display: block; margin: 12px 0; background: white; box-shadow: 0 1px 8px #0002; }
    .err { color: #b00020; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div id="status">loading</div>
  <script type="module">
    import * as pdfjsLib from '/pdf.mjs';
    const status = document.getElementById('status');
    const fileb64 = $(ConvertTo-Json $fileb64);
    const start = $start;
    const end = $end;
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
      const ab = await fetch('/file?fileb64=' + encodeURIComponent(fileb64)).then(r => {
        if (!r.ok) throw new Error('fetch pdf ' + r.status);
        return r.arrayBuffer();
      });
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab), disableWorker: true }).promise;
      const realEnd = Math.min(end, pdf.numPages);
      for (let i = start; i <= realEnd; i++) {
        status.textContent = 'rendering ' + i + '/' + realEnd;
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.35 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d', { alpha: false });
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        await fetch('/save-page?sourceb64=' + encodeURIComponent(fileb64) + '&page=' + i, { method: 'POST', body: blob });
      }
      status.textContent = 'done ' + start + '-' + realEnd;
    } catch (err) {
      status.innerHTML = '<span class="err">error: ' + String(err && err.stack || err) + '</span>';
    }
  </script>
</body>
</html>
"@
      Write-Bytes $response ([System.Text.Encoding]::UTF8.GetBytes($html)) "text/html; charset=utf-8"
      continue
    }

    Write-Bytes $response ([System.Text.Encoding]::UTF8.GetBytes("ok")) "text/plain; charset=utf-8"
  } catch {
    $response.StatusCode = 500
    Write-Bytes $response ([System.Text.Encoding]::UTF8.GetBytes($_.Exception.ToString())) "text/plain; charset=utf-8"
  }
}
