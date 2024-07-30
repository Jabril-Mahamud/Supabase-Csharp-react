using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace ReactAppC.Server.Models
{
    [Table("Timer")]
    public class Timer : BaseModel
    {
        [PrimaryKey("Id")]
        public int Id { get; set; }

        [Column("Time since")]
        public DateTime Datetime { get; set; }
        public override bool Equals(object obj)
        {
            return obj is Timer timer &&
                   Id == timer.Id;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id);
        }
    }
}
