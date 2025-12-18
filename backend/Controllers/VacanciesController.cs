using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.Vacancy;
using RecruitmentAgency.API.Models;
using RecruitmentAgency.API.Services;
using System.Security.Claims;
namespace RecruitmentAgency.API.Controllers;
[ApiController]
[Route("api/vacancies")]
public class VacanciesController : ControllerBase
{
    private readonly IVacancyService _vacancyService;
    public VacanciesController(IVacancyService vacancyService)
    {
        _vacancyService = vacancyService;
    }
    [HttpGet]
    public async Task<ActionResult<VacancyListResponseDto>> GetVacancies([FromQuery] VacancyFilterDto filter)
    {
        var result = await _vacancyService.GetVacanciesAsync(filter);
        return Ok(result);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<VacancyDto>> GetVacancy(int id)
    {
        var vacancy = await _vacancyService.GetVacancyByIdAsync(id);
        if (vacancy == null)
        {
            return NotFound();
        }
        return Ok(vacancy);
    }
    [HttpPost]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<VacancyDto>> CreateVacancy([FromBody] CreateVacancyDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var vacancy = await _vacancyService.CreateVacancyAsync(dto, userId);
        return CreatedAtAction(nameof(GetVacancy), new { id = vacancy.Id }, vacancy);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<VacancyDto>> UpdateVacancy(int id, [FromBody] UpdateVacancyDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var vacancy = await _vacancyService.UpdateVacancyAsync(id, dto, userId);
        if (vacancy == null)
        {
            return NotFound();
        }
        return Ok(vacancy);
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<IActionResult> DeleteVacancy(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var deleted = await _vacancyService.DeleteVacancyAsync(id, userId);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
