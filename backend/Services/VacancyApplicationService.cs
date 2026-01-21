using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.VacancyApplication;
using RecruitmentAgency.API.Models;

namespace RecruitmentAgency.API.Services;

public interface IVacancyApplicationService
{
    Task<VacancyApplicationDto?> CreateApplicationAsync(CreateApplicationDto dto, int userId);
    Task<List<VacancyApplicationDto>> GetMyApplicationsAsync(int userId);
    Task<List<VacancyApplicationDto>> GetApplicationsForVacancyAsync(int vacancyId);
    Task<List<VacancyApplicationDto>> GetApplicationsForProfileAsync(int profileId);
    Task<VacancyApplicationDto?> GetApplicationByIdAsync(int id);
    Task<bool> UpdateApplicationStatusAsync(int id, int status, int userId);
    Task<bool> WithdrawApplicationAsync(int id, int userId);
}

public class VacancyApplicationService : IVacancyApplicationService
{
    private readonly ApplicationDbContext _context;

    public VacancyApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VacancyApplicationDto?> CreateApplicationAsync(CreateApplicationDto dto, int userId)
    {
        // Проверяем, что профиль принадлежит пользователю
        var profile = await _context.ApplicantProfiles
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == dto.ApplicantProfileId && p.UserId == userId);

        if (profile == null)
            return null;

        // Проверяем, что профиль не в архиве
        if (profile.Status == ApplicantStatus.Archive)
            return null;

        // Проверяем, что вакансия существует и активна
        var vacancy = await _context.Vacancies.FindAsync(dto.VacancyId);
        if (vacancy == null || vacancy.Status != VacancyStatus.Active)
            return null;

        // Проверяем, что отклик еще не подан
        var existingApplication = await _context.VacancyApplications
            .FirstOrDefaultAsync(a => a.ApplicantProfileId == dto.ApplicantProfileId && a.VacancyId == dto.VacancyId);

        if (existingApplication != null)
            return null;

        var application = new VacancyApplication
        {
            ApplicantProfileId = dto.ApplicantProfileId,
            VacancyId = dto.VacancyId,
            CoverLetter = dto.CoverLetter,
            Status = ApplicationStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.VacancyApplications.Add(application);

        // Меняем статус профиля на "Отправлена"
        profile.Status = ApplicantStatus.Submitted;
        profile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(application, profile, vacancy);
    }

    public async Task<List<VacancyApplicationDto>> GetMyApplicationsAsync(int userId)
    {
        var applications = await _context.VacancyApplications
            .Include(a => a.ApplicantProfile)
                .ThenInclude(p => p.User)
            .Include(a => a.Vacancy)
            .Where(a => a.ApplicantProfile.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return applications.Select(a => MapToDto(a, a.ApplicantProfile, a.Vacancy)).ToList();
    }

    public async Task<List<VacancyApplicationDto>> GetApplicationsForVacancyAsync(int vacancyId)
    {
        var applications = await _context.VacancyApplications
            .Include(a => a.ApplicantProfile)
                .ThenInclude(p => p.User)
            .Include(a => a.Vacancy)
            .Where(a => a.VacancyId == vacancyId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return applications.Select(a => MapToDto(a, a.ApplicantProfile, a.Vacancy)).ToList();
    }

    public async Task<List<VacancyApplicationDto>> GetApplicationsForProfileAsync(int profileId)
    {
        var applications = await _context.VacancyApplications
            .Include(a => a.ApplicantProfile)
                .ThenInclude(p => p.User)
            .Include(a => a.Vacancy)
            .Where(a => a.ApplicantProfileId == profileId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return applications.Select(a => MapToDto(a, a.ApplicantProfile, a.Vacancy)).ToList();
    }

    public async Task<VacancyApplicationDto?> GetApplicationByIdAsync(int id)
    {
        var application = await _context.VacancyApplications
            .Include(a => a.ApplicantProfile)
                .ThenInclude(p => p.User)
            .Include(a => a.Vacancy)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
            return null;

        return MapToDto(application, application.ApplicantProfile, application.Vacancy);
    }

    public async Task<bool> UpdateApplicationStatusAsync(int id, int status, int userId)
    {
        var application = await _context.VacancyApplications
            .Include(a => a.ApplicantProfile)
            .Include(a => a.Vacancy)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
            return false;

        // Проверяем, что пользователь - создатель вакансии или админ
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        if (application.Vacancy.CreatedByUserId != userId && user.Role != UserRole.Admin)
            return false;

        application.Status = (ApplicationStatus)status;
        application.UpdatedAt = DateTime.UtcNow;

        // Если отклик отклонен, возвращаем профиль в статус "Активна"
        if ((ApplicationStatus)status == ApplicationStatus.Rejected)
        {
            // Проверяем, есть ли другие активные отклики
            var hasOtherActiveApplications = await _context.VacancyApplications
                .AnyAsync(a => a.ApplicantProfileId == application.ApplicantProfileId 
                    && a.Id != id 
                    && a.Status == ApplicationStatus.Pending);

            if (!hasOtherActiveApplications)
            {
                application.ApplicantProfile.Status = ApplicantStatus.Active;
                application.ApplicantProfile.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> WithdrawApplicationAsync(int id, int userId)
    {
        var application = await _context.VacancyApplications
            .Include(a => a.ApplicantProfile)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
            return false;

        // Проверяем, что профиль принадлежит пользователю
        if (application.ApplicantProfile.UserId != userId)
            return false;

        application.Status = ApplicationStatus.Withdrawn;
        application.UpdatedAt = DateTime.UtcNow;

        // Проверяем, есть ли другие активные отклики
        var hasOtherActiveApplications = await _context.VacancyApplications
            .AnyAsync(a => a.ApplicantProfileId == application.ApplicantProfileId 
                && a.Id != id 
                && a.Status == ApplicationStatus.Pending);

        if (!hasOtherActiveApplications)
        {
            application.ApplicantProfile.Status = ApplicantStatus.Active;
            application.ApplicantProfile.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    private static VacancyApplicationDto MapToDto(VacancyApplication application, ApplicantProfile profile, Vacancy vacancy)
    {
        return new VacancyApplicationDto
        {
            Id = application.Id,
            ApplicantProfileId = application.ApplicantProfileId,
            ApplicantName = $"{profile.User.FirstName} {profile.User.LastName}",
            DesiredPosition = profile.DesiredPosition,
            VacancyId = application.VacancyId,
            VacancyTitle = vacancy.Title,
            CompanyName = vacancy.CompanyName,
            Status = (int)application.Status,
            StatusName = GetStatusName(application.Status),
            CoverLetter = application.CoverLetter,
            CreatedAt = application.CreatedAt,
            UpdatedAt = application.UpdatedAt
        };
    }

    private static string GetStatusName(ApplicationStatus status)
    {
        return status switch
        {
            ApplicationStatus.Pending => "На рассмотрении",
            ApplicationStatus.Reviewed => "Просмотрено",
            ApplicationStatus.Accepted => "Принято",
            ApplicationStatus.Rejected => "Отклонено",
            ApplicationStatus.Withdrawn => "Отозвано",
            _ => "Неизвестно"
        };
    }
}
