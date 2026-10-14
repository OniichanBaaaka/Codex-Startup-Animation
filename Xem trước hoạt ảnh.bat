@echo off
setlocal
cd /d "%~dp0"
set "INDEX_URL=file:///%~dp0index.html"
set "INDEX_URL=%INDEX_URL:\=/%"
start msedge --app="%INDEX_URL%" --window-size=1020,700 2>nul
if %ERRORLEVEL% EQU 0 exit /b
start chrome --app="%INDEX_URL%" --window-size=1020,700 2>nul
if %ERRORLEVEL% EQU 0 exit /b
start "" "%INDEX_URL%"
endlocal
