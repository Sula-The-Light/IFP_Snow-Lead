using System.Text.Json;

namespace SnowAndLead.Core;

/// <summary>The immutable, authoritative gameplay state exposed to the client.</summary>
public sealed record GameSnapshot
{
    public double Health { get; init; }
    public int Ammo { get; init; }
    public int Reserve { get; init; }
    public double SlowEnergy { get; init; }
    public bool SlowActive { get; init; }
    public double ReloadRemaining { get; init; }
    public double FireCooldown { get; init; }
    public int Kills { get; init; }
    public int Score { get; init; }
    public int BestScore { get; init; }
    public int Deaths { get; init; }
    public int Victories { get; init; }
    public string Phase { get; init; } = "menu";
    public string Mission { get; init; } = GameRules.FindBossMission;
    public string Difficulty { get; init; } = "normal";
    public bool MissionComplete { get; init; }
    public double DistanceToBoss { get; init; }
}

public sealed record ShotResult(bool Fired, bool StartedReload, GameSnapshot Snapshot);
public sealed record GameCommandResult(bool Accepted, GameSnapshot Snapshot);

public static class GameRules
{
    public const int MagazineSize = 12;
    public const int MaximumReserve = 9999;
    public const double ReloadSeconds = 1.1;
    public const double ShotCooldownSeconds = 0.22;
    public const double MaximumTickSeconds = 0.25;
    public const string FindBossMission = "НАЙДИТЕ КОРВО";
    public const string EliminateBossMission = "УСТРАНИТЕ КОРВО";
    public const string CompletedMission = "МИССИЯ ВЫПОЛНЕНА";

    public static int ShotDamage(bool headshot) => headshot ? 70 : 34;
}

/// <summary>
/// Deterministic rules independent of rendering, clocks, browser APIs and storage.
/// The renderer reports world events; this session owns resource and score changes.
/// </summary>
public sealed class GameSession
{
    private const double BossX = 225;
    private const double BossZ = 205;
    private readonly HashSet<int> _killedEnemyIds = [];
    private bool _bossDefeated;
    private bool _deathRecorded;
    private GameSnapshot _snapshot = new();

    public GameSession() => Reset();

    public GameSnapshot Snapshot => _snapshot;

    /// <summary>Begins a fresh run while retaining lifetime records.</summary>
    public GameSnapshot Reset(string difficulty = "normal")
    {
        var selectedDifficulty = Normalize(difficulty);
        if (selectedDifficulty is not ("easy" or "normal" or "hard"))
        {
            selectedDifficulty = "normal";
        }

        _killedEnemyIds.Clear();
        _bossDefeated = false;
        _deathRecorded = false;
        _snapshot = new GameSnapshot
        {
            Health = 100,
            Ammo = GameRules.MagazineSize,
            Reserve = 48,
            SlowEnergy = 100,
            Difficulty = selectedDifficulty,
            BestScore = _snapshot.BestScore,
            Deaths = _snapshot.Deaths,
            Victories = _snapshot.Victories,
            DistanceToBoss = Distance(-250, -250)
        };
        return _snapshot;
    }

    public GameSnapshot SetPhase(string phase)
    {
        var next = Normalize(phase);
        if (next is not ("menu" or "comic" or "play" or "paused" or "settings" or "dead" or "ending" or "fin" or "error"))
        {
            return _snapshot;
        }

        // A finished run requires Reset before it can become playable again.
        if (next == "play" && (_snapshot.Health <= 0 || _snapshot.MissionComplete))
        {
            return _snapshot;
        }

        _snapshot = _snapshot with { Phase = next };
        return _snapshot;
    }

