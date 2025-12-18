using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.AccessRight;
using RecruitmentAgency.API.Models;

namespace RecruitmentAgency.API.Services;

public interface IAccessRightService
{
    Task<List<AccessRightDto>> GetAllAccessRightsAsync(int userId);
    Task<AccessRightDto> GrantAccessAsync(CreateAccessRightDto dto, int grantedByUserId);
    Task<bool> RevokeAccessAsync(int id, int userId);
    Task<bool> CheckAccessAsync(int userId);
}

public class AccessRightService : IAccessRightService
{
    private readonly ApplicationDbContext _context;

    public AccessRightService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AccessRightDto>> GetAllAccessRightsAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null || (user.Role != UserRole.Manager && user.Role != UserRole.Admin))
        {
            return new List<AccessRightDto>();
        }

        return await _context.AccessRights
            .Include(ar => ar.User)
            .Include(ar => ar.GrantedByUser)
            .Select(ar => new AccessRightDto
            {
                Id = ar.Id,
                UserId = ar.UserId,
                UserEmail = ar.User.Email,
                UserName = $"{ar.User.FirstName} {ar.User.LastName}",
                GrantedByUserId = ar.GrantedByUserId,
                GrantedByUserName = $"{ar.GrantedByUser.FirstName} {ar.GrantedByUser.LastName}",
                AccessType = ar.AccessType.ToString(),
                ExpiresAt = ar.ExpiresAt,
                IsUsed = ar.IsUsed,
                UsedAt = ar.UsedAt,
                CreatedAt = ar.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<AccessRightDto> GrantAccessAsync(CreateAccessRightDto dto, int grantedByUserId)
    {
        var accessRight = new AccessRight
        {
            UserId = dto.UserId,
            GrantedByUserId = grantedByUserId,
            AccessType = (AccessType)dto.AccessType,
            CreatedAt = DateTime.UtcNow
        };

        if (dto.AccessType == (int)AccessType.Temporary && dto.Days.HasValue)
        {
            accessRight.ExpiresAt = DateTime.UtcNow.AddDays(dto.Days.Value);
        }

        _context.AccessRights.Add(accessRight);
        await _context.SaveChangesAsync();

        // Log action
        await LogActionAsync(grantedByUserId, ActionType.GrantAccess, "AccessRight", accessRight.Id, 
            $"Предоставлен доступ пользователю {dto.UserId}");

        var result = await _context.AccessRights
            .Include(ar => ar.User)
            .Include(ar => ar.GrantedByUser)
            .Where(ar => ar.Id == accessRight.Id)
            .Select(ar => new AccessRightDto
            {
                Id = ar.Id,
                UserId = ar.UserId,
                UserEmail = ar.User.Email,
                UserName = $"{ar.User.FirstName} {ar.User.LastName}",
                GrantedByUserId = ar.GrantedByUserId,
                GrantedByUserName = $"{ar.GrantedByUser.FirstName} {ar.GrantedByUser.LastName}",
                AccessType = ar.AccessType.ToString(),
                ExpiresAt = ar.ExpiresAt,
                IsUsed = ar.IsUsed,
                UsedAt = ar.UsedAt,
                CreatedAt = ar.CreatedAt
            })
            .FirstAsync();

        return result;
    }

    public async Task<bool> RevokeAccessAsync(int id, int userId)
    {
        var accessRight = await _context.AccessRights.FindAsync(id);
        if (accessRight == null) return false;

        var user = await _context.Users.FindAsync(userId);
        if (user == null || (user.Role != UserRole.Manager && user.Role != UserRole.Admin))
        {
            return false;
        }

        _context.AccessRights.Remove(accessRight);
        await _context.SaveChangesAsync();

        await LogActionAsync(userId, ActionType.RevokeAccess, "AccessRight", id, "Доступ отозван");

        return true;
    }

    public async Task<bool> CheckAccessAsync(int userId)
    {
        var activeAccess = await _context.AccessRights
            .Where(ar => ar.UserId == userId)
            .Where(ar => !ar.IsUsed || (ar.ExpiresAt.HasValue && ar.ExpiresAt > DateTime.UtcNow))
            .FirstOrDefaultAsync();

        if (activeAccess == null) return false;

        // Mark as used if it's one-time access
        if (activeAccess.AccessType == AccessType.OneTime && !activeAccess.IsUsed)
        {
            activeAccess.IsUsed = true;
            activeAccess.UsedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return true;
    }

    private async Task LogActionAsync(int userId, ActionType actionType, string? entityType, int? entityId, string description)
    {
        var actionLog = new ActionLog
        {
            UserId = userId,
            ActionType = actionType,
            EntityType = entityType,
            EntityId = entityId,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        _context.ActionLogs.Add(actionLog);
        await _context.SaveChangesAsync();
    }
}

