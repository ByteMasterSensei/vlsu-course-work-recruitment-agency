using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.User;
using RecruitmentAgency.API.Services;

namespace RecruitmentAgency.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ActionLogsController : ControllerBase
{
    private readonly IActionLogService _actionLogService;

    public ActionLogsController(IActionLogService actionLogService)
    {
        _actionLogService = actionLogService;
    }

    [HttpGet]
    public async Task<ActionResult<ActionLogListResponseDto>> GetActionLogs([FromQuery] ActionLogFilterDto filter)
    {
        var result = await _actionLogService.GetActionLogsAsync(filter);
        return Ok(result);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<ActionLogDto>>> GetUserActionLogs(int userId)
    {
        var logs = await _actionLogService.GetUserActionLogsAsync(userId);
        return Ok(logs);
    }
}

