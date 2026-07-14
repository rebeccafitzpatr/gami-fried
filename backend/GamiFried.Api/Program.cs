using GamiFried.Api.Models;
using GamiFried.Api.Services;
using System.Text.Json; 
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        // Use camelCase in JSON so frontend gets { id, name, cards: [{ question, answer }] }
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        // Optional: keep dictionary keys as-is
        // options.JsonSerializerOptions.DictionaryKeyPolicy = null;
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddSingleton<DeckStore>();
builder.Services.AddHttpClient<DeckGenerator, OpenAIDeckGenerator>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapPost("/decks", (CreateDeckRequest req, DeckStore store) =>
{
    var deck = store.CreateDeck(req.Name);
    return Results.Created($"/decks/{deck.Id}", deck);
}).WithName("CreateDeck");

app.MapGet("/decks", (DeckStore store) => store.Decks);
app.MapGet("/decks/{id:guid}", (Guid id, DeckStore store) =>
{
    var deck = store.GetDeckById(id);
    return deck is not null ? Results.Ok(deck) : Results.NotFound();
}).WithName("GetDeckById");
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
