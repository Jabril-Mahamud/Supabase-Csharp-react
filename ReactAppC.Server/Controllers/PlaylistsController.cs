using Microsoft.AspNetCore.Mvc;
using ReactAppC.Server.Models;
using static Supabase.Postgrest.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactAppC.Server.Data;
using static Supabase.Postgrest.Constants;

namespace ReactAppC.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlaylistController : ControllerBase
{
    private readonly SupabaseClientService _supabaseClientService;

    public PlaylistController(SupabaseClientService supabaseClientService)
    {
        _supabaseClientService = supabaseClientService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetPlaylists()
    {
        var client = _supabaseClientService.Client;
        var response = await client.From<Playlist>().Get();
        var playlists = response.Models.Select(p => new
        {
            p.Id,
            p.Content,
            p.Sauce,
            p.App,
            Date = p.Date.ToString("yyyy-MM-dd"),
            Time = p.Time.ToString(@"hh\:mm\:ss")
        }).ToList();
        return Ok(playlists);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetPlaylist(int id)
    {
        var client = _supabaseClientService.Client;
        var response = await client.From<Playlist>().Filter("id", Operator.Equals, id).Get();
        var playlist = response.Models.FirstOrDefault();
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
    public async Task<ActionResult<object>> CreatePlaylist([FromBody] Playlist playlist)
    {
        var now = DateTime.UtcNow;
        playlist.Date = now.Date;
        playlist.Time = now.TimeOfDay;
        var client = _supabaseClientService.Client;
        var response = await client.From<Playlist>().Insert(playlist);
        var createdPlaylist = response.Models.First();
        return CreatedAtAction(nameof(GetPlaylist), new { id = createdPlaylist.Id }, new
        {
            createdPlaylist.Id,
            createdPlaylist.Content,
            createdPlaylist.Sauce,
            createdPlaylist.App,
            Date = createdPlaylist.Date.ToString("yyyy-MM-dd"),
            Time = createdPlaylist.Time.ToString(@"hh\:mm\:ss")
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePlaylist(int id, [FromBody] Playlist updatedPlaylist)
    {
        if (id != updatedPlaylist.Id)
        {
            return BadRequest();
        }
        var client = _supabaseClientService.Client;
        var existingResponse = await client.From<Playlist>().Filter("id", Operator.Equals, id).Get();
        var existingPlaylist = existingResponse.Models.FirstOrDefault();
        if (existingPlaylist == null)
        {
            return NotFound();
        }
        existingPlaylist.Content = updatedPlaylist.Content;
        existingPlaylist.Sauce = updatedPlaylist.Sauce;
        existingPlaylist.App = updatedPlaylist.App;
        var updateResponse = await client.From<Playlist>().Update(existingPlaylist);
        if (updateResponse.Models.Any())
        {
            return NoContent();
        }
        return BadRequest("Failed to update the playlist.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlaylist(int id)
    {
        var client = _supabaseClientService.Client;
        try
        {
            await client.From<Playlist>().Filter("id", Operator.Equals, id).Delete();
            return NoContent();
        }
        catch (Exception ex)
        {
            // Log the exception if you have a logging mechanism
            return NotFound($"Playlist with id {id} not found or could not be deleted.");
        }
    }
}