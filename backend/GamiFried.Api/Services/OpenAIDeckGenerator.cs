using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using GamiFried.Api.Models;

namespace GamiFried.Api.Services;

public class OpenAIDeckGenerator : DeckGenerator
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _apiUrl;

    public OpenAIDeckGenerator(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey =  Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        _apiUrl = "https://api.openai.com/v1/chat/completions";
        
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            throw new InvalidOperationException("OpenAI API key is not configured. Set OpenAI:ApiKey in config or OPENAI_API_KEY/OpenAI__ApiKey env var.");
        }

    }

    public async Task<Deck> GenerateDeckAsync(string prompt, string? name = null)
    {
        var messages = new[]
        {
            new { role = "system", content = "You are a helpful assistant that outputs a single JSON array of QA items. Each item has 'question' and 'answer' fields." },
            new { role = "user", content = prompt }
        };

        var request = new
        {
            model = "gpt-3.5-turbo",
            messages,
            temperature = 0.2,
            max_tokens = 1200
        };

        var jsonRequest = JsonSerializer.Serialize(request);
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, _apiUrl);
        httpRequest.Headers.Add("Authorization", $"Bearer {_apiKey}");
        httpRequest.Content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

        var resp = await _http.SendAsync(httpRequest);
        resp.EnsureSuccessStatusCode();

        var respJson = await resp.Content.ReadAsStringAsync();
        Console.WriteLine(respJson);
        using var jsonDoc = JsonDocument.Parse(respJson);
        var content = jsonDoc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        var qaList = JsonSerializer.Deserialize<List<QaItem>>(content);
        
        if (qaList == null)
        {
            throw new Exception("AI did not return valid QA JSON.");
        }

        var cards = new List<Card>();
        Console.WriteLine($"Generated {qaList.Count} QA items:");
        foreach (var qa in qaList)
        {
            Console.WriteLine(qa.question + " -> " + qa.answer);
            cards.Add(new Card(qa.question, qa.answer));
        }

        var deck = new Deck(Guid.NewGuid(), name ?? $"Deck-{Guid.NewGuid()}", cards, prompt);
        return deck;
    }

    private class QaItem
    {
        public string question { get; set; } = string.Empty;
        public string answer { get; set; } = string.Empty;
    }
}