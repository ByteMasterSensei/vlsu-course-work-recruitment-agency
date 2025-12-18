using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentAgency.API.Models;

public enum ApplicantStatus
{
    Active = 0,
    Archive = 1,
    NotLooking = 2
}

public class ApplicantProfile
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [MaxLength(200)]
    public string? DesiredPosition { get; set; }

    [MaxLength(100)]
    public string? DesiredSalary { get; set; }

    [Column(TypeName = "TEXT")]
    public string? AdditionalInfo { get; set; }

    public bool ReadyToRelocate { get; set; } = false;

    public bool ReadyForBusinessTrips { get; set; } = false;

    [Required]
    public ApplicantStatus Status { get; set; } = ApplicantStatus.Active;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<Education> Educations { get; set; } = new List<Education>();
    public virtual ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();
    public virtual ICollection<ApplicantSkill> Skills { get; set; } = new List<ApplicantSkill>();
}

