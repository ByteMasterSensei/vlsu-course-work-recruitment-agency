using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RecruitmentAgency.API.Models;

public enum ApplicationStatus
{
    Pending = 0,
    Reviewed = 1,
    Accepted = 2,
    Rejected = 3,
    Withdrawn = 4
}

public class VacancyApplication
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ApplicantProfileId { get; set; }

    [ForeignKey("ApplicantProfileId")]
    public virtual ApplicantProfile ApplicantProfile { get; set; } = null!;

    [Required]
    public int VacancyId { get; set; }

    [ForeignKey("VacancyId")]
    public virtual Vacancy Vacancy { get; set; } = null!;

    [Required]
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    [Column(TypeName = "TEXT")]
    public string? CoverLetter { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
