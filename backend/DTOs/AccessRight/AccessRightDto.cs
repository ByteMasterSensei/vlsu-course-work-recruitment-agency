namespace RecruitmentAgency.API.DTOs.AccessRight;
public class AccessRightDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public int GrantedByUserId { get; set; }
    public string GrantedByUserName { get; set; } = string.Empty;
    public string AccessType { get; set; } = string.Empty;
    public DateTime? ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
public class CreateAccessRightDto
{
    public int UserId { get; set; }
    public int AccessType { get; set; }
    public int? DaysValid { get; set; }
}
public class PersonnelSearchDto
{
    public string? DesiredPosition { get; set; }
    public string? Education { get; set; }
    public int? MinExperienceYears { get; set; }
    public List<string>? RequiredSkills { get; set; }
    public string? SalaryRange { get; set; }
    public bool? ReadyToRelocate { get; set; }
    public int? VacancyId { get; set; }
}
public class PersonnelSearchResultDto
{
    public int ProfileId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? DesiredPosition { get; set; }
    public string? DesiredSalary { get; set; }
    public List<string> Educations { get; set; } = new();
    public List<WorkExperienceSummaryDto> WorkExperiences { get; set; } = new();
    public List<string> Skills { get; set; } = new();
    public int MatchScore { get; set; }
}
public class WorkExperienceSummaryDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? YearsOfExperience { get; set; }
}
public class ApplicantForAccessDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
}
