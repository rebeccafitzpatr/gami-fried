using System.Threading.Tasks;
using GamiFried.Api.Models;

namespace GamiFried.Api.Services;

public interface DeckGenerator
{
    Task<Deck> GenerateDeckAsync(string prompt, string? name = null);
}