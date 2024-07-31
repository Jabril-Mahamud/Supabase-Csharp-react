using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace ReactAppC.Server.Models
{
    [Table("playlists")] // Use the exact table name in lowercase as per PostgreSQL convention
    public class Playlist : BaseModel
    {
        [PrimaryKey("id", false)] // Ensure the second parameter is 'false' if 'id' is not a serial/auto-incrementing primary key
        public int Id { get; set; }

        [Column("content")]
        public string Content { get; set; }

        [Column("sauce")]
        public string Sauce { get; set; }

        [Column("app")]
        public string App { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }

        [Column("time")]
        public TimeSpan Time { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }  // Add this line

        public override bool Equals(object obj)
        {
            return obj is Playlist playlist &&
                   Id == playlist.Id;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }
    }
}
