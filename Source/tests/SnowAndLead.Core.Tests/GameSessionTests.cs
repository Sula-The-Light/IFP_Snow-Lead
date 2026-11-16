using System.Text.Json;
using SnowAndLead.Core;
using Xunit;

namespace SnowAndLead.Core.Tests;

public sealed class GameSessionTests
{
    [Fact]
    public void NewSession_HasFullStartingResourcesAndNoHistory()
    {
        var state = new GameSession().Snapshot;

        Assert.Equal(100, state.Health);
        Assert.Equal(12, state.Ammo);
        Assert.Equal(48, state.Reserve);
        Assert.Equal(100, state.SlowEnergy);
        Assert.False(state.SlowActive);
        Assert.Equal(0, state.ReloadRemaining);
        Assert.Equal(0, state.FireCooldown);
        Assert.Equal(0, state.Score);
        Assert.Equal(0, state.Kills);
        Assert.Equal(0, state.Deaths);
        Assert.Equal(0, state.Victories);
        Assert.Equal("menu", state.Phase);
        Assert.Equal("normal", state.Difficulty);
        Assert.Equal(GameRules.FindBossMission, state.Mission);
        Assert.InRange(state.DistanceToBoss, 657, 659);
    }

    [Theory]
    [InlineData("easy", "easy")]
    [InlineData("normal", "normal")]
    [InlineData("hard", "hard")]
    [InlineData(" HARD ", "hard")]
    [InlineData("impossible", "normal")]
    [InlineData(null, "normal")]
    public void Reset_NormalizesDifficulty(string? difficulty, string expected)
    {
        Assert.Equal(expected, new GameSession().Reset(difficulty!).Difficulty);
    }

    [Fact]
    public void Reset_ClearsRunWhileRetainingStatisticsAndAllowsReusedEnemyIds()
    {
        var session = Playing();
        session.RegisterKill(1, "robber", true);
        session.RegisterKill(2, "boss", false);
        session.Reset();
        session.SetPhase("play");
        session.Hurt(1000);

        var reset = session.Reset("hard");

        Assert.Equal(1150, reset.BestScore);
        Assert.Equal(1, reset.Victories);
        Assert.Equal(1, reset.Deaths);
        Assert.Equal(0, reset.Score);
        Assert.Equal(0, reset.Kills);
        Assert.False(reset.MissionComplete);
        Assert.Equal(100, reset.Health);
        Assert.Equal(12, reset.Ammo);
        Assert.Equal(48, reset.Reserve);
        session.SetPhase("play");
        Assert.Equal(100, session.RegisterKill(1, "robber", false).Score);
    }

    [Theory]
    [InlineData("menu")]
    [InlineData("comic")]
    [InlineData("play")]
    [InlineData("paused")]
    [InlineData("settings")]
    [InlineData("dead")]
    [InlineData("ending")]
    [InlineData("fin")]
    [InlineData("error")]
    public void SetPhase_AcceptsCanonicalPhases(string phase)
    {
        Assert.Equal(phase, new GameSession().SetPhase(phase).Phase);
    }

    [Theory]
    [InlineData("")]
    [InlineData("loading")]
    [InlineData(null)]
    public void SetPhase_IgnoresUnknownPhases(string? phase)
    {
        var session = Playing();
        var before = session.Snapshot;

        Assert.Same(before, session.SetPhase(phase!));
    }

    [Theory]
    [InlineData("menu")]
    [InlineData("paused")]
    [InlineData("settings")]
    [InlineData("comic")]
    [InlineData("dead")]
    [InlineData("ending")]
    [InlineData("fin")]
    [InlineData("error")]
    public void NonPlayingPhase_FreezesTimersResourcesAndGameplayCommands(string phase)
    {
        var session = Playing();
        session.Shoot();
        session.Reload();
        session.SetSlow(true);
        var before = session.SetPhase(phase);

        session.Tick(0.25);
        Assert.False(session.Shoot().Fired);
        Assert.False(session.Reload().Accepted);
        Assert.False(session.SetSlow(false).Accepted);
        Assert.False(session.Pickup("ammo", 12).Accepted);
        session.Hurt(20);
        session.RegisterKill(1, "robber", false);
        session.ReportPosition(225, 205);

        Assert.Same(before, session.Snapshot);
    }

