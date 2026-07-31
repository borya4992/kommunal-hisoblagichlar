Add-Type -AssemblyName System.Drawing

function New-PwaIcon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::FromArgb(255, 26, 31, 36))

  $brushPanel = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 42, 49, 56))
  $pad = [int]($size * 0.11)
  $side = $size - (2 * $pad)
  $g.FillRectangle($brushPanel, $pad, $pad, $side, $side)

  $lcd = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 183, 200, 154))
  $lx = [int]($size * 0.21)
  $ly = [int]($size * 0.29)
  $lw = [int]($size * 0.58)
  $lh = [int]($size * 0.27)
  $g.FillRectangle($lcd, $lx, $ly, $lw, $lh)

  $fontSize = [single]($size * 0.16)
  $font = New-Object System.Drawing.Font('Arial Black', $fontSize, [System.Drawing.FontStyle]::Bold)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 20, 26, 18))
  $rect = New-Object System.Drawing.RectangleF($lx, $ly, $lw, $lh)
  $g.DrawString('BMB', $font, $textBrush, $rect, $sf)

  $font2Size = [single]($size * 0.08)
  $font2 = New-Object System.Drawing.Font('Arial', $font2Size, [System.Drawing.FontStyle]::Bold)
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 232, 236, 239))
  $rect2 = New-Object System.Drawing.RectangleF(0, [single]($size * 0.62), $size, [single]($size * 0.12))
  $g.DrawString('EL92', $font2, $white, $rect2, $sf)

  $r = [int]($size * 0.028)
  $cy = [int]($size * 0.78)
  $orange = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 232, 163, 23))
  $green = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 45, 138, 110))
  $blue = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 42, 111, 158))
  $g.FillEllipse($orange, ([int]($size * 0.33) - $r), ($cy - $r), (2 * $r), (2 * $r))
  $g.FillEllipse($green, ([int]($size * 0.5) - $r), ($cy - $r), (2 * $r), (2 * $r))
  $g.FillEllipse($blue, ([int]($size * 0.67) - $r), ($cy - $r), (2 * $r), (2 * $r))

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

New-PwaIcon 192 'd:\проекты\komculate\public\pwa-192.png'
New-PwaIcon 512 'd:\проекты\komculate\public\pwa-512.png'
Write-Output 'icons ready'
