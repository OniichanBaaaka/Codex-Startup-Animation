@echo off
setlocal
cd /d "%~dp0"
if exist "dist\Codex.exe" (
    start "" "dist\Codex.exe"
) else (
    node "extension\run-windows.mjs"
)
endlocal
