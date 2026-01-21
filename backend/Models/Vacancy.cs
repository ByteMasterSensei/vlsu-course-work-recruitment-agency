using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace RecruitmentAgency.API.Models;
public enum EmploymentType
{
    FullTime = 0,
    PartTime = 1,
    Contract = 2,
    Internship = 3
}
public enum VacancyStatus
{
    Active = 0,
    Paused = 1,
    Closed = 2
}
public class Vacancy
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;
    [MaxLength(20)]
    public string? CompanyINN { get; set; }
    [Required]
    [Column(TypeName = "TEXT")]
    public string Description { get; set; } = string.Empty;
    [Column(TypeName = "TEXT")]
    public string? Requirements { get; set; }
    [Column(TypeName = "TEXT")]
    public string? WorkingConditions { get; set; }
    [MaxLength(100)]
    public string? SalaryRange { get; set; }
    [Required]
    public EmploymentType EmploymentType { get; set; } = EmploymentType.FullTime;
    [Required]
    public VacancyStatus Status { get; set; } = VacancyStatus.Active;
    [MaxLength(100)]
    public string? ContactPerson { get; set; }
    [MaxLength(100)]
    public string? ContactEmail { get; set; }
    [MaxLength(20)]
    public string? ContactPhone { get; set; }
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    [Required]
    public int CreatedByUserId { get; set; }
    [ForeignKey("CreatedByUserId")]
    public virtual User CreatedByUser { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public virtual ICollection<FavoriteVacancy> FavoriteVacancies { get; set; } = new List<FavoriteVacancy>();
    public virtual ICollection<VacancyApplication> VacancyApplications { get; set; } = new List<VacancyApplication>();
}






