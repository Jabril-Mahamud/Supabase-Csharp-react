using Microsoft.EntityFrameworkCore;
using ReactAppC.Server.Models.SupabaseModels;

namespace ReactAppC.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Playlist> Playlists { get; set; }
    }
}