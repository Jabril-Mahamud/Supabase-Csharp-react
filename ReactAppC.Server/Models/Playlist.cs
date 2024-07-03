using System.ComponentModel.DataAnnotations;

namespace ReactAppC.Server.Models;

public class Playlist
{
    public int Id { get; set; }
    public string? Content { get; set; }
    public string? Sauce { get; set; }
    public string? App { get; set; }

    [DataType(DataType.Date)]
    public DateTime DateTime { get; set; } = DateTime.Now;
}
