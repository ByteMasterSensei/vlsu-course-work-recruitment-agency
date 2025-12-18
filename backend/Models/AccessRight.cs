using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RecruitmentAgency.API.Models;
public enum AccessType
{
    OneTime = 0,
    Temporary = 1
}
public class AccessRight
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
    [Required]
    public int GrantedByUserId { get; set; }
    [ForeignKey("GrantedByUserId")]
    public virtual User GrantedByUser { get; set; } = null!;
    [Required]
    public AccessType AccessType { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime? UsedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
