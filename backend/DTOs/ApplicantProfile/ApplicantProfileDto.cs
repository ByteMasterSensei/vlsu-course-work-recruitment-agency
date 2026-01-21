namespace RecruitmentAgency.API.DTOs.ApplicantProfile;
public class ApplicantProfileDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? DesiredPosition { get; set; }
    public string? DesiredSalary { get; set; }
    public string? AdditionalInfo { get; set; }
    public bool ReadyToRelocate { get; set; }
    public bool ReadyForBusinessTrips { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<EducationDto> Educations { get; set; } = new();
    public List<WorkExperienceDto> WorkExperiences { get; set; } = new();
    public List<ApplicantSkillDto> Skills { get; set; } = new();
}
public class EducationDto
{
    public int Id { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string? Degree { get; set; }
    public int? GraduationYear { get; set; }
}
public class WorkExperienceDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? Responsibilities { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentJob { get; set; }
}
public class ApplicantSkillDto
{
    public int Id { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string? SkillLevel { get; set; }
}
public class CreateApplicantProfileDto
{
    public string? DesiredPosition { get; set; }
    public string? DesiredSalary { get; set; }
    public string? AdditionalInfo { get; set; }
    public bool ReadyToRelocate { get; set; }
    public bool ReadyForBusinessTrips { get; set; }
    public List<CreateEducationDto> Educations { get; set; } = new();
    public List<CreateWorkExperienceDto> WorkExperiences { get; set; } = new();
    public List<CreateApplicantSkillDto> Skills { get; set; } = new();
}
public class CreateEducationDto
{
    public string Institution { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string? Degree { get; set; }
    public int? GraduationYear { get; set; }
}
public class CreateWorkExperienceDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? Responsibilities { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrentJob { get; set; }
}
public class CreateApplicantSkillDto
{
    public string SkillName { get; set; } = string.Empty;
    public string? SkillLevel { get; set; }
}
public class UpdateApplicantProfileDto
{
    public string? DesiredPosition { get; set; }
    public string? DesiredSalary { get; set; }
    public string? AdditionalInfo { get; set; }
    public bool? ReadyToRelocate { get; set; }
    public bool? ReadyForBusinessTrips { get; set; }
    public int? Status { get; set; }
    public List<CreateEducationDto>? Educations { get; set; }
    public List<CreateWorkExperienceDto>? WorkExperiences { get; set; }
    public List<CreateApplicantSkillDto>? Skills { get; set; }
}






