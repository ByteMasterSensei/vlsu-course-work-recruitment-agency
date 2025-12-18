using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.ApplicantProfile;
using RecruitmentAgency.API.Models;

namespace RecruitmentAgency.API.Services;

public interface IApplicantProfileService
{
    Task<List<ApplicantProfileDto>> GetMyProfilesAsync(int userId);
    Task<ApplicantProfileDto?> GetProfileByIdAsync(int id, int userId);
    Task<List<ApplicantProfileDto>> GetAllProfilesAsync(int? userId = null);
    Task<ApplicantProfileDto> CreateProfileAsync(CreateApplicantProfileDto dto, int userId);
    Task<ApplicantProfileDto?> UpdateProfileAsync(int id, UpdateApplicantProfileDto dto, int userId);
    Task<bool> DeleteProfileAsync(int id, int userId);
    Task<bool> UpdateProfileStatusAsync(int id, int status, int userId);
}

public class ApplicantProfileService : IApplicantProfileService
{
    private readonly ApplicationDbContext _context;

    public ApplicantProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicantProfileDto>> GetMyProfilesAsync(int userId)
    {
        return await _context.ApplicantProfiles
            .Where(ap => ap.UserId == userId)
            .Include(ap => ap.Educations)
            .Include(ap => ap.WorkExperiences)
            .Include(ap => ap.Skills)
            .Select(ap => MapToDto(ap))
            .ToListAsync();
    }

    public async Task<ApplicantProfileDto?> GetProfileByIdAsync(int id, int userId)
    {
        var profile = await _context.ApplicantProfiles
            .Include(ap => ap.Educations)
            .Include(ap => ap.WorkExperiences)
            .Include(ap => ap.Skills)
            .FirstOrDefaultAsync(ap => ap.Id == id);

        if (profile == null) return null;

        // Check access: user can only view their own profiles unless they are manager/admin
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        if (profile.UserId != userId && user.Role != UserRole.Manager && user.Role != UserRole.Admin)
        {
            return null;
        }

        return MapToDto(profile);
    }

    public async Task<List<ApplicantProfileDto>> GetAllProfilesAsync(int? userId = null)
    {
        var query = _context.ApplicantProfiles
            .Include(ap => ap.Educations)
            .Include(ap => ap.WorkExperiences)
            .Include(ap => ap.Skills)
            .AsQueryable();

        if (userId.HasValue)
        {
            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null || (user.Role != UserRole.Manager && user.Role != UserRole.Admin))
            {
                return new List<ApplicantProfileDto>();
            }
        }

