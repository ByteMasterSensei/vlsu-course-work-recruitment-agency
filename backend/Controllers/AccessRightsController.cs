using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.AccessRight;
using RecruitmentAgency.API.Services;
using System.Security.Claims;

namespace RecruitmentAgency.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager,Admin")]
public class AccessRightsController : ControllerBase
{
    private readonly IAccessRightService _accessRightService;

    public AccessRightsController(IAccessRightService accessRightService)
    {
        _accessRightService = accessRightService;
    }

    [HttpGet]
    public async Task<ActionResult<List<AccessRightDto>>> GetAllAccessRights()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var accessRights = await _accessRightService.GetAllAccessRightsAsync(userId);
        return Ok(accessRights);
    }

    [HttpPost]
    public async Task<ActionResult<AccessRightDto>> GrantAccess([FromBody] CreateAccessRightDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var accessRight = await _accessRightService.GrantAccessAsync(dto, userId);
        return Ok(accessRight);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RevokeAccess(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var revoked = await _accessRightService.RevokeAccessAsync(id, userId);
        if (!revoked)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("check")]
    [Authorize]
    public async Task<ActionResult<bool>> CheckAccess()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var hasAccess = await _accessRightService.CheckAccessAsync(userId);
        return Ok(hasAccess);
    }
}

