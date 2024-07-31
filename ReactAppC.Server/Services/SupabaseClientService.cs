using Microsoft.Extensions.Options;
using ReactAppC.Server.Models;
using ReactAppC.Server.Models.SupabaseSettings;
using Supabase;
using Supabase.Gotrue;

namespace ReactAppC.Server.Data
{
    public class SupabaseClientService
    {
        private readonly Supabase.Client _client;

        public SupabaseClientService(IOptions<SupabaseSettings> settings)
        {
            var options = new SupabaseOptions
            {
                AutoRefreshToken = true
            };

            _client = new Supabase.Client(settings.Value.Url, settings.Value.Secret, options);
        }

        public Supabase.Client Client => _client;
    }
}
    