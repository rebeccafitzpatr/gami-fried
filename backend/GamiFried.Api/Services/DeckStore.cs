using System;
using System.Collections.Generic;
using System.Linq;
using GamiFried.Api.Models;

namespace GamiFried.Api.Services;

public class DeckStore
{
    private readonly List<Deck> decks = new();

    public IReadOnlyList<Deck> Decks => decks;

    public Deck CreateDeck(string? name)
    {
        // Seed with a starter flashcard instead of playing cards
        var starter = new Card("Example question 1", "Example answer 1");
        var deck = new Deck(Guid.NewGuid(), name ?? $"Deck-{Guid.NewGuid()}", new List<Card> { starter });
        decks.Add(deck);
        return deck;
    }
}