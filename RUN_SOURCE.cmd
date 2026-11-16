@echo off
setlocal
cd /d "%~dp0Source"
set "DOTNET_CLI_TELEMETRY_OPTOUT=1"
echo Starting the C# source. Wait until the app is listening.
echo Open http://localhost:8767/ in your browser.
dotnet run --project src\SnowAndLead.Client --urls http://0.0.0.0:8767
pause