    [Fact]
    public void Resume_AfterPauseContinuesPendingReload()
    {
        var session = Playing();
        session.Shoot();
        session.Reload();
        session.SetPhase("paused");
        Advance(session, 2);
        session.SetPhase("play");
        Advance(session, 1.1);

        Assert.Equal(12, session.Snapshot.Ammo);
        Assert.Equal(47, session.Snapshot.Reserve);
        Assert.Equal(0, session.Snapshot.ReloadRemaining);
    }

    [Fact]
    public void Snapshots_RemainImmutableAfterLaterCommands()
    {
        var session = Playing();
        var before = session.Snapshot;
        var shot = session.Shoot();

        Assert.NotSame(before, shot.Snapshot);
        Assert.Equal(12, before.Ammo);
        Assert.Equal(0, before.FireCooldown);
        Assert.Equal(11, shot.Snapshot.Ammo);
        Assert.Equal(0.22, shot.Snapshot.FireCooldown, 8);
    }

    [Fact]
    public void Shoot_ConsumesOneRoundAndRequiresCooldownBeforeNextShot()
    {
        var session = Playing();

        Assert.True(session.Shoot().Fired);
        Assert.False(session.Shoot().Fired);
        session.Tick(0.1);
        Assert.False(session.Shoot().Fired);
        session.Tick(0.12);
        Assert.True(session.Shoot().Fired);
        Assert.Equal(10, session.Snapshot.Ammo);
        Assert.Equal(48, session.Snapshot.Reserve);
    }

    [Fact]
    public void LastShot_StartsAutomaticReloadAndPreservesAmmunition()
    {
        var session = Playing();
        ShotResult? lastShot = null;
        for (var index = 0; index < 12; index++)
        {
            lastShot = session.Shoot();
            if (index < 11) session.Tick(0.25);
        }

        Assert.True(lastShot!.Fired);
        Assert.True(lastShot.StartedReload);
        Assert.Equal(0, lastShot.Snapshot.Ammo);
        Assert.Equal(1.1, lastShot.Snapshot.ReloadRemaining, 8);
        Assert.False(session.Shoot().Fired);
        Advance(session, 1.1);
        Assert.Equal(12, session.Snapshot.Ammo);
        Assert.Equal(36, session.Snapshot.Reserve);
        Assert.Equal(0, session.Snapshot.ReloadRemaining);
    }

    [Fact]
    public void ManualReload_TransfersOnlyMissingRoundsAndCannotRestart()
    {
        var session = Playing();
        Assert.False(session.Reload().Accepted);
        session.Shoot();

        Assert.True(session.Reload().Accepted);
        session.Tick(0.25);
        Assert.False(session.Reload().Accepted);
        Assert.Equal(0.85, session.Snapshot.ReloadRemaining, 8);
        Advance(session, 0.85);

        Assert.Equal(12, session.Snapshot.Ammo);
        Assert.Equal(47, session.Snapshot.Reserve);
    }

