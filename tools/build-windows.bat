@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0\.."

echo ==============================================
echo  BAT DAU DONG GOI CODEX STARTUP (WINDOWS)
echo ==============================================

if not exist "dist" mkdir dist

if not exist "assets\codex-pink.ico" (
    echo [0/2] Dang tao assets\codex-pink.ico...
    node tools\convert-icon.mjs
    if %ERRORLEVEL% NEQ 0 (
        echo [Loi] Khong the tao icon.
        exit /b %ERRORLEVEL%
    )
)

set "CSC=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC%" set "CSC=C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"

if not exist "%CSC%" (
    echo [Loi] Khong tim thay csc.exe.
    exit /b 1
)

echo [1/2] Dang bien dich dist\Codex.exe...
"%CSC%" /nologo /target:winexe /win32icon:assets\codex-pink.ico /out:dist\Codex.exe /r:System.Windows.Forms.dll /r:System.Drawing.dll Native\Launcher.cs
if %ERRORLEVEL% NEQ 0 (
    echo [Loi] Bien dich dist\Codex.exe that bai voi ma loi %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)

echo [2/2] Dang bien dich dist\Aemeath Startup.exe...
"%CSC%" /nologo /target:winexe /win32icon:assets\codex-pink.ico "/out:dist\Aemeath Startup.exe" /r:System.Windows.Forms.dll Native\PreviewLauncher.cs
if %ERRORLEVEL% NEQ 0 (
    echo [Loi] Bien dich dist\Aemeath Startup.exe that bai voi ma loi %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)

copy /Y "dist\Codex.exe" "Codex.exe" >nul 2>&1
copy /Y "dist\Aemeath Startup.exe" "Aemeath Startup.exe" >nul 2>&1

echo.
echo ==============================================
echo  DA HOAN TAT DONG GOI THANH CONG!
echo  - dist\Codex.exe va Codex.exe
echo  - dist\Aemeath Startup.exe va Aemeath Startup.exe
echo ==============================================
endlocal
