param(
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

function U([int[]]$Codes) {
  return -join ($Codes | ForEach-Object { [char]$_ })
}

function OleColor([int]$R, [int]$G, [int]$B) {
  return $R + ($G * 256) + ($B * 65536)
}

function Ensure-Dir([string]$Path) {
  New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

function Clean-PageImage([string]$Source, [string]$Target, [double]$TopRatio, [double]$BottomRatio, [double]$SideRatio) {
  Ensure-Dir ([System.IO.Path]::GetDirectoryName($Target))
  if (Test-Path $Target) { Remove-Item $Target -Force }

  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($Source)
  try {
    $bmp = New-Object System.Drawing.Bitmap $img.Width, $img.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $graphics.DrawImage($img, 0, 0, $img.Width, $img.Height)
      $white = [System.Drawing.Brushes]::White
      $top = [int]($img.Height * $TopRatio)
      $bottom = [int]($img.Height * $BottomRatio)
      $side = [int]($img.Width * $SideRatio)
      if ($top -gt 0) { $graphics.FillRectangle($white, 0, 0, $img.Width, $top) }
      if ($bottom -gt 0) { $graphics.FillRectangle($white, 0, $img.Height - $bottom, $img.Width, $bottom) }
      if ($side -gt 0) {
        $graphics.FillRectangle($white, 0, 0, $side, $img.Height)
        $graphics.FillRectangle($white, $img.Width - $side, 0, $side, $img.Height)
      }
      $bmp.Save($Target, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      if ($graphics) { $graphics.Dispose() }
      if ($bmp) { $bmp.Dispose() }
    }
  } finally {
    $img.Dispose()
  }
  return $Target
}

function Add-Text($Slide, [string]$Text, [double]$X, [double]$Y, [double]$W, [double]$H, [int]$Size, [int]$Color, [bool]$Bold = $false, [string]$Font = "Arial") {
  $shape = $Slide.Shapes.AddTextbox(1, $X, $Y, $W, $H)
  $shape.TextFrame.TextRange.Text = $Text
  $shape.TextFrame.TextRange.Font.Name = $Font
  $shape.TextFrame.TextRange.Font.Size = $Size
  $shape.TextFrame.TextRange.Font.Color.RGB = $Color
  $shape.TextFrame.TextRange.Font.Bold = $(if ($Bold) { -1 } else { 0 })
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  return $shape
}

function Add-Rect($Slide, [double]$X, [double]$Y, [double]$W, [double]$H, [int]$Fill, [int]$Line = $null) {
  $shape = $Slide.Shapes.AddShape(1, $X, $Y, $W, $H)
  $shape.Fill.ForeColor.RGB = $Fill
  if ($null -eq $Line) {
    $shape.Line.Visible = 0
  } else {
    $shape.Line.Visible = -1
    $shape.Line.ForeColor.RGB = $Line
  }
  return $shape
}

function Add-PictureFit($Slide, [string]$Path, [double]$X, [double]$Y, [double]$W, [double]$H) {
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($Path)
  try {
    $ratio = [Math]::Min($W / $img.Width, $H / $img.Height)
    $newW = $img.Width * $ratio
    $newH = $img.Height * $ratio
    $left = $X + (($W - $newW) / 2)
    $top = $Y + (($H - $newH) / 2)
    $pic = $Slide.Shapes.AddPicture($Path, 0, -1, $left, $top, $newW, $newH)
    return $pic
  } finally {
    $img.Dispose()
  }
}

function Add-HeaderFooter($Slide, [string]$Section, [int]$PageNo) {
  $blue = OleColor 9 52 93
  $orange = OleColor 239 112 42
  $white = OleColor 255 255 255
  Add-Rect $Slide 0 0 842 34 $blue | Out-Null
  Add-Rect $Slide 0 34 842 3 $orange | Out-Null
  Add-Text $Slide "Quzhou Qiying Import & Export Co., Ltd. | Cowinmagnet" 28 8 400 18 10 $white $true | Out-Null
  Add-Text $Slide $Section 540 8 280 18 10 $white $false | Out-Null
  Add-Rect $Slide 0 560 842 35 $blue | Out-Null
  Add-Text $Slide "www.cowinmagnet.com  |  cheryl@cowinmagnet.com" 28 570 360 16 9 $white $false | Out-Null
  Add-Text $Slide "Room 110, Building 1, Qushidai Future Building, Kecheng District, Quzhou, Zhejiang, China" 420 570 360 16 7 $white $false | Out-Null
  Add-Text $Slide ("P" + $PageNo.ToString("000")) 795 570 35 14 8 $white $false | Out-Null
}

function Add-SectionSlide($Presentation, [string]$Title, [string]$Subtitle, [string[]]$Items) {
  $slide = $Presentation.Slides.Add($Presentation.Slides.Count + 1, 12)
  $blue = OleColor 9 52 93
  $orange = OleColor 239 112 42
  $gray = OleColor 245 247 249
  Add-Rect $slide 0 0 842 595 $gray | Out-Null
  Add-Rect $slide 0 0 842 72 $blue | Out-Null
  Add-Rect $slide 0 72 842 5 $orange | Out-Null
  Add-Text $slide $Title 46 120 760 48 31 $blue $true | Out-Null
  Add-Text $slide $Subtitle 48 172 720 28 14 (OleColor 80 92 108) $false | Out-Null
  $y = 230
  foreach ($item in $Items) {
    Add-Rect $slide 54 ($y + 6) 8 8 $orange | Out-Null
    Add-Text $slide $item 78 $y 700 20 13 (OleColor 29 41 57) $false | Out-Null
    $y += 32
  }
  return $slide
}

function Add-SourcePage($Presentation, [string]$ImagePath, [string]$Section, [int]$PageNo) {
  $slide = $Presentation.Slides.Add($Presentation.Slides.Count + 1, 12)
  Add-Rect $slide 0 0 842 595 (OleColor 255 255 255) | Out-Null
  Add-PictureFit $slide $ImagePath 28 46 786 506 | Out-Null
  Add-HeaderFooter $slide $Section $PageNo
  return $slide
}

$sourceRoot = Join-Path $Root "docs\brochure\source-pages"
$cleanRoot = Join-Path $Root "docs\brochure\clean-pages"
$outDir = Join-Path $Root "docs\brochure"
Ensure-Dir $cleanRoot
Ensure-Dir $outDir

$qiyingDir = U @(0x4F01, 0x8D62, 0x753B, 0x518C)
$yunhaiDir = U @(0x4E91, 0x6D77, 0x5BA3, 0x4F20, 0x518C)
$xintuoDir = U @(0x946B, 0x62D3, 0x7535, 0x5B50, 0x753B, 0x518C)

$sections = @(
  @{
    Title = "Recycling & Non-Ferrous Separation"
    Subtitle = "Eddy current separation, stainless steel separation, drum magnets, grids, traps, rods, and drawer magnets."
    SourceDir = "2023_Qijin_Magnet_Brochure_7MB.pdf"
    Pages = 2..8
    Top = 0.10
    Bottom = 0.09
    Side = 0.028
    Items = @("Eccentric eddy current separator", "Stainless steel separator and drum magnet options", "Suspended permanent and electromagnetic overband magnets", "Magnetic rods, grids, traps, drawer magnets and hump magnets")
  },
  @{
    Title = "Magnetic Separation Equipment"
    Subtitle = "Wet drum, dry separation, high-intensity separation, permanent and electromagnetic product data sheets."
    SourceDir = "MAGNETIC_SEPARATION.compressed.pdf"
    Pages = 3..20
    Top = 0.16
    Bottom = 0.09
    Side = 0.03
    Items = @("Wet drum magnetic separators", "Dry powder and high-intensity magnetic separators", "Permanent and electromagnetic separators", "Technical specifications, diagrams and operating parameters")
  },
  @{
    Title = "Iron Removal Equipment"
    Subtitle = "Suspended, self-cleaning, pipeline, oil-cooled, air-cooled and permanent iron removal equipment."
    SourceDir = "$yunhaiDir.pdf"
    Pages = 4..56
    Top = 0.16
    Bottom = 0.095
    Side = 0.01
    Items = @("Selection guide and application notes", "Electromagnetic separators: RCDB, RCDD, RCDA, RCDC, RCDE, RCDF", "Permanent separators: RCYB, RCYD, RCYP, RCYK, RCYA, RCYF, RCYQ", "Drums, pulleys, dry/wet magnetic separators, metal detectors, feeders and screens")
  },
  @{
    Title = "Magnetic, Automation & Supporting Equipment"
    Subtitle = "Iron removal, magnetic separation, industrial automation, feeders, conveyors, dust collectors and supporting components."
    SourceDir = "$xintuoDir.pdf"
    Pages = 5..57
    Top = 0.13
    Bottom = 0.13
    Side = 0.01
    Items = @("RCYB, RCYD(C), RCYK and pipeline separators", "Electromagnetic separators and metal detectors", "Magnetic separation machinery and eddy current systems", "Feeders, conveyors, vibrating screens, lifters, dust collectors and accessories")
  }
)

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = -1
$pres = $ppt.Presentations.Add()
$pres.PageSetup.SlideWidth = 842
$pres.PageSetup.SlideHeight = 595

$blue = OleColor 9 52 93
$orange = OleColor 239 112 42
$dark = OleColor 25 35 48
$muted = OleColor 78 91 110
$white = OleColor 255 255 255

# Cover
$slide = $pres.Slides.Add(1, 12)
Add-Rect $slide 0 0 842 595 (OleColor 245 247 249) | Out-Null
$banner = Join-Path $Root "public\assets\magnetic-separator-banner.png"
if (Test-Path $banner) {
  Add-PictureFit $slide $banner 505 150 300 220 | Out-Null
}
Add-Rect $slide 0 0 842 78 $blue | Out-Null
Add-Rect $slide 0 78 842 6 $orange | Out-Null
Add-Text $slide "QUZHOU QIYING IMPORT & EXPORT CO., LTD." 42 28 620 24 17 $white $true | Out-Null
Add-Text $slide "COWINMAGNET PRODUCT CATALOG" 42 154 430 82 34 $blue $true | Out-Null
Add-Text $slide "Magnetic separation equipment solutions, product selection, OEM/ODM coordination, quality control, logistics and after-sales support." 44 250 390 70 16 $dark $false | Out-Null
Add-Rect $slide 44 340 270 3 $orange | Out-Null
Add-Text $slide "Permanent Magnetic Equipment | Electromagnetic Equipment | Magnetic Separation Equipment | Supporting Equipment & Components" 44 365 420 52 13 $muted $false | Out-Null
Add-Text $slide "www.cowinmagnet.com" 44 515 220 20 15 $blue $true | Out-Null

# Positioning
$slide = $pres.Slides.Add($pres.Slides.Count + 1, 12)
Add-Rect $slide 0 0 842 595 (OleColor 255 255 255) | Out-Null
Add-HeaderFooter $slide "Company Positioning" 2
Add-Text $slide "Built for buyers who need the right magnetic separation equipment without supplier confusion." 54 88 720 56 25 $blue $true | Out-Null
Add-Text $slide "Quzhou Qiying Import & Export Co., Ltd. is positioned as a professional foreign trade service company and magnetic separation equipment solution partner. We integrate supplier resources, support product selection, coordinate OEM/ODM requirements, follow quality control, arrange export logistics, and assist with after-sales communication." 58 172 745 72 15 $dark $false | Out-Null
$cols = @(
  @("Selection", "Match equipment type, belt width, material flow, particle size, working environment and separation target."),
  @("Customization", "Coordinate drawings, dimensions, voltage, installation mode, control cabinet and site-specific requirements."),
  @("Quality Control", "Follow product parameters, photos, inspection points, packing, labeling and shipment readiness."),
  @("Export Support", "Prepare international communication, documents, logistics coordination and after-sales response.")
)
$x = 58
foreach ($col in $cols) {
  Add-Rect $slide $x 305 176 112 (OleColor 242 246 248) (OleColor 218 226 232) | Out-Null
  Add-Text $slide $col[0] ($x + 14) 324 145 22 16 $blue $true | Out-Null
  Add-Text $slide $col[1] ($x + 14) 356 145 54 9 $muted $false | Out-Null
  $x += 194
}

# Catalog index
$slide = $pres.Slides.Add($pres.Slides.Count + 1, 12)
Add-Rect $slide 0 0 842 595 (OleColor 245 247 249) | Out-Null
Add-HeaderFooter $slide "Product Index" 3
Add-Text $slide "Product Families Integrated Into This Catalog" 54 86 720 34 26 $blue $true | Out-Null
$indexItems = @(
  "Recycling & non-ferrous separation: eddy current separators, stainless steel separators, magnetic rods, grids, traps and drawer magnets.",
  "Magnetic separation equipment: wet drum, dry powder, high-intensity, drum, pulley and mineral separation systems.",
  "Iron removal equipment: suspended permanent/electromagnetic separators, self-cleaning separators, pipeline separators and armored belt separators.",
  "Supporting equipment and components: feeders, vibrating screens, metal detectors, control cabinets, conveyors, dust collectors, crushers and accessories."
)
$y = 158
foreach ($item in $indexItems) {
  Add-Rect $slide 64 ($y + 7) 10 10 $orange | Out-Null
  Add-Text $slide $item 92 $y 690 34 14 $dark $false | Out-Null
  $y += 70
}

$pageNo = 4
foreach ($section in $sections) {
  Add-SectionSlide $pres $section.Title $section.Subtitle $section.Items | Out-Null
  $pageNo++
  foreach ($pageNum in $section.Pages) {
    $fileName = "page-{0:D3}.png" -f $pageNum
    $src = Join-Path (Join-Path $sourceRoot $section.SourceDir) $fileName
    if (!(Test-Path $src)) { continue }
    $clean = Join-Path (Join-Path $cleanRoot $section.SourceDir) $fileName
    $cleanPath = Clean-PageImage $src $clean $section.Top $section.Bottom $section.Side
    Add-SourcePage $pres $cleanPath $section.Title $pageNo | Out-Null
    $pageNo++
  }
}

$pptxPath = Join-Path $outDir "qiying_enriched_product_catalog.pptx"
$pdfPath = Join-Path $outDir "qiying_enriched_product_catalog.pdf"
if (Test-Path $pptxPath) { Remove-Item $pptxPath -Force }
if (Test-Path $pdfPath) { Remove-Item $pdfPath -Force }
$pres.SaveAs($pptxPath)
$pres.SaveAs($pdfPath, 32)
$pres.Close()
$ppt.Quit()

[System.Runtime.InteropServices.Marshal]::ReleaseComObject($pres) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null

Write-Output "Created $pptxPath"
Write-Output "Created $pdfPath"
