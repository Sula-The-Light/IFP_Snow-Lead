using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SnowAndLead.Client;
using SnowAndLead.Client.Services;
using SnowAndLead.Core;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped<GameSession>();
builder.Services.AddScoped<GameInterop>();

await builder.Build().RunAsync();
