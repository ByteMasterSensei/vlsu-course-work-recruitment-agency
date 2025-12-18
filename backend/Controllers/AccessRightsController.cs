using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.AccessRight;
using RecruitmentAgency.API.Services;
using System.Security.Claims;
namespace RecruitmentAgency.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AccessRightsController : ControllerBase
{
    private readonly IAccessRightService _accessRightService;
    public AccessRightsController(IAccessRightService accessRightService)
    {
        _accessRightService = accessRightService;
    }
    [HttpGet]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<List<AccessRightDto>>> GetAllAccessRights()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var accessRights = await _accessRightService.GetAllAccessRightsAsync(userId);
        return Ok(accessRights);
    }
    [HttpPost]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<AccessRightDto>> GrantAccess([FromBody] CreateAccessRightDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var accessRight = await _accessRightService.GrantAccessAsync(dto, userId);
        return Ok(accessRight);
    }
    [HttpDelete("{id}")]
    [Authorize(Roles = "Manager,Admin")]
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
    [HttpGet("applicants")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<List<ApplicantForAccessDto>>> GetApplicantsForAccess()
    {
        var applicants = await _accessRightService.GetApplicantsForAccessAsync();
        return Ok(applicants);
    }
}
