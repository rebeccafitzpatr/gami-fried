using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GamiFried.Api.Services;
using GamiFried.Api.Models;

namespace GamiFried.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeckGenerationController : ControllerBase
{
    private readonly DeckGenerator _ai;
    private readonly DeckStore _store;

    public DeckGenerationController(DeckGenerator ai, DeckStore store)
    {
        _ai = ai;
        _store = store;
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Prompt))
            return BadRequest("Prompt is required.");

        var deck = await _ai.GenerateDeckAsync(req.Prompt, req.Name);
        _store.AddDeck(deck);
        return Ok(deck);
    }

    [HttpPut("{id:guid}")]
    public IActionResult UpdateDeck(Guid id, [FromBody] UpdateDeckRequest req)
    {
        var updated = _store.UpdateDeck(id, req.Name, req.Prompt, req.Cards?.ConvertAll(c => new Card(c.Question, c.Answer)));
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpPost("{id:guid}/regenerate")]
    public async Task<IActionResult> Regenerate(Guid id, [FromBody] RegenerateRequest req)
    {
        var deck = _store.GetDeckById(id);
        if (deck == null) return NotFound();

        var prompt = req.Prompt ?? deck.Prompt ?? "";
        var name = req.Name ?? deck.Name;

        var regenerated = await _ai.GenerateDeckAsync(prompt, name);
        _store.UpdateDeck(id, name, regenerated.Prompt, regenerated.Cards);

        return Ok(_store.GetDeckById(id));
    }
}

public class GenerateRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class RegenerateRequest
{
    public string? Prompt { get; set; }
    public string? Name { get; set; }
}

public class UpdateDeckRequest
{
    public string? Name { get; set; }
    public string? Prompt { get; set; }
    public List<CardDTO>? Cards { get; set; }
}

public class CardDTO
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
}