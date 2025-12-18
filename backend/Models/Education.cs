using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentAgency.API.Models;

public class Education
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ApplicantProfileId { get; set; }

    [ForeignKey("ApplicantProfileId")]
    public virtual ApplicantProfile ApplicantProfile { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Specialty { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Degree { get; set; }

    public int? GraduationYear { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

