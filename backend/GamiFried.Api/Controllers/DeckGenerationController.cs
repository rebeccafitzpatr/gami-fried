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
}

public class GenerateRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}