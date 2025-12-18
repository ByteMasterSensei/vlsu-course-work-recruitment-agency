using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.User;
using RecruitmentAgency.API.Models;

namespace RecruitmentAgency.API.Services;

public interface IUserManagementService
{
    Task<List<UserManagementDto>> GetAllUsersAsync();
    Task<UserManagementDto?> GetUserByIdAsync(int id);
    Task<UserManagementDto?> UpdateUserAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteUserAsync(int id);
}

public class UserManagementService : IUserManagementService
{
    private readonly ApplicationDbContext _context;

    public UserManagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserManagementDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Select(u => new UserManagementDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                MiddleName = u.MiddleName,
                Phone = u.Phone,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt,
                IsActive = u.IsActive
            })
            .ToListAsync();
    }

    public async Task<UserManagementDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        return new UserManagementDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            MiddleName = user.MiddleName,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        };
    }

    public async Task<UserManagementDto?> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        if (!string.IsNullOrWhiteSpace(dto.FirstName)) user.FirstName = dto.FirstName;
        if (!string.IsNullOrWhiteSpace(dto.LastName)) user.LastName = dto.LastName;
        if (dto.MiddleName != null) user.MiddleName = dto.MiddleName;
        if (dto.Phone != null) user.Phone = dto.Phone;
        if (dto.Role.HasValue) user.Role = (UserRole)dto.Role.Value;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetUserByIdAsync(id);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }
}

