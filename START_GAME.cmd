@echo off
setlocal
cd /d "%~dp0"
set "PYTHONUTF8=1"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 serve.py
) else (
  where python >nul 2>nul
  if errorlevel 1 (
    echo Python 3 is needed to open the ready-to-play build.
    echo You can also run the C# source with RUN_SOURCE.cmd and .NET SDK 10.
  ) else (
    python serve.py
  )
)
pause
