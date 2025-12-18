using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RecruitmentAgency.API.Models;
public enum ActionType
{
    Create = 0,
    Update = 1,
    Delete = 2,
    View = 3,
    Login = 4,
    Logout = 5,
    GrantAccess = 6,
    RevokeAccess = 7,
    ChangeRole = 8
}
public class ActionLog
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
    [Required]
    public ActionType ActionType { get; set; }
    [MaxLength(100)]
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
    [Column(TypeName = "TEXT")]
    public string? Description { get; set; }
    [MaxLength(45)]
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
