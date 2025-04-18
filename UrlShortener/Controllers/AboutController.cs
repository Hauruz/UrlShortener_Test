using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UrlShortener.Data;
using UrlShortener.Models;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class AboutController : ControllerBase
{
    private readonly AppDbContext _context;
    public AboutController(AppDbContext context) => _context = context;

    // GET: api/About
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Get()
    {
        var content = await _context.AboutContents.OrderByDescending(a => a.UpdatedAt).FirstOrDefaultAsync();
        if (content == null) return Ok(new { Text = string.Empty });
        return Ok(content);
    }

    // PUT: api/About
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromBody] AboutContent dto)
    {
        var content = await _context.AboutContents.OrderByDescending(a => a.UpdatedAt).FirstOrDefaultAsync();
        if (content == null)
        {
            content = new AboutContent();
            _context.AboutContents.Add(content);
        }
        content.Text = dto.Text;
        content.UpdatedBy = User.Identity?.Name;
        content.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(content);
    }
}