    public GameSnapshot Tick(double dt)
    {
        if (!IsPlaying || !double.IsFinite(dt) || dt <= 0)
        {
            return _snapshot;
        }

        dt = Math.Min(dt, GameRules.MaximumTickSeconds);
        var energy = _snapshot.SlowActive
            ? Math.Max(0, _snapshot.SlowEnergy - 22 * dt)
            : Math.Min(100, _snapshot.SlowEnergy + 5 * dt);
        var reload = DecreaseTimer(_snapshot.ReloadRemaining, dt);
        var ammo = _snapshot.Ammo;
        var reserve = _snapshot.Reserve;
        if (_snapshot.ReloadRemaining > 0 && reload == 0)
        {
            var transferred = Math.Min(GameRules.MagazineSize - ammo, reserve);
            ammo += transferred;
            reserve -= transferred;
        }

        _snapshot = _snapshot with
        {
            SlowEnergy = energy,
            SlowActive = _snapshot.SlowActive && energy > 0,
            FireCooldown = DecreaseTimer(_snapshot.FireCooldown, dt),
            ReloadRemaining = reload,
            Ammo = ammo,
            Reserve = reserve
        };
        return _snapshot;
    }

    public ShotResult Shoot()
    {
        if (!IsPlaying || _snapshot.FireCooldown > 0 || _snapshot.ReloadRemaining > 0)
        {
            return new(false, false, _snapshot);
        }

        if (_snapshot.Ammo <= 0)
        {
            return new(false, BeginReload(), _snapshot);
        }

        _snapshot = _snapshot with
        {
            Ammo = _snapshot.Ammo - 1,
            FireCooldown = GameRules.ShotCooldownSeconds
        };
        var startedReload = _snapshot.Ammo == 0 && BeginReload();
        return new(true, startedReload, _snapshot);
    }

    public GameCommandResult Reload() => new(IsPlaying && BeginReload(), _snapshot);

    public GameCommandResult SetSlow(bool on)
    {
        if (!IsPlaying || (on && _snapshot.SlowEnergy < 15))
        {
            return new(false, _snapshot);
        }

        _snapshot = _snapshot with { SlowActive = on };
        return new(true, _snapshot);
    }

    public GameSnapshot Hurt(double amount)
    {
        if (!IsPlaying || !double.IsFinite(amount) || amount <= 0)
        {
            return _snapshot;
        }

        var multiplier = _snapshot.Difficulty switch { "easy" => 0.7, "hard" => 1.3, _ => 1 };
        var health = Math.Max(0, _snapshot.Health - amount * multiplier);
        var died = health == 0 && !_deathRecorded;
        _deathRecorded |= died;
        _snapshot = _snapshot with
        {
            Health = health,
            Phase = died ? "dead" : _snapshot.Phase,
            SlowActive = health > 0 && _snapshot.SlowActive,
            Deaths = died ? Increment(_snapshot.Deaths) : _snapshot.Deaths
        };
        return _snapshot;
    }

    public GameCommandResult Pickup(string type, int amount)
    {
        if (!IsPlaying || amount <= 0)
        {
            return new(false, _snapshot);
        }

        switch (Normalize(type))
        {
            case "hp" when _snapshot.Health < 100:
                _snapshot = _snapshot with { Health = Math.Min(100, _snapshot.Health + amount) };
                return new(true, _snapshot);
            case "ammo" when _snapshot.Reserve < GameRules.MaximumReserve:
                _snapshot = _snapshot with
                {
                    Reserve = (int)Math.Min(GameRules.MaximumReserve, (long)_snapshot.Reserve + amount)
                };
                return new(true, _snapshot);
            default:
                return new(false, _snapshot);
        }
    }

    public GameSnapshot RegisterKill(int enemyId, string enemyType, bool headshot)
    {
        if (!IsPlaying || enemyId < 0 || _killedEnemyIds.Contains(enemyId))
        {
            return _snapshot;
        }

        var type = Normalize(enemyType);
        var points = type switch { "robber" => 100, "mob" => 150, "boss" => 1000, _ => 0 };
        if (points == 0 || (type == "boss" && _bossDefeated))
        {
            return _snapshot;
        }

        _killedEnemyIds.Add(enemyId);
        var score = AddClamped(_snapshot.Score, points + (headshot ? 50 : 0));
        var victory = type == "boss";
        _bossDefeated |= victory;
        _snapshot = _snapshot with
        {
            Kills = Increment(_snapshot.Kills),
            Score = score,
            BestScore = Math.Max(_snapshot.BestScore, score),
            Victories = victory ? Increment(_snapshot.Victories) : _snapshot.Victories,
            MissionComplete = victory || _snapshot.MissionComplete,
            Mission = victory ? GameRules.CompletedMission : _snapshot.Mission,
            Phase = victory ? "ending" : _snapshot.Phase,
            SlowActive = !victory && _snapshot.SlowActive
        };
        return _snapshot;
    }

