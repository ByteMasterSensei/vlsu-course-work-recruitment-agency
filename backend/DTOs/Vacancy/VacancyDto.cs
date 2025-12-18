namespace RecruitmentAgency.API.DTOs.Vacancy;
public class VacancyDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? CompanyINN { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public string? WorkingConditions { get; set; }
    public string? SalaryRange { get; set; }
    public string EmploymentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public DateTime PublishedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public int CreatedByUserId { get; set; }
}
public class CreateVacancyDto
{
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? CompanyINN { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public string? WorkingConditions { get; set; }
    public string? SalaryRange { get; set; }
    public int EmploymentType { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public DateTime? ExpiresAt { get; set; }
}
public class UpdateVacancyDto
{
    public string? Title { get; set; }
    public string? CompanyName { get; set; }
    public string? CompanyINN { get; set; }
    public string? Description { get; set; }
    public string? Requirements { get; set; }
    public string? WorkingConditions { get; set; }
    public string? SalaryRange { get; set; }
    public int? EmploymentType { get; set; }
    public int? Status { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public DateTime? ExpiresAt { get; set; }
}
public class VacancyFilterDto
{
    public string? Search { get; set; }
    public string? CompanyName { get; set; }
    public int? EmploymentType { get; set; }
    public int? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
}
public class VacancyListResponseDto
{
    public List<VacancyDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
