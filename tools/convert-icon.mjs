import {execSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pngPath = join(root, 'assets', 'codex-pink.png');
const icnsPath = join(root, 'assets', 'codex-pink.icns');
const icoPath = join(root, 'assets', 'codex-pink.ico');

export function ensurePng() {
  if (existsSync(pngPath)) return pngPath;
  if (existsSync(icnsPath)) {
    const buf = readFileSync(icnsPath);
    let offset = 8;
    while (offset < buf.length) {
      const tag = buf.subarray(offset, offset + 4).toString();
      const len = buf.readUInt32BE(offset + 4);
      const data = buf.subarray(offset + 8, offset + len);
      if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        if (tag === 'ic08' || tag === 'ic13') {
          writeFileSync(pngPath, data);
          return pngPath;
        }
      }
      offset += len;
    }
  }
  return null;
}

export function generateIco() {
  const png = ensurePng();
  if (!png) {
    throw new Error('Không tìm thấy tệp ảnh gốc PNG hoặc ICNS trong thư mục assets.');
  }

  if (process.platform === 'win32') {
    const psCmd = `
      Add-Type -AssemblyName System.Drawing
      $srcBmp = [System.Drawing.Bitmap]::FromFile('${png.replace(/'/g, "''")}')
      $sizes = @(256, 128, 64, 48, 32, 24, 16)
      $ms = New-Object System.IO.MemoryStream
      $bw = New-Object System.IO.BinaryWriter($ms)

      # ICO Header
      $bw.Write([uint16]0)
      $bw.Write([uint16]1)
      $bw.Write([uint16]$sizes.Length)

      $imageDataList = New-Object System.Collections.Generic.List[byte[]]

      foreach ($size in $sizes) {
          if ($size -eq 256) {
              $resized = New-Object System.Drawing.Bitmap(256, 256, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
              $g = [System.Drawing.Graphics]::FromImage($resized)
              $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
              $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
              $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
              $g.Clear([System.Drawing.Color]::Transparent)
              $g.DrawImage($srcBmp, 0, 0, 256, 256)
              $g.Dispose()

              $pngMs = New-Object System.IO.MemoryStream
              $resized.Save($pngMs, [System.Drawing.Imaging.ImageFormat]::Png)
              $resized.Dispose()
              $imageDataList.Add($pngMs.ToArray())
              $pngMs.Dispose()
          } else {
              $resized = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
              $g = [System.Drawing.Graphics]::FromImage($resized)
              $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
              $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
              $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
              $g.Clear([System.Drawing.Color]::Transparent)
              $g.DrawImage($srcBmp, 0, 0, $size, $size)
              $g.Dispose()

              $dibMs = New-Object System.IO.MemoryStream
              $dibBw = New-Object System.IO.BinaryWriter($dibMs)

              $andRowBytes = [int][Math]::Ceiling($size / 32.0) * 4
              $andMaskSize = $andRowBytes * $size
              $xorSize = $size * $size * 4

              # BITMAPINFOHEADER (40 bytes)
              $dibBw.Write([uint32]40)
              $dibBw.Write([int32]$size)
              $dibBw.Write([int32]($size * 2))
              $dibBw.Write([uint16]1)
              $dibBw.Write([uint16]32)
              $dibBw.Write([uint32]0)
              $dibBw.Write([uint32]($xorSize + $andMaskSize))
              $dibBw.Write([int32]0)
              $dibBw.Write([int32]0)
              $dibBw.Write([uint32]0)
              $dibBw.Write([uint32]0)

              $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
              $bmpData = $resized.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

              $pixelBytes = New-Object byte[]($xorSize)
              $andBytes = New-Object byte[]($andMaskSize)

              for ($y = $size - 1; $y -ge 0; $y--) {
                  $destRow = ($size - 1 - $y) * $size * 4
                  $srcRowPtr = [IntPtr]($bmpData.Scan0.ToInt64() + $y * $bmpData.Stride)
                  [System.Runtime.InteropServices.Marshal]::Copy($srcRowPtr, $pixelBytes, $destRow, $size * 4)

                  $andDestRow = ($size - 1 - $y) * $andRowBytes
                  for ($x = 0; $x -lt $size; $x++) {
                      $alpha = $pixelBytes[$destRow + $x * 4 + 3]
                      if ($alpha -lt 128) {
                          $byteIndex = $andDestRow + [int][Math]::Floor($x / 8.0)
                          $bitIndex = 7 - ($x % 8)
                          if ($byteIndex -ge 0 -and $byteIndex -lt $andBytes.Length) {
                              $andBytes[$byteIndex] = $andBytes[$byteIndex] -bor (1 -shl $bitIndex)
                          }
                      }
                  }
              }
              $resized.UnlockBits($bmpData)
              $resized.Dispose()

              $dibBw.Write($pixelBytes)
              $dibBw.Write($andBytes)
              $imageDataList.Add($dibMs.ToArray())
              $dibBw.Dispose()
              $dibMs.Dispose()
          }
      }

      $srcBmp.Dispose()

      # Offset starts after header (6 bytes) + directory entries (16 bytes * count)
      $offset = 6 + ($sizes.Length * 16)
      for ($i = 0; $i -lt $sizes.Length; $i++) {
          $size = $sizes[$i]
          $data = $imageDataList[$i]

          $bw.Write([byte]($size -eq 256 ? 0 : $size))
          $bw.Write([byte]($size -eq 256 ? 0 : $size))
          $bw.Write([byte]0)
          $bw.Write([byte]0)
          $bw.Write([uint16]1)
          $bw.Write([uint16]32)
          $bw.Write([uint32]$data.Length)
          $bw.Write([uint32]$offset)

          $offset += $data.Length
      }

      foreach ($data in $imageDataList) {
          $bw.Write($data)
      }

      [System.IO.File]::WriteAllBytes('${icoPath.replace(/'/g, "''")}', $ms.ToArray())
      $bw.Dispose()
      $ms.Dispose()

      # Thong bao cho Windows Shell lam moi icon
      try {
          $notifier = Add-Type -MemberDefinition @"
              [DllImport("shell32.dll")]
              public static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
"@ -Name "ShellNotifier_${Date.now()}" -Namespace "WinShell" -PassThru
          $notifier::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)
      } catch {}
    `;
    execSync(`powershell -NoProfile -Command "${psCmd.replace(/"/g, '`"')}"`, {stdio: 'inherit'});
    return true;
  }

  return false;
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    generateIco();
    console.log('✓ Đã tạo thành công assets/codex-pink.ico');
  } catch (err) {
    console.error('Lỗi tạo icon:', err.message);
    process.exit(1);
  }
}
