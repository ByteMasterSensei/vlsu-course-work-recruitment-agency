using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.VacancyApplication;
using RecruitmentAgency.API.Services;
using System.Security.Claims;

namespace RecruitmentAgency.API.Controllers;

[ApiController]
[Route("api/vacancy-applications")]
[Authorize]
public class VacancyApplicationsController : ControllerBase
{
    private readonly IVacancyApplicationService _applicationService;
    private readonly IActionLogService _actionLogService;

    public VacancyApplicationsController(
        IVacancyApplicationService applicationService,
        IActionLogService actionLogService)
    {
        _applicationService = applicationService;
        _actionLogService = actionLogService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    /// <summary>
    /// Подать отклик на вакансию
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateApplication([FromBody] CreateApplicationDto dto)
    {
        var userId = GetUserId();
        var result = await _applicationService.CreateApplicationAsync(dto, userId);

        if (result == null)
            return BadRequest(new { message = "Не удалось подать отклик. Проверьте, что профиль активен и отклик еще не подан." });

        await _actionLogService.LogActionAsync(
            userId,
            "Create",
            "VacancyApplication",
            result.Id,
            $"Подан отклик на вакансию: {result.VacancyTitle}"
        );

        return Ok(result);
    }

    /// <summary>
    /// Получить мои отклики
    /// </summary>
    [HttpGet("my")]
    public async Task<ActionResult<List<VacancyApplicationDto>>> GetMyApplications()
    {
        var userId = GetUserId();
        var applications = await _applicationService.GetMyApplicationsAsync(userId);
        return Ok(applications);
    }

    /// <summary>
    /// Получить отклики на вакансию (для менеджера)
    /// </summary>
    [HttpGet("vacancy/{vacancyId}")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<List<VacancyApplicationDto>>> GetApplicationsForVacancy(int vacancyId)
    {
        var applications = await _applicationService.GetApplicationsForVacancyAsync(vacancyId);
        return Ok(applications);
    }

    /// <summary>
    /// Получить отклик по ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<VacancyApplicationDto>> GetApplication(int id)
    {
        var application = await _applicationService.GetApplicationByIdAsync(id);
        if (application == null)
            return NotFound();

        return Ok(application);
    }

    /// <summary>
    /// Обновить статус отклика (для менеджера)
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
    {
        var userId = GetUserId();
        var result = await _applicationService.UpdateApplicationStatusAsync(id, dto.Status, userId);

        if (!result)
            return BadRequest(new { message = "Не удалось обновить статус отклика" });

        await _actionLogService.LogActionAsync(
            userId,
            "Update",
            "VacancyApplication",
            id,
            $"Обновлен статус отклика: {dto.Status}"
        );

        return Ok(new { message = "Статус отклика обновлен" });
    }

    /// <summary>
    /// Отозвать отклик (для соискателя)
    /// </summary>
    [HttpPost("{id}/withdraw")]
    public async Task<IActionResult> WithdrawApplication(int id)
    {
        var userId = GetUserId();
        var result = await _applicationService.WithdrawApplicationAsync(id, userId);

        if (!result)
            return BadRequest(new { message = "Не удалось отозвать отклик" });

        await _actionLogService.LogActionAsync(
            userId,
            "Update",
            "VacancyApplication",
            id,
            "Отклик отозван"
        );

        return Ok(new { message = "Отклик отозван" });
    }
}
