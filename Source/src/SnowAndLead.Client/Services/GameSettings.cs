namespace SnowAndLead.Client.Services;

public sealed class GameSettings
{
    public string Quality { get; set; } = "auto";
    public int Volume { get; set; } = 60;
    public int Sensitivity { get; set; } = 100;
    public string ControlsMode { get; set; } = "auto";
    public bool Effects { get; set; } = true;

    public void Validate()
    {
        if (Quality is not ("auto" or "low" or "medium" or "high")) Quality = "auto";
        if (ControlsMode is not ("auto" or "touch" or "keyboard")) ControlsMode = "auto";
        Volume = Math.Clamp(Volume, 0, 100);
        Sensitivity = Math.Clamp(Sensitivity, 50, 200);
    }
}