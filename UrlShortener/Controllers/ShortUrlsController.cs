using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UrlShortener.Data;
using UrlShortener.Models;

[ApiController]
[Route("api/[controller]")]
public class ShortUrlsController : ControllerBase
{
    private readonly AppDbContext _context;
    public ShortUrlsController(AppDbContext context) => _context = context;

    
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() => Ok(await _context.ShortUrls.ToListAsync());

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var url = await _context.ShortUrls.FindAsync(id);
        if (url == null) return NotFound();
        return Ok(url);
    }

    [HttpGet("lookup/{code}")]
    [AllowAnonymous]
    public async Task<IActionResult> Lookup(string code)
    {
        var url = await _context.ShortUrls.FirstOrDefaultAsync(u => u.ShortCode == code);
        if (url == null) return NotFound();
        return Ok(url);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ShortUrl model)
    {
        if (_context.ShortUrls.Any(u => u.OriginalUrl == model.OriginalUrl))
            return BadRequest("This URL already exists.");
        model.ShortCode = Guid.NewGuid().ToString().Substring(0,6);
        model.CreatedBy = User.Identity?.Name;
        model.CreatedAt = DateTime.UtcNow;
        _context.ShortUrls.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var url = await _context.ShortUrls.FindAsync(id);
        if (url == null) return NotFound();
        bool isAdmin = User.IsInRole("Admin");
        bool isOwner = url.CreatedBy == User.Identity?.Name;
        if (!isAdmin && !isOwner) return Forbid();
        _context.ShortUrls.Remove(url);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}