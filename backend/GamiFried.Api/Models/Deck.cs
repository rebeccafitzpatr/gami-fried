using System;
using System.Collections.Generic;

namespace GamiFried.Api.Models;

public record Deck(Guid Id, string Name, List<Card> Cards, string? Prompt = null);