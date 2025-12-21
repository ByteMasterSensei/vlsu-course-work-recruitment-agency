using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.User;
namespace RecruitmentAgency.API.Services;
public interface IActionLogService
{
    Task<ActionLogListResponseDto> GetActionLogsAsync(ActionLogFilterDto filter);
    Task<List<ActionLogDto>> GetUserActionLogsAsync(int userId);
}
public class ActionLogService : IActionLogService
{
    private readonly ApplicationDbContext _context;
    public ActionLogService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<ActionLogListResponseDto> GetActionLogsAsync(ActionLogFilterDto filter)
    {
        var query = _context.ActionLogs
            .Include(al => al.User)
            .AsQueryable();
        if (filter.UserId.HasValue)
        {
            query = query.Where(al => al.UserId == filter.UserId.Value);
        }
        if (!string.IsNullOrWhiteSpace(filter.ActionType))
        {
            query = query.Where(al => al.ActionType.ToString() == filter.ActionType);
        }
        if (!string.IsNullOrWhiteSpace(filter.EntityType))
        {
            query = query.Where(al => al.EntityType == filter.EntityType);
        }
        if (filter.StartDate.HasValue)
        {
            query = query.Where(al => al.CreatedAt >= filter.StartDate.Value);
        }
        if (filter.EndDate.HasValue)
        {
            query = query.Where(al => al.CreatedAt <= filter.EndDate.Value);
        }
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(al => al.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(al => new ActionLogDto
            {
                Id = al.Id,
                UserId = al.UserId,
                UserName = $"{al.User.FirstName} {al.User.LastName}",
                ActionType = al.ActionType.ToString(),
                EntityType = al.EntityType,
                EntityId = al.EntityId,
                Description = al.Description,
                IpAddress = al.IpAddress,
                CreatedAt = al.CreatedAt
            })
            .ToListAsync();
        return new ActionLogListResponseDto
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
        };
    }
    public async Task<List<ActionLogDto>> GetUserActionLogsAsync(int userId)
    {
        return await _context.ActionLogs
            .Where(al => al.UserId == userId)
            .Include(al => al.User)
            .OrderByDescending(al => al.CreatedAt)
            .Select(al => new ActionLogDto
            {
                Id = al.Id,
                UserId = al.UserId,
                UserName = $"{al.User.FirstName} {al.User.LastName}",
                ActionType = al.ActionType.ToString(),
                EntityType = al.EntityType,
                EntityId = al.EntityId,
                Description = al.Description,
                IpAddress = al.IpAddress,
                CreatedAt = al.CreatedAt
            })
            .ToListAsync();
    }
}

