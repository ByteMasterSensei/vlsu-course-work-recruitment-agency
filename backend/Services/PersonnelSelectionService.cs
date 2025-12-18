using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.AccessRight;
using RecruitmentAgency.API.Models;
namespace RecruitmentAgency.API.Services;
public interface IPersonnelSelectionService
{
    Task<List<PersonnelSearchResultDto>> SearchPersonnelAsync(PersonnelSearchDto searchDto);
}
public class PersonnelSelectionService : IPersonnelSelectionService
{
    private readonly ApplicationDbContext _context;
    public PersonnelSelectionService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<PersonnelSearchResultDto>> SearchPersonnelAsync(PersonnelSearchDto searchDto)
    {
        var query = _context.ApplicantProfiles
            .Include(ap => ap.User)
            .Include(ap => ap.Educations)
            .Include(ap => ap.WorkExperiences)
            .Include(ap => ap.Skills)
            .Where(ap => ap.Status == ApplicantStatus.Active)
            .AsQueryable();
        if (searchDto.VacancyId.HasValue)
        {
            var vacancy = await _context.Vacancies.FindAsync(searchDto.VacancyId.Value);
            if (vacancy != null)
            {
                if (!string.IsNullOrWhiteSpace(vacancy.Requirements))
                {
                    var keywords = vacancy.Requirements.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    query = query.Where(ap =>
                        (ap.DesiredPosition != null && keywords.Any(k => ap.DesiredPosition.ToLower().Contains(k))) ||
                        (ap.AdditionalInfo != null && keywords.Any(k => ap.AdditionalInfo.ToLower().Contains(k))) ||
                        ap.Skills.Any(s => keywords.Any(k => s.SkillName.ToLower().Contains(k)))
                    );
                }
            }
        }
        if (!string.IsNullOrWhiteSpace(searchDto.DesiredPosition))
        {
            query = query.Where(ap => ap.DesiredPosition != null && 
                ap.DesiredPosition.Contains(searchDto.DesiredPosition));
        }
        if (!string.IsNullOrWhiteSpace(searchDto.Education))
        {
            query = query.Where(ap => ap.Educations.Any(e => 
                e.Specialty.Contains(searchDto.Education) || 
                e.Institution.Contains(searchDto.Education)));
        }
        if (searchDto.MinExperienceYears.HasValue)
        {
            var minDate = DateTime.UtcNow.AddYears(-searchDto.MinExperienceYears.Value);
            query = query.Where(ap => ap.WorkExperiences.Any(we => 
                we.StartDate <= minDate && (we.EndDate == null || we.EndDate >= minDate)));
        }
        if (searchDto.RequiredSkills != null && searchDto.RequiredSkills.Any())
        {
            foreach (var skill in searchDto.RequiredSkills)
            {
                query = query.Where(ap => ap.Skills.Any(s => 
                    s.SkillName.Contains(skill, StringComparison.OrdinalIgnoreCase)));
            }
        }
        if (searchDto.ReadyToRelocate.HasValue)
        {
            query = query.Where(ap => ap.ReadyToRelocate == searchDto.ReadyToRelocate.Value);
        }
        var profiles = await query.ToListAsync();
        var results = profiles.Select(profile =>
        {
            var matchScore = CalculateMatchScore(profile, searchDto);
            return new PersonnelSearchResultDto
            {
                ProfileId = profile.Id,
                UserName = $"{profile.User.FirstName} {profile.User.LastName}",
                DesiredPosition = profile.DesiredPosition,
                DesiredSalary = profile.DesiredSalary,
                Educations = profile.Educations.Select(e => 
                    $"{e.Specialty} ({e.Institution}, {e.GraduationYear ?? 0})").ToList(),
                WorkExperiences = profile.WorkExperiences.Select(we => new WorkExperienceSummaryDto
                {
                    CompanyName = we.CompanyName,
                    Position = we.Position,
                    StartDate = we.StartDate,
                    EndDate = we.EndDate,
                    YearsOfExperience = CalculateYears(we.StartDate, we.EndDate)
                }).ToList(),
                Skills = profile.Skills.Select(s => s.SkillName).ToList(),
                MatchScore = matchScore
            };
        })
        .OrderByDescending(r => r.MatchScore)
        .ToList();
        return results;
    }
    private int CalculateMatchScore(ApplicantProfile profile, PersonnelSearchDto searchDto)
    {
        int score = 0;
        if (!string.IsNullOrWhiteSpace(searchDto.DesiredPosition) && 
            profile.DesiredPosition != null &&
            profile.DesiredPosition.Contains(searchDto.DesiredPosition, StringComparison.OrdinalIgnoreCase))
        {
            score += 30;
        }
        if (searchDto.RequiredSkills != null && searchDto.RequiredSkills.Any())
        {
            var matchedSkills = profile.Skills.Count(s => 
                searchDto.RequiredSkills.Any(rs => 
                    s.SkillName.Contains(rs, StringComparison.OrdinalIgnoreCase)));
            score += matchedSkills * 20;
        }
        if (searchDto.MinExperienceYears.HasValue)
        {
            var totalYears = profile.WorkExperiences.Sum(we => 
                CalculateYears(we.StartDate, we.EndDate) ?? 0);
            if (totalYears >= searchDto.MinExperienceYears.Value)
            {
                score += 25;
            }
        }
        if (!string.IsNullOrWhiteSpace(searchDto.Education) &&
            profile.Educations.Any(e => 
                e.Specialty.Contains(searchDto.Education, StringComparison.OrdinalIgnoreCase) ||
                e.Institution.Contains(searchDto.Education, StringComparison.OrdinalIgnoreCase)))
        {
            score += 25;
        }
        return score;
    }
    private int? CalculateYears(DateTime startDate, DateTime? endDate)
    {
        var end = endDate ?? DateTime.UtcNow;
        return (int)((end - startDate).TotalDays / 365.25);
    }
}
