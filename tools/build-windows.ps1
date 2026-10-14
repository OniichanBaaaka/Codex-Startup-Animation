$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Set-Location $root
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " BAT DAU DONG GOI CODEX STARTUP (WINDOWS PS1)" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

if (!(Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" | Out-Null
}

# 1. Chuyen doi icon neu chua co
if (!(Test-Path "assets\codex-pink.ico")) {
    Write-Host "Dang tao assets\codex-pink.ico..." -ForegroundColor Yellow
    node tools/convert-icon.mjs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Khong the tao assets\codex-pink.ico"
        exit $LASTEXITCODE
    }
}

# 2. Tim csc.exe
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (!(Test-Path $csc)) {
    $csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
}

if (!(Test-Path $csc)) {
    Write-Error "Khong tim thay trinh bien dich csc.exe cua .NET Framework."
    exit 1
}

Write-Host "[1/2] Dang bien dich dist\Codex.exe..." -ForegroundColor Green
& $csc /nologo /target:winexe /win32icon:assets\codex-pink.ico /out:dist\Codex.exe /r:System.Windows.Forms.dll /r:System.Drawing.dll Native\Launcher.cs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Bien dich dist\Codex.exe that bai voi ma loi $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "[2/2] Dang bien dich dist\Aemeath Startup.exe..." -ForegroundColor Green
& $csc /nologo /target:winexe /win32icon:assets\codex-pink.ico "/out:dist\Aemeath Startup.exe" /r:System.Windows.Forms.dll Native\PreviewLauncher.cs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Bien dich dist\Aemeath Startup.exe that bai voi ma loi $LASTEXITCODE"
    exit $LASTEXITCODE
}

# Sao chep sang thu muc goc (neu khong bi khoa boi tien trinh dang chay)
try {
    Copy-Item -Path "dist\Codex.exe" -Destination "Codex.exe" -Force
} catch {
    Write-Warning "Codex.exe tai thu muc goc dang duoc mo, ban moi da san sang tai dist\Codex.exe"
}
try {
    Copy-Item -Path "dist\Aemeath Startup.exe" -Destination "Aemeath Startup.exe" -Force
} catch {}

Write-Host "`nDA HOAN TAT DONG GOI THANH CONG!" -ForegroundColor Cyan
Write-Host " - dist\Codex.exe va Codex.exe" -ForegroundColor White
Write-Host " - dist\Aemeath Startup.exe va Aemeath Startup.exe" -ForegroundColor White
