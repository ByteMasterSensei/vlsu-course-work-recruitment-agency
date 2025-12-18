using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.ApplicantProfile;
using RecruitmentAgency.API.Services;
using System.Security.Claims;

namespace RecruitmentAgency.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicantProfilesController : ControllerBase
{
    private readonly IApplicantProfileService _profileService;

    public ApplicantProfilesController(IApplicantProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<ApplicantProfileDto>>> GetMyProfiles()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var profiles = await _profileService.GetMyProfilesAsync(userId);
        return Ok(profiles);
    }

    [HttpGet]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<ActionResult<List<ApplicantProfileDto>>> GetAllProfiles()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var profiles = await _profileService.GetAllProfilesAsync(userId);
        return Ok(profiles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicantProfileDto>> GetProfile(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var profile = await _profileService.GetProfileByIdAsync(id, userId);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(profile);
    }

    [HttpPost]
    public async Task<ActionResult<ApplicantProfileDto>> CreateProfile([FromBody] CreateApplicantProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var profile = await _profileService.CreateProfileAsync(dto, userId);
        return CreatedAtAction(nameof(GetProfile), new { id = profile.Id }, profile);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApplicantProfileDto>> UpdateProfile(int id, [FromBody] UpdateApplicantProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var profile = await _profileService.UpdateProfileAsync(id, dto, userId);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(profile);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var deleted = await _profileService.DeleteProfileAsync(id, userId);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        var updated = await _profileService.UpdateProfileStatusAsync(id, dto.Status, userId);
        if (!updated)
        {
            return NotFound();
        }
        return NoContent();
    }
}

public class UpdateStatusDto
{
    public int Status { get; set; }
}

