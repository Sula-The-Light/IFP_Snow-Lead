using Microsoft.AspNetCore.Components;
using SnowAndLead.Client.Services;
using SnowAndLead.Core;

namespace SnowAndLead.Client.Components;

/// <summary>Only small readouts subscribe to state, keeping renderer islands untouched.</summary>
public abstract class LiveGameComponent : ComponentBase, IDisposable
{
    [Inject] protected GameInterop Game { get; set; } = null!;
    protected GameSnapshot State => Game.Current;
    private bool _disposed;

    protected override void OnInitialized() => Game.Changed += HandleChange;

    private void HandleChange()
    {
        if (!_disposed && ShouldRefresh()) _ = InvokeAsync(StateHasChanged);
    }

    protected virtual bool ShouldRefresh() => true;

    public void Dispose()
    {
        _disposed = true;
        Game.Changed -= HandleChange;
        GC.SuppressFinalize(this);
    }
}