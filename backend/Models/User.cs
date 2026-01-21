using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RecruitmentAgency.API.Models;
public enum UserRole
{
    Visitor = 0,
    Applicant = 1,
    Manager = 2,
    Admin = 3
}
public class User
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    [MaxLength(100)]
    public string? MiddleName { get; set; }
    [MaxLength(20)]
    public string? Phone { get; set; }
    [Required]
    public UserRole Role { get; set; } = UserRole.Visitor;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public virtual ICollection<ApplicantProfile> ApplicantProfiles { get; set; } = new List<ApplicantProfile>();
    public virtual ICollection<Vacancy> CreatedVacancies { get; set; } = new List<Vacancy>();
    public virtual ICollection<AccessRight> GrantedAccessRights { get; set; } = new List<AccessRight>();
    public virtual ICollection<AccessRight> ReceivedAccessRights { get; set; } = new List<AccessRight>();
    public virtual ICollection<ActionLog> ActionLogs { get; set; } = new List<ActionLog>();
    public virtual ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
    public virtual ICollection<FavoriteVacancy> FavoriteVacancies { get; set; } = new List<FavoriteVacancy>();
}






