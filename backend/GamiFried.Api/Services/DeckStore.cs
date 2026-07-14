using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using GamiFried.Api.Models;

namespace GamiFried.Api.Services;

public class DeckStore
{
    private List<Deck> decks = new();
    private readonly string storagePath;
    private readonly object _lock = new object();

    public DeckStore()
    {
        // Persisted storage in the app base directory
        storagePath = Path.Combine(AppContext.BaseDirectory, "decks.json");
        Load();
    }

    public IReadOnlyList<Deck> Decks => decks.AsReadOnly();

    public Deck CreateDeck(string? name)
    {
        // Seed with a starter flashcard
        var starter = new Card("Example question 1", "Example answer 1");
        var deck = new Deck(Guid.NewGuid(), name ?? $"Deck-{Guid.NewGuid()}", new List<Card> { starter });

        lock (_lock)
        {
            decks.Add(deck);
            Save();
        }

        return deck;

        // Create a new deck with the provided name and prompt
        
    }

    public Deck? UpdateDeck(Guid id, string? name = null, string? prompt = null, List<Card>? cards = null)
    {
        lock (_lock)
        {
            var index = decks.FindIndex(d => d.Id == id);
            if (index < 0) return null;

            var current = decks[index];
            var updated = current with
            {
                Name = name ?? current.Name,
                Prompt = prompt ?? current.Prompt,
                Cards = cards ?? current.Cards
            };

            decks[index] = updated;
            Save();
            return updated;
        }
    }

    //get all decks
    public IReadOnlyList<Deck> GetAllDecks()
    {
        lock (_lock)
        {
            return decks.AsReadOnly();
        }
    }

    public Deck? GetDeckById(Guid id)
    {
        lock (_lock)
        {
            return decks.FirstOrDefault(d => d.Id == id);
        }
    }

    public Deck AddDeck(Deck deck)
    {
        lock (_lock)
        {
            decks.Add(deck);
            Save();
        }
        return deck;
    }

    private void Save()
    {
        try
        {
            var json = JsonSerializer.Serialize(decks);
            File.WriteAllText(storagePath, json);
        }
        catch
        {
            // In production, consider logging the error
        }
    }

    private void Load()
    {
        try
        {
            if (File.Exists(storagePath))
            {
                var json = File.ReadAllText(storagePath);
                var data = JsonSerializer.Deserialize<List<Deck>>(json);
                if (data != null)
                {
                    decks = data;
                }
                else
                {
                    decks = new List<Deck>();
                }
            }
            else
            {
                decks = new List<Deck>();
            }
        }
        catch
        {
            // If loading fails, start fresh (avoid crashing startup)
            decks = new List<Deck>();
        }
    }
}