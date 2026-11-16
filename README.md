# Snow & Lead - Night Debt · C# / Blazor

Educational single-player 3D browser game. The player explores the winter city, fights with opponents and completes the mission. The rules of resources, points, difficulty, and progress are executed in C#; the interface is built on Blazor WebAssembly; Three.js is responsible for the three-dimensional world.

**Author: Alihan Kokey. Group: IT-2502.**

The project was prepared based on the provided game; Three.js is used under the MIT license. To protect yourself, you need to be able to explain the code and the boundaries of C# / JavaScript.

## What to take

The final ZIP provides:

- `Source/` — C# / Razor / JavaScript sources, projects and tests;
- `Play/` — the published version for the local HTTP server;
- `START_GAME.cmd` and `serve.py ` — launching a published game on Windows via Python 3;
- `docs/` — architecture, requirements matching, and protection scenario;
- `verification/` — the final report of the assembly and inspections.

The exact composition and actual results can be found in the archive's final report. The presence of tests in the source code does not in itself mean that all checks have been passed.

## Quick launch of the published version

1. Fully unpack the ZIP into a regular folder.
2. Run `START_GAME.cmd'. To do this, you need Python 3 installed.
3. Leave the local server window open and open the displayed address in the browser.

Blazor WebAssembly must be downloaded over HTTP. Double-click on `Play/index.html ` with the address `file://` is not suitable for this version. .NET SDK and Node.js is not needed for the game from `Play/'. A public link to the hosting is not included in the package.

For a phone, connect it to the same Wi-Fi network and open the computer address from the server window, for example `http://192.168.1.10:8767 /`. the '127.0.0.1` on the phone points to the phone itself. To access from a local network, the server may need Windows permission on a private network. Guest networks sometimes isolate devices.

## Management

| Computer | Phone / Tablet |
|---|---|
| WASD — movement | Left joystick — movement |
| Mouse — overview | Right side of the screen — overview |
| Mouse1 — fire; hold — a series of shots | Hold **FIRE** and use the same finger to shoot and aim |
| Shift — running | **SPRINT** — switch running |
| R — recharge | **RELOAD** — recharge |
| Space / Q / right button — slow down | **SLOW** — slow down |
| Esc / P — pause | Pause button top left |

If cursor capture is unavailable, hold down the left mouse button and move the mouse. If you lose focus, the game is paused. The graphics quality, sound, sensitivity, and control method are available in the settings. The difficulty is selected before the new game.

## Launching and checking the sources

Need.NET 10 SDK. Execute commands from the root of the source project, where `src/` is located (in the archive — `Source/`). The first recovery of NuGet packages may require the Internet.

```powershell
dotnet run --project src/SnowAndLead.Client --urls http://0.0.0.0:8765
dotnet test tests/SnowAndLead.Core.Tests
dotnet publish src/SnowAndLead.Client -c Release -o publish
```

Publishing creates static files in `publish/wwwroot/`; they need to be served by an HTTP server. Check the first launch of the game on your computer; then use its IP address on your phone.

## Where are the main parts located

- `src/SnowAndLead.Core/GameSession.cs` — `GameSession', `GameSnapshot', `GameRules': health, ammo, timers, points, mission, and stats.
- `src/SnowAndLead.Client/` — Razor components, the GameInterop service, styles, and browser resources.
- `src/SnowAndLead.Client/wwwroot/` — Three.js, scene, camera, touch input, sound, and local resources.
- `tests/SnowAndLead.Core.Tests/` — unit tests of rules on xUnit.
- `docs/ARCHITECTURE.md' — allocation of responsibilities and data flow.
- `docs/REQUIREMENTS.md' — all 20 criteria and restrictions.
- `docs/DEFENSE_GUIDE.md` — preparation for protection for 15-20 minutes.

Progress is the best score, the number of deaths and wins in the current browser. The complete state of the opponent's level and position is not saved. The game uses a hybrid of C# and JavaScript: transferring all scene calculations to C# is not part of the scope of work. There is no cloud service, SignalR accounts, or network mode. Testing on mobile screen sizes is not a substitute for testing on physical devices.
