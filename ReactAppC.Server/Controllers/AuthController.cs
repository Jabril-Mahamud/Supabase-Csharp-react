// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Supabase.Gotrue;
using Supabase;
using System;
using ReactAppC.Server.Models.AuthModels;

namespace ReactAppC.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly Supabase.Client _supabaseClient;

        public AuthController(Supabase.Client supabaseClient)
        {
            _supabaseClient = supabaseClient;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var session = await _supabaseClient.Auth.SignIn(model.Email, model.Password);
                return Ok(new { token = session.AccessToken });
            }
            catch (Exception ex)
            {
                return Unauthorized("Invalid email or password");
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _supabaseClient.Auth.SignUp(model.Email, model.Password);
                return Ok(new { message = "Registration successful" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Registration failed: {ex.Message}");
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _supabaseClient.Auth.SignOut();
                return Ok(new { message = "Logout successful" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Logout failed: {ex.Message}");
            }
        }

        [HttpGet("user")]
        public IActionResult GetUser()
        {
            var user = _supabaseClient.Auth.CurrentUser;
            if (user == null)
            {
                return Unauthorized("User not authenticated");
            }
            return Ok(user);
        }
    }
}