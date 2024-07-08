using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppC.Server.Data;
using ReactAppC.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactAppC.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PlaylistController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetPlaylists()
        {
            var playlists = await _context.Playlists.ToListAsync();
            return Ok(playlists.Select(p => new
            {
                p.Id,
                p.Content,
                p.Sauce,
                p.App,
                Date = p.Date.ToString("yyyy-MM-dd"),
                Time = p.Time.ToString(@"hh\:mm\:ss")
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Playlist>> GetPlaylist(int id)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
            {
                return NotFound();
            }
            return Ok(new
            {
                playlist.Id,
                playlist.Content,
                playlist.Sauce,
                playlist.App,
                Date = playlist.Date.ToString("yyyy-MM-dd"),
                Time = playlist.Time.ToString(@"hh\:mm\:ss")
            });
        }

        [HttpPost]
        public async Task<ActionResult<Playlist>> CreatePlaylist([FromBody] Playlist playlist)
        {
            var now = DateTime.UtcNow;
            playlist.Date = now.Date;
            playlist.Time = now.TimeOfDay;

            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPlaylist), new { id = playlist.Id }, new
            {
                playlist.Id,
                playlist.Content,
                playlist.Sauce,
                playlist.App,
                Date = playlist.Date.ToString("yyyy-MM-dd"),
                Time = playlist.Time.ToString(@"hh\:mm\:ss")
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlaylist(int id, [FromBody] Playlist updatedPlaylist)
        {
            if (id != updatedPlaylist.Id)
            {
                return BadRequest();
            }

            var existingPlaylist = await _context.Playlists.FindAsync(id);
            if (existingPlaylist == null)
            {
                return NotFound();
            }

            existingPlaylist.Content = updatedPlaylist.Content;
            existingPlaylist.Sauce = updatedPlaylist.Sauce;
            existingPlaylist.App = updatedPlaylist.App;
            // Don't update Date and Time

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(int id)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
            {
                return NotFound();
            }

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}