using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentAgency.API.Models;

public class ApplicantSkill
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ApplicantProfileId { get; set; }

    [ForeignKey("ApplicantProfileId")]
    public virtual ApplicantProfile ApplicantProfile { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string SkillName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? SkillLevel { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

