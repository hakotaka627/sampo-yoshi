@echo off
set APPDIR=%~dp0
set NODE=C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
start "" "%NODE%" "%APPDIR%server.js"
timeout /t 2 >nul
start "" "http://127.0.0.1:5179/index.html"
