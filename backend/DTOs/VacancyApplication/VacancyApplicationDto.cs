namespace RecruitmentAgency.API.DTOs.VacancyApplication;

public class VacancyApplicationDto
{
    public int Id { get; set; }
    public int ApplicantProfileId { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string? DesiredPosition { get; set; }
    public int VacancyId { get; set; }
    public string VacancyTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public int Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? CoverLetter { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateApplicationDto
{
    public int ApplicantProfileId { get; set; }
    public int VacancyId { get; set; }
    public string? CoverLetter { get; set; }
}

public class UpdateApplicationStatusDto
{
    public int Status { get; set; }
}
