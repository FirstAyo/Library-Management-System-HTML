Add-Type -AssemblyName System.Drawing
$taskBitmap = New-Object System.Drawing.Bitmap 1200,630
$taskGraphics = [System.Drawing.Graphics]::FromImage($taskBitmap)
$taskGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$taskGraphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$taskGraphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#142333'))
$taskCream = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#f5ecdb'))
$taskGold = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#d9bd8b'))
$taskMuted = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#b4c6bf'))
$taskLine = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#52695e')),2
$taskBrandFont = New-Object System.Drawing.Font 'Segoe UI',32,([System.Drawing.FontStyle]::Bold)
$taskTitleFont = New-Object System.Drawing.Font 'Georgia',48
$taskLabelFont = New-Object System.Drawing.Font 'Segoe UI',14
$taskGraphics.DrawRectangle($taskLine,38,38,1123,553)
$taskGraphics.DrawString('folio  /  LIBRARY',$taskBrandFont,$taskGold,80,70)
$taskGraphics.DrawString("A new chapter.`nA world of possibilities.",$taskTitleFont,$taskCream,(New-Object System.Drawing.RectangleF 78,200,1010,230))
$taskGraphics.DrawString('DISCOVER  /  BORROW  /  GROW',$taskLabelFont,$taskMuted,84,507)
$taskBitmap.Save((Join-Path $PSScriptRoot '../common/assets/social-card.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$taskGraphics.Dispose()
$taskBitmap.Dispose()
$taskCream.Dispose()
$taskGold.Dispose()
$taskMuted.Dispose()
$taskLine.Dispose()
$taskBrandFont.Dispose()
$taskTitleFont.Dispose()
$taskLabelFont.Dispose()
Write-Output 'Created 1200 x 630 social sharing image.'