        return await query.Select(ap => MapToDto(ap)).ToListAsync();
    }

    public async Task<ApplicantProfileDto> CreateProfileAsync(CreateApplicantProfileDto dto, int userId)
    {
        var profile = new ApplicantProfile
        {
            UserId = userId,
            DesiredPosition = dto.DesiredPosition,
            DesiredSalary = dto.DesiredSalary,
            AdditionalInfo = dto.AdditionalInfo,
            ReadyToRelocate = dto.ReadyToRelocate,
            ReadyForBusinessTrips = dto.ReadyForBusinessTrips,
            Status = ApplicantStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        _context.ApplicantProfiles.Add(profile);
        await _context.SaveChangesAsync();

        // Add educations
        foreach (var eduDto in dto.Educations)
        {
            var education = new Education
            {
                ApplicantProfileId = profile.Id,
                Institution = eduDto.Institution,
                Specialty = eduDto.Specialty,
                Degree = eduDto.Degree,
                GraduationYear = eduDto.GraduationYear,
                CreatedAt = DateTime.UtcNow
            };
            _context.Educations.Add(education);
        }

        // Add work experiences
        foreach (var expDto in dto.WorkExperiences)
        {
            var experience = new WorkExperience
            {
                ApplicantProfileId = profile.Id,
                CompanyName = expDto.CompanyName,
                Position = expDto.Position,
                Responsibilities = expDto.Responsibilities,
                StartDate = expDto.StartDate,
                EndDate = expDto.EndDate,
                IsCurrentJob = expDto.IsCurrentJob,
                CreatedAt = DateTime.UtcNow
            };
            _context.WorkExperiences.Add(experience);
        }

        // Add skills
        foreach (var skillDto in dto.Skills)
        {
            var skill = new ApplicantSkill
            {
                ApplicantProfileId = profile.Id,
                SkillName = skillDto.SkillName,
                SkillLevel = skillDto.SkillLevel,
                CreatedAt = DateTime.UtcNow
            };
            _context.ApplicantSkills.Add(skill);
        }

        await _context.SaveChangesAsync();

        return await GetProfileByIdAsync(profile.Id, userId) ?? throw new InvalidOperationException("Failed to create profile");
    }

    public async Task<ApplicantProfileDto?> UpdateProfileAsync(int id, UpdateApplicantProfileDto dto, int userId)
    {
        var profile = await _context.ApplicantProfiles
            .Include(ap => ap.Educations)
            .Include(ap => ap.WorkExperiences)
            .Include(ap => ap.Skills)
            .FirstOrDefaultAsync(ap => ap.Id == id);

        if (profile == null) return null;

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        // Check access
        if (profile.UserId != userId && user.Role != UserRole.Manager && user.Role != UserRole.Admin)
        {
            return null;
        }

        // Update basic fields
        if (!string.IsNullOrWhiteSpace(dto.DesiredPosition)) profile.DesiredPosition = dto.DesiredPosition;
        if (!string.IsNullOrWhiteSpace(dto.DesiredSalary)) profile.DesiredSalary = dto.DesiredSalary;
        if (dto.AdditionalInfo != null) profile.AdditionalInfo = dto.AdditionalInfo;
        if (dto.ReadyToRelocate.HasValue) profile.ReadyToRelocate = dto.ReadyToRelocate.Value;
        if (dto.ReadyForBusinessTrips.HasValue) profile.ReadyForBusinessTrips = dto.ReadyForBusinessTrips.Value;
        if (dto.Status.HasValue) profile.Status = (ApplicantStatus)dto.Status.Value;

        profile.UpdatedAt = DateTime.UtcNow;

        // Update collections if provided
        if (dto.Educations != null)
        {
            _context.Educations.RemoveRange(profile.Educations);
            foreach (var eduDto in dto.Educations)
            {
                _context.Educations.Add(new Education
                {
                    ApplicantProfileId = profile.Id,
                    Institution = eduDto.Institution,
                    Specialty = eduDto.Specialty,
                    Degree = eduDto.Degree,
                    GraduationYear = eduDto.GraduationYear,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        if (dto.WorkExperiences != null)
        {
            _context.WorkExperiences.RemoveRange(profile.WorkExperiences);
            foreach (var expDto in dto.WorkExperiences)
            {
                _context.WorkExperiences.Add(new WorkExperience
                {
                    ApplicantProfileId = profile.Id,
                    CompanyName = expDto.CompanyName,
                    Position = expDto.Position,
                    Responsibilities = expDto.Responsibilities,
                    StartDate = expDto.StartDate,
                    EndDate = expDto.EndDate,
                    IsCurrentJob = expDto.IsCurrentJob,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        if (dto.Skills != null)
        {
            _context.ApplicantSkills.RemoveRange(profile.Skills);
            foreach (var skillDto in dto.Skills)
            {
                _context.ApplicantSkills.Add(new ApplicantSkill
                {
                    ApplicantProfileId = profile.Id,
                    SkillName = skillDto.SkillName,
                    SkillLevel = skillDto.SkillLevel,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        await _context.SaveChangesAsync();

        return await GetProfileByIdAsync(id, userId);
    }

    public async Task<bool> DeleteProfileAsync(int id, int userId)
    {
        var profile = await _context.ApplicantProfiles.FindAsync(id);
        if (profile == null) return false;

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        // Check access
        if (profile.UserId != userId && user.Role != UserRole.Manager && user.Role != UserRole.Admin)
        {
            return false;
        }

        _context.ApplicantProfiles.Remove(profile);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateProfileStatusAsync(int id, int status, int userId)
    {
        var profile = await _context.ApplicantProfiles.FindAsync(id);
        if (profile == null) return false;

        if (profile.UserId != userId)
        {
            return false;
        }

        profile.Status = (ApplicantStatus)status;
        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    private static ApplicantProfileDto MapToDto(ApplicantProfile profile)
    {
        return new ApplicantProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            DesiredPosition = profile.DesiredPosition,
            DesiredSalary = profile.DesiredSalary,
            AdditionalInfo = profile.AdditionalInfo,
            ReadyToRelocate = profile.ReadyToRelocate,
            ReadyForBusinessTrips = profile.ReadyForBusinessTrips,
            Status = profile.Status.ToString(),
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt,
            Educations = profile.Educations.Select(e => new EducationDto
            {
                Id = e.Id,
                Institution = e.Institution,
                Specialty = e.Specialty,
                Degree = e.Degree,
                GraduationYear = e.GraduationYear
            }).ToList(),
            WorkExperiences = profile.WorkExperiences.Select(w => new WorkExperienceDto
            {
                Id = w.Id,
                CompanyName = w.CompanyName,
                Position = w.Position,
                Responsibilities = w.Responsibilities,
                StartDate = w.StartDate,
                EndDate = w.EndDate,
                IsCurrentJob = w.IsCurrentJob
            }).ToList(),
            Skills = profile.Skills.Select(s => new ApplicantSkillDto
            {
                Id = s.Id,
                SkillName = s.SkillName,
                SkillLevel = s.SkillLevel
            }).ToList()
        };
    }
}

