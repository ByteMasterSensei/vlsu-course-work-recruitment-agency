using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.Vacancy;
using RecruitmentAgency.API.Models;

namespace RecruitmentAgency.API.Services;

public interface IVacancyService
{
    Task<VacancyListResponseDto> GetVacanciesAsync(VacancyFilterDto filter);
    Task<VacancyDto?> GetVacancyByIdAsync(int id);
    Task<VacancyDto> CreateVacancyAsync(CreateVacancyDto dto, int userId);
    Task<VacancyDto?> UpdateVacancyAsync(int id, UpdateVacancyDto dto, int userId);
    Task<bool> DeleteVacancyAsync(int id, int userId);
}

public class VacancyService : IVacancyService
{
    private readonly ApplicationDbContext _context;

    public VacancyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VacancyListResponseDto> GetVacanciesAsync(VacancyFilterDto filter)
    {
        var query = _context.Vacancies.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var searchLower = filter.Search.ToLower();
            query = query.Where(v =>
                v.Title.ToLower().Contains(searchLower) ||
                v.CompanyName.ToLower().Contains(searchLower) ||
                (v.Description != null && v.Description.ToLower().Contains(searchLower)) ||
                (v.Requirements != null && v.Requirements.ToLower().Contains(searchLower))
            );
        }

        if (!string.IsNullOrWhiteSpace(filter.CompanyName))
        {
            query = query.Where(v => v.CompanyName.Contains(filter.CompanyName));
        }

        if (filter.EmploymentType.HasValue)
        {
            query = query.Where(v => v.EmploymentType == (EmploymentType)filter.EmploymentType.Value);
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(v => v.Status == (VacancyStatus)filter.Status.Value);
        }
        else
        {
            // By default, show only active vacancies for non-managers
            query = query.Where(v => v.Status == VacancyStatus.Active);
        }

        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "date" or "publishedat" => filter.SortDescending
                ? query.OrderByDescending(v => v.PublishedAt)
                : query.OrderBy(v => v.PublishedAt),
            "salary" => filter.SortDescending
                ? query.OrderByDescending(v => v.SalaryRange)
                : query.OrderBy(v => v.SalaryRange),
            "company" => filter.SortDescending
                ? query.OrderByDescending(v => v.CompanyName)
                : query.OrderBy(v => v.CompanyName),
            _ => query.OrderByDescending(v => v.PublishedAt)
        };

        var totalCount = await query.CountAsync();

        // Apply pagination
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(v => new VacancyDto
            {
                Id = v.Id,
                Title = v.Title,
                CompanyName = v.CompanyName,
                CompanyINN = v.CompanyINN,
                Description = v.Description,
                Requirements = v.Requirements,
                WorkingConditions = v.WorkingConditions,
                SalaryRange = v.SalaryRange,
                EmploymentType = v.EmploymentType.ToString(),
                Status = v.Status.ToString(),
                ContactPerson = v.ContactPerson,
                ContactEmail = v.ContactEmail,
                ContactPhone = v.ContactPhone,
                PublishedAt = v.PublishedAt,
                ExpiresAt = v.ExpiresAt,
                CreatedByUserId = v.CreatedByUserId
            })
            .ToListAsync();

        return new VacancyListResponseDto
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
        };
    }

    public async Task<VacancyDto?> GetVacancyByIdAsync(int id)
    {
        var vacancy = await _context.Vacancies.FindAsync(id);
        if (vacancy == null) return null;

        return new VacancyDto
        {
            Id = vacancy.Id,
            Title = vacancy.Title,
            CompanyName = vacancy.CompanyName,
            CompanyINN = vacancy.CompanyINN,
            Description = vacancy.Description,
            Requirements = vacancy.Requirements,
            WorkingConditions = vacancy.WorkingConditions,
            SalaryRange = vacancy.SalaryRange,
            EmploymentType = vacancy.EmploymentType.ToString(),
            Status = vacancy.Status.ToString(),
            ContactPerson = vacancy.ContactPerson,
            ContactEmail = vacancy.ContactEmail,
            ContactPhone = vacancy.ContactPhone,
            PublishedAt = vacancy.PublishedAt,
            ExpiresAt = vacancy.ExpiresAt,
            CreatedByUserId = vacancy.CreatedByUserId
        };
    }

    public async Task<VacancyDto> CreateVacancyAsync(CreateVacancyDto dto, int userId)
    {
        var vacancy = new Vacancy
        {
            Title = dto.Title,
            CompanyName = dto.CompanyName,
            CompanyINN = dto.CompanyINN,
            Description = dto.Description,
            Requirements = dto.Requirements,
            WorkingConditions = dto.WorkingConditions,
            SalaryRange = dto.SalaryRange,
            EmploymentType = (EmploymentType)dto.EmploymentType,
            Status = VacancyStatus.Active,
            ContactPerson = dto.ContactPerson,
            ContactEmail = dto.ContactEmail,
            ContactPhone = dto.ContactPhone,
            PublishedAt = DateTime.UtcNow,
            ExpiresAt = dto.ExpiresAt,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Vacancies.Add(vacancy);
        await _context.SaveChangesAsync();

        return await GetVacancyByIdAsync(vacancy.Id) ?? throw new InvalidOperationException("Failed to create vacancy");
    }

    public async Task<VacancyDto?> UpdateVacancyAsync(int id, UpdateVacancyDto dto, int userId)
    {
        var vacancy = await _context.Vacancies.FindAsync(id);
        if (vacancy == null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Title)) vacancy.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.CompanyName)) vacancy.CompanyName = dto.CompanyName;
        if (dto.CompanyINN != null) vacancy.CompanyINN = dto.CompanyINN;
        if (!string.IsNullOrWhiteSpace(dto.Description)) vacancy.Description = dto.Description;
        if (dto.Requirements != null) vacancy.Requirements = dto.Requirements;
        if (dto.WorkingConditions != null) vacancy.WorkingConditions = dto.WorkingConditions;
        if (dto.SalaryRange != null) vacancy.SalaryRange = dto.SalaryRange;
        if (dto.EmploymentType.HasValue) vacancy.EmploymentType = (EmploymentType)dto.EmploymentType.Value;
        if (dto.Status.HasValue) vacancy.Status = (VacancyStatus)dto.Status.Value;
        if (dto.ContactPerson != null) vacancy.ContactPerson = dto.ContactPerson;
        if (dto.ContactEmail != null) vacancy.ContactEmail = dto.ContactEmail;
        if (dto.ContactPhone != null) vacancy.ContactPhone = dto.ContactPhone;
        if (dto.ExpiresAt.HasValue) vacancy.ExpiresAt = dto.ExpiresAt;

        vacancy.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetVacancyByIdAsync(id);
    }

    public async Task<bool> DeleteVacancyAsync(int id, int userId)
    {
        var vacancy = await _context.Vacancies.FindAsync(id);
        if (vacancy == null) return false;

        _context.Vacancies.Remove(vacancy);
        await _context.SaveChangesAsync();

        return true;
    }
}

