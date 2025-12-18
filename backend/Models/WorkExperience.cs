using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentAgency.API.Models;

public class WorkExperience
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ApplicantProfileId { get; set; }

    [ForeignKey("ApplicantProfileId")]
    public virtual ApplicantProfile ApplicantProfile { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Position { get; set; } = string.Empty;

    [Column(TypeName = "TEXT")]
    public string? Responsibilities { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsCurrentJob { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

