using Microsoft.JSInterop;
using SnowAndLead.Core;

namespace SnowAndLead.Client.Services;

/// <summary>Connects renderer events to the C# rules and throttles UI notifications.</summary>
public sealed class GameInterop(GameSession session)
{
    private double _notificationTime;
    public GameSnapshot Current => session.Snapshot;
    public event Action? Changed;

    [JSInvokable]
    public GameSnapshot Reset(string difficulty)
    {
        _notificationTime = 0;
        return Notify(session.Reset(difficulty));
    }

    [JSInvokable]
    public GameSnapshot SetPhase(string phase) => Notify(session.SetPhase(phase));

    [JSInvokable]
    public GameSnapshot Tick(double dt)
    {
        var snapshot = session.Tick(dt);
        if (double.IsFinite(dt) && dt > 0)
        {
            _notificationTime += Math.Min(dt, GameRules.MaximumTickSeconds);
            if (_notificationTime >= 0.1)
            {
                _notificationTime %= 0.1;
                Changed?.Invoke();
            }
        }
        return snapshot;
    }

    [JSInvokable]
    public ShotResult Shoot()
    {
        var result = session.Shoot();
        if (result.Fired || result.StartedReload) Changed?.Invoke();
        return result;
    }

    [JSInvokable]
    public GameCommandResult Reload() => NotifyWhenAccepted(session.Reload());

    [JSInvokable]
    public GameCommandResult SetSlow(bool on) => NotifyWhenAccepted(session.SetSlow(on));

    [JSInvokable]
    public GameSnapshot Hurt(double amount) => Notify(session.Hurt(amount));

    [JSInvokable]
    public GameCommandResult Pickup(string type, int amount) => NotifyWhenAccepted(session.Pickup(type, amount));

    [JSInvokable]
    public GameSnapshot RegisterKill(int enemyId, string enemyType, bool headshot) =>
        Notify(session.RegisterKill(enemyId, enemyType, headshot));

    [JSInvokable]
    public GameSnapshot ReportPosition(double x, double z, double bossX, double bossZ)
    {
        // The adjacent Tick call refreshes the UI at most ten times a second.
        return session.ReportPosition(x, z, bossX, bossZ);
    }

    [JSInvokable]
    public int ShotDamage(bool headshot) => GameRules.ShotDamage(headshot);

    [JSInvokable]
    public string ExportProgress() => session.ExportProgress();

    [JSInvokable]
    public bool ImportProgress(string? json)
    {
        var imported = session.ImportProgress(json);
        if (imported) Changed?.Invoke();
        return imported;
    }

    private GameSnapshot Notify(GameSnapshot snapshot)
    {
        Changed?.Invoke();
        return snapshot;
    }

    private GameCommandResult NotifyWhenAccepted(GameCommandResult result)
    {
        if (result.Accepted) Changed?.Invoke();
        return result;
    }
}
