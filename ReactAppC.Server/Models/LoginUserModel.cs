using System.ComponentModel.DataAnnotations;

namespace ReactAppC.Server.Models
{
    public class LoginUserModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