    public GameSnapshot ReportPosition(double x, double z) => ReportPosition(x, z, BossX, BossZ);

    public GameSnapshot ReportPosition(double x, double z, double bossX, double bossZ)
    {
        if (!IsPlaying || !double.IsFinite(x) || !double.IsFinite(z) ||
            !double.IsFinite(bossX) || !double.IsFinite(bossZ))
        {
            return _snapshot;
        }

        var distance = Distance(Math.Clamp(x, -268, 268), Math.Clamp(z, -268, 268),
            Math.Clamp(bossX, -268, 268), Math.Clamp(bossZ, -268, 268));
        _snapshot = _snapshot with
        {
            DistanceToBoss = distance,
            Mission = distance < 75 ? GameRules.EliminateBossMission : GameRules.FindBossMission
        };
        return _snapshot;
    }

    /// <summary>Persists lifetime statistics only; world and live-run resources are never checkpoints.</summary>
    public string ExportProgress() =>
        $"{{\"version\":1,\"bestScore\":{_snapshot.BestScore},\"deaths\":{_snapshot.Deaths},\"victories\":{_snapshot.Victories}}}";

    public bool ImportProgress(string? json)
    {
        if (string.IsNullOrWhiteSpace(json) || json.Length > 16_384)
        {
            return false;
        }

        try
        {
            using var document = JsonDocument.Parse(json, new JsonDocumentOptions { MaxDepth = 16 });
            var root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object ||
                !root.TryGetProperty("version", out var version) ||
                !version.TryGetInt32(out var versionNumber) || versionNumber != 1 ||
                !TryReadStatistic(root, "bestScore", out var bestScore) ||
                !TryReadStatistic(root, "deaths", out var deaths) ||
                !TryReadStatistic(root, "victories", out var victories))
            {
                return false;
            }

            _snapshot = _snapshot with
            {
                BestScore = Math.Max(_snapshot.BestScore, bestScore),
                Deaths = Math.Max(_snapshot.Deaths, deaths),
                Victories = Math.Max(_snapshot.Victories, victories)
            };
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
        catch (InvalidOperationException)
        {
            return false;
        }
    }

    private bool IsPlaying => _snapshot.Phase == "play" && _snapshot.Health > 0 && !_snapshot.MissionComplete;

    private bool BeginReload()
    {
        if (_snapshot.ReloadRemaining > 0 || _snapshot.Reserve <= 0 || _snapshot.Ammo >= GameRules.MagazineSize)
        {
            return false;
        }

        _snapshot = _snapshot with { ReloadRemaining = GameRules.ReloadSeconds };
        return true;
    }

    private static string Normalize(string? value) => value?.Trim().ToLowerInvariant() ?? "";
    private static double Distance(double x, double z, double bossX = BossX, double bossZ = BossZ) =>
        Math.Sqrt(Math.Pow(bossX - x, 2) + Math.Pow(bossZ - z, 2));
    private static int Increment(int value) => AddClamped(value, 1);
    private static int AddClamped(int value, int amount) => (int)Math.Min(int.MaxValue, (long)value + amount);
    private static double DecreaseTimer(double timer, double dt) => timer - dt > 0.000000001 ? timer - dt : 0;

    private static bool TryReadStatistic(JsonElement root, string property, out int result)
    {
        result = 0;
        if (!root.TryGetProperty(property, out var element))
        {
            return true;
        }

        if (element.ValueKind != JsonValueKind.Number || !element.TryGetDouble(out var value) ||
            !double.IsFinite(value) || Math.Truncate(value) != value)
        {
            return false;
        }

        result = (int)Math.Clamp(value, 0, int.MaxValue);
        return true;
    }
}
