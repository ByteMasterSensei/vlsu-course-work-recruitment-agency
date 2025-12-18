using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.DTOs.Vacancy;
using RecruitmentAgency.API.Models;
using System.Security.Claims;

namespace RecruitmentAgency.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoriteVacanciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FavoriteVacanciesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<VacancyDto>>> GetFavorites()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

        var favorites = await _context.FavoriteVacancies
            .Where(fv => fv.UserId == userId)
            .Include(fv => fv.Vacancy)
            .Select(fv => new VacancyDto
            {
                Id = fv.Vacancy.Id,
                Title = fv.Vacancy.Title,
                CompanyName = fv.Vacancy.CompanyName,
                CompanyINN = fv.Vacancy.CompanyINN,
                Description = fv.Vacancy.Description,
                Requirements = fv.Vacancy.Requirements,
                WorkingConditions = fv.Vacancy.WorkingConditions,
                SalaryRange = fv.Vacancy.SalaryRange,
                EmploymentType = fv.Vacancy.EmploymentType.ToString(),
                Status = fv.Vacancy.Status.ToString(),
                ContactPerson = fv.Vacancy.ContactPerson,
                ContactEmail = fv.Vacancy.ContactEmail,
                ContactPhone = fv.Vacancy.ContactPhone,
                PublishedAt = fv.Vacancy.PublishedAt,
                ExpiresAt = fv.Vacancy.ExpiresAt,
                CreatedByUserId = fv.Vacancy.CreatedByUserId
            })
            .ToListAsync();

        return Ok(favorites);
    }

    [HttpPost("{vacancyId}")]
    public async Task<IActionResult> AddToFavorites(int vacancyId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

        // Check if already in favorites
        var exists = await _context.FavoriteVacancies
            .AnyAsync(fv => fv.UserId == userId && fv.VacancyId == vacancyId);

        if (exists)
        {
            return BadRequest(new { message = "Вакансия уже в избранном" });
        }

        // Check if vacancy exists
        var vacancyExists = await _context.Vacancies.AnyAsync(v => v.Id == vacancyId);
        if (!vacancyExists)
        {
            return NotFound();
        }

        var favorite = new FavoriteVacancy
        {
            UserId = userId,
            VacancyId = vacancyId,
            CreatedAt = DateTime.UtcNow
        };

        _context.FavoriteVacancies.Add(favorite);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Вакансия добавлена в избранное" });
    }

    [HttpDelete("{vacancyId}")]
    public async Task<IActionResult> RemoveFromFavorites(int vacancyId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

        var favorite = await _context.FavoriteVacancies
            .FirstOrDefaultAsync(fv => fv.UserId == userId && fv.VacancyId == vacancyId);

        if (favorite == null)
        {
            return NotFound();
        }

        _context.FavoriteVacancies.Remove(favorite);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