    [Fact]
    public void EmptyWeapon_CannotShootWithoutAmmunitionAndCanReloadPartialPickup()
    {
        var session = Playing();
        for (var index = 0; index < 60; index++)
        {
            Assert.True(session.Shoot().Fired);
            Advance(session, session.Snapshot.ReloadRemaining > 0 ? 1.1 : 0.25);
        }

        Assert.Equal(0, session.Snapshot.Ammo);
        Assert.Equal(0, session.Snapshot.Reserve);
        Assert.False(session.Reload().Accepted);
        Assert.False(session.Shoot().Fired);
        Assert.True(session.Pickup("ammo", 3).Accepted);
        var emptyShot = session.Shoot();
        Assert.False(emptyShot.Fired);
        Assert.True(emptyShot.StartedReload);
        Advance(session, 1.1);
        Assert.Equal(3, session.Snapshot.Ammo);
        Assert.Equal(0, session.Snapshot.Reserve);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(double.NaN)]
    [InlineData(double.PositiveInfinity)]
    [InlineData(double.NegativeInfinity)]
    public void Tick_IgnoresInvalidElapsedTime(double dt)
    {
        var session = Playing();
        session.Shoot();
        session.SetSlow(true);
        var before = session.Snapshot;

        Assert.Same(before, session.Tick(dt));
    }

    [Fact]
    public void Tick_ClampsLongFrameAndPreventsNegativeTimers()
    {
        var session = Playing();
        session.Shoot();
        session.Reload();
        session.SetSlow(true);

        var after = session.Tick(1000);

        Assert.Equal(94.5, after.SlowEnergy, 8);
        Assert.Equal(0.85, after.ReloadRemaining, 8);
        Assert.Equal(0, after.FireCooldown);
        Assert.Equal(11, after.Ammo);
    }

    [Fact]
    public void SlowMotion_DrainsDeactivatesAtZeroAndRegeneratesToMaximum()
    {
        var session = Playing();
        Assert.True(session.SetSlow(true).Accepted);
        Advance(session, 4.75);

        Assert.Equal(0, session.Snapshot.SlowEnergy);
        Assert.False(session.Snapshot.SlowActive);
        Assert.False(session.SetSlow(true).Accepted);
        session.Tick(0.25);
        Assert.Equal(1.25, session.Snapshot.SlowEnergy, 8);
        Advance(session, 30);
        Assert.Equal(100, session.Snapshot.SlowEnergy);
    }

    [Fact]
    public void SlowMotion_CannotActivateBelowThresholdAndCanAfterRegeneration()
    {
        var session = Playing();
        session.SetSlow(true);
        Advance(session, 4);
        session.SetSlow(false);

        Assert.Equal(12, session.Snapshot.SlowEnergy, 8);
        Assert.False(session.SetSlow(true).Accepted);
        Assert.False(session.Snapshot.SlowActive);
        Advance(session, 0.75);
        Assert.True(session.SetSlow(true).Accepted);
        Assert.True(session.Snapshot.SlowActive);
    }

