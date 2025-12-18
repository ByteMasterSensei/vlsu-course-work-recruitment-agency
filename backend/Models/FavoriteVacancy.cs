using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentAgency.API.Models;

public class FavoriteVacancy
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    [Required]
    public int VacancyId { get; set; }

    [ForeignKey("VacancyId")]
    public virtual Vacancy Vacancy { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Unique constraint on UserId + VacancyId
}