    [Theory]
    [InlineData("easy", 86)]
    [InlineData("normal", 80)]
    [InlineData("hard", 74)]
    public void Hurt_ScalesIncomingDamageByDifficulty(string difficulty, double expectedHealth)
    {
        var session = Playing(difficulty);

        Assert.Equal(expectedHealth, session.Hurt(20).Health, 8);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-20)]
    [InlineData(double.NaN)]
    [InlineData(double.PositiveInfinity)]
    [InlineData(double.NegativeInfinity)]
    public void Hurt_IgnoresInvalidDamage(double damage)
    {
        var session = Playing();
        var before = session.Snapshot;

        Assert.Same(before, session.Hurt(damage));
    }

    [Fact]
    public void LethalDamage_RecordsDeathOnceAndRequiresNewRun()
    {
        var session = Playing("hard");
        session.SetSlow(true);
        var death = session.Hurt(double.MaxValue);

        Assert.Equal(0, death.Health);
        Assert.Equal("dead", death.Phase);
        Assert.Equal(1, death.Deaths);
        Assert.False(death.SlowActive);
        Assert.Same(death, session.Hurt(100));
        Assert.Equal("dead", session.SetPhase("play").Phase);
        Assert.False(session.Pickup("hp", 100).Accepted);
        Assert.False(session.Shoot().Fired);
    }

    [Fact]
    public void HealthPickup_RequiresMissingHealthAndCapsAtMaximum()
    {
        var session = Playing();
        Assert.False(session.Pickup("hp", 25).Accepted);
        session.Hurt(20);

        Assert.True(session.Pickup("hp", 10).Accepted);
        Assert.Equal(90, session.Snapshot.Health);
        Assert.True(session.Pickup("hp", int.MaxValue).Accepted);
        Assert.Equal(100, session.Snapshot.Health);
        Assert.False(session.Pickup("hp", 25).Accepted);
    }

    [Fact]
    public void AmmunitionPickup_CapsReserveWithoutOverflowAndRejectsAtCapacity()
    {
        var session = Playing();

        Assert.True(session.Pickup("ammo", int.MaxValue).Accepted);
        Assert.Equal(9999, session.Snapshot.Reserve);
        var before = session.Snapshot;
        Assert.False(session.Pickup("ammo", 12).Accepted);
        Assert.Same(before, session.Snapshot);
    }

    [Theory]
    [InlineData("hp", 0)]
    [InlineData("hp", -1)]
    [InlineData("ammo", 0)]
    [InlineData("ammo", -12)]
    [InlineData("unknown", 12)]
    [InlineData(null, 12)]
    public void Pickup_RejectsInvalidTypeOrAmount(string? type, int amount)
    {
        var session = Playing();
        session.Hurt(10);
        var before = session.Snapshot;

        Assert.False(session.Pickup(type!, amount).Accepted);
        Assert.Same(before, session.Snapshot);
    }

    [Theory]
    [InlineData("robber", false, 100)]
    [InlineData("robber", true, 150)]
    [InlineData("mob", false, 150)]
    [InlineData("mob", true, 200)]
    [InlineData("boss", false, 1000)]
    [InlineData("boss", true, 1050)]
    public void RegisterKill_AwardsTypeScoreAndHeadshotBonus(string type, bool headshot, int expected)
    {
        var state = Playing().RegisterKill(0, type, headshot);

        Assert.Equal(expected, state.Score);
        Assert.Equal(expected, state.BestScore);
        Assert.Equal(1, state.Kills);
    }

    [Fact]
    public void RegisterKill_DuplicateIdCannotAwardScoreOrChangeEnemyType()
    {
        var session = Playing();
        var firstKill = session.RegisterKill(1, "robber", false);

        Assert.Same(firstKill, session.RegisterKill(1, "boss", true));
        Assert.Equal(100, session.Snapshot.Score);
        Assert.Equal(0, session.Snapshot.Victories);
        Assert.False(session.Snapshot.MissionComplete);
    }

    [Fact]
    public void RegisterKill_IgnoresInvalidEnemyWithoutReservingItsId()
    {
        var session = Playing();
        var before = session.Snapshot;

        Assert.Same(before, session.RegisterKill(-1, "robber", false));
        Assert.Same(before, session.RegisterKill(1, "civilian", false));
        Assert.Same(before, session.RegisterKill(1, null!, false));
        Assert.Equal(150, session.RegisterKill(1, "mob", false).Score);
    }

    [Fact]
    public void BossKill_CompletesMissionRecordsOneVictoryAndFreezesGameplay()
    {
        var session = Playing();
        session.SetSlow(true);
        var victory = session.RegisterKill(10, "boss", false);

        Assert.True(victory.MissionComplete);
        Assert.Equal(GameRules.CompletedMission, victory.Mission);
        Assert.Equal("ending", victory.Phase);
        Assert.Equal(1, victory.Victories);
        Assert.False(victory.SlowActive);
        Assert.Same(victory, session.RegisterKill(11, "boss", true));
        Assert.Same(victory, session.Tick(0.25));
        Assert.Equal("ending", session.SetPhase("play").Phase);
    }

    [Theory]
    [InlineData(false, 34)]
    [InlineData(true, 70)]
    public void ShotDamage_UsesBodyAndHeadshotDamage(bool headshot, int expected)
    {
        Assert.Equal(expected, GameRules.ShotDamage(headshot));
    }

    [Fact]
    public void ReportPosition_UpdatesBossDistanceAndMissionAtSeventyFiveMeters()
    {
        var session = Playing();

        Assert.Equal(GameRules.FindBossMission, session.ReportPosition(150, 205).Mission);
        Assert.Equal(75, session.Snapshot.DistanceToBoss, 8);
        Assert.Equal(GameRules.EliminateBossMission, session.ReportPosition(151, 205).Mission);
        Assert.Equal(0, session.ReportPosition(225, 205).DistanceToBoss, 8);
    }

    [Fact]
    public void ReportPosition_ClampsWorldBoundsBeforeCalculatingDistance()
    {
        var session = Playing();
        var state = session.ReportPosition(double.MaxValue, double.MaxValue);

        Assert.Equal(Math.Sqrt(43 * 43 + 63 * 63), state.DistanceToBoss, 8);
    }

    [Fact]
    public void ReportPosition_UsesMovingBossPositionForDistanceAndMission()
    {
        var session = Playing();
        Assert.Equal(GameRules.FindBossMission, session.ReportPosition(0, 0).Mission);

        var nearbyBoss = session.ReportPosition(0, 0, 6, 8);

        Assert.Equal(10, nearbyBoss.DistanceToBoss, 8);
        Assert.Equal(GameRules.EliminateBossMission, nearbyBoss.Mission);
        var distantBoss = session.ReportPosition(0, 0, 75, 0);
        Assert.Equal(75, distantBoss.DistanceToBoss, 8);
        Assert.Equal(GameRules.FindBossMission, distantBoss.Mission);
    }

    [Fact]
    public void ReportPosition_ClampsBothPlayerAndMovingBossToWorldBounds()
    {
        var session = Playing();

        var state = session.ReportPosition(double.MaxValue, double.MaxValue,
            -double.MaxValue, -double.MaxValue);

        Assert.Equal(Math.Sqrt(536 * 536 * 2), state.DistanceToBoss, 8);
    }

    [Theory]
    [InlineData(double.NaN, 0)]
    [InlineData(0, double.NaN)]
    [InlineData(double.PositiveInfinity, 0)]
    [InlineData(0, double.NegativeInfinity)]
    public void ReportPosition_IgnoresNonFiniteMovingBossCoordinates(double bossX, double bossZ)
    {
        var session = Playing();
        var before = session.ReportPosition(0, 0, 10, 0);

        Assert.Same(before, session.ReportPosition(0, 0, bossX, bossZ));
    }

    [Theory]
    [InlineData(double.NaN, 0)]
    [InlineData(0, double.NaN)]
    [InlineData(double.PositiveInfinity, 0)]
    [InlineData(0, double.NegativeInfinity)]
    public void ReportPosition_IgnoresNonFiniteCoordinates(double x, double z)
    {
        var session = Playing();
        var before = session.Snapshot;

        Assert.Same(before, session.ReportPosition(x, z));
    }

    [Fact]
    public void Progress_RoundTripsHistoryWithoutRestoringLiveRunOrWorldCheckpoint()
    {
        var source = Playing("hard");
        source.RegisterKill(1, "boss", true);
        source.Reset();
        source.SetPhase("play");
        source.Hurt(1000);
        var json = source.ExportProgress();
        var restored = new GameSession();

        Assert.True(restored.ImportProgress(json));
        Assert.Equal(1050, restored.Snapshot.BestScore);
        Assert.Equal(1, restored.Snapshot.Victories);
        Assert.Equal(1, restored.Snapshot.Deaths);
        Assert.Equal("menu", restored.Snapshot.Phase);
        Assert.Equal(100, restored.Snapshot.Health);
        Assert.Equal(12, restored.Snapshot.Ammo);
        Assert.Equal(0, restored.Snapshot.Score);
        Assert.Equal(0, restored.Snapshot.Kills);
        Assert.False(restored.Snapshot.MissionComplete);
        using var document = JsonDocument.Parse(json);
        Assert.Equal(1, document.RootElement.GetProperty("version").GetInt32());
        Assert.False(document.RootElement.TryGetProperty("health", out _));
        Assert.False(document.RootElement.TryGetProperty("distanceToBoss", out _));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("{")]
    [InlineData("null")]
    [InlineData("[]")]
    [InlineData("{}")] 
    [InlineData("{\"version\":2}")]
    [InlineData("{\"version\":\"1\"}")]
    [InlineData("{\"version\":1,\"bestScore\":\"100\"}")]
    [InlineData("{\"version\":1,\"deaths\":null}")]
    [InlineData("{\"version\":1,\"victories\":1.5}")]
    [InlineData("{\"version\":1,\"bestScore\":1e999}")]
    public void ImportProgress_RejectsInvalidDataWithoutChangingState(string? json)
    {
        var session = Playing();
        session.RegisterKill(1, "robber", false);
        var before = session.Snapshot;

        Assert.False(session.ImportProgress(json));
        Assert.Same(before, session.Snapshot);
    }

    [Fact]
    public void ImportProgress_ClampsLargeAndNegativeStatistics()
    {
        var session = new GameSession();

        Assert.True(session.ImportProgress("{\"version\":1,\"bestScore\":1e30,\"deaths\":-200,\"victories\":2147483648}"));
        Assert.Equal(int.MaxValue, session.Snapshot.BestScore);
        Assert.Equal(0, session.Snapshot.Deaths);
        Assert.Equal(int.MaxValue, session.Snapshot.Victories);
    }

    [Fact]
    public void ImportProgress_PreservesCurrentRunAndNeverReducesExistingHistory()
    {
        var session = Playing();
        Assert.True(session.ImportProgress("{\"version\":1,\"bestScore\":500,\"deaths\":3,\"victories\":2}"));
        session.Shoot();
        session.Hurt(10);
        session.ReportPosition(225, 205);
        session.RegisterKill(1, "mob", true);
        var before = session.Snapshot;

        Assert.True(session.ImportProgress("{\"version\":1,\"bestScore\":1,\"deaths\":0,\"victories\":0,\"health\":0,\"score\":9999,\"x\":0}"));

        Assert.Equal(before, session.Snapshot);
        Assert.Equal(500, session.Snapshot.BestScore);
        Assert.Equal(3, session.Snapshot.Deaths);
        Assert.Equal(2, session.Snapshot.Victories);
        Assert.Equal(200, session.Snapshot.Score);
        Assert.Equal(90, session.Snapshot.Health);
        Assert.Equal(11, session.Snapshot.Ammo);
    }

    [Fact]
    public void ImportProgress_RejectsExcessivePayloadsAndNesting()
    {
        var session = new GameSession();
        Assert.False(session.ImportProgress(new string(' ', 16_385)));
        var nested = new string('[', 20) + "0" + new string(']', 20);
        Assert.False(session.ImportProgress("{\"version\":1,\"extra\":" + nested + "}"));
    }

    [Fact]
    public void HistoryCounters_SaturateWithoutOverflow()
    {
        var session = Playing();
        Assert.True(session.ImportProgress("{\"version\":1,\"deaths\":2147483647,\"victories\":2147483647}"));
        Assert.Equal(int.MaxValue, session.RegisterKill(1, "boss", false).Victories);
        session.Reset();
        session.SetPhase("play");
        Assert.Equal(int.MaxValue, session.Hurt(1000).Deaths);
    }

    private static GameSession Playing(string difficulty = "normal")
    {
        var session = new GameSession();
        session.Reset(difficulty);
        session.SetPhase("play");
        return session;
    }

    private static void Advance(GameSession session, double seconds)
    {
        while (seconds > 0.000000001)
        {
            var frame = Math.Min(seconds, 0.25);
            session.Tick(frame);
            seconds -= frame;
        }
    }
}
