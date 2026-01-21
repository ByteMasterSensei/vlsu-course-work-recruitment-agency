using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.User;
using RecruitmentAgency.API.Services;
namespace RecruitmentAgency.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserManagementService _userManagementService;
    public UsersController(IUserManagementService userManagementService)
    {
        _userManagementService = userManagementService;
    }
    [HttpGet]
    public async Task<ActionResult<List<UserManagementDto>>> GetAllUsers()
    {
        var users = await _userManagementService.GetAllUsersAsync();
        return Ok(users);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<UserManagementDto>> GetUser(int id)
    {
        var user = await _userManagementService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }
    [HttpPut("{id}")]
    public async Task<ActionResult<UserManagementDto>> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await _userManagementService.UpdateUserAsync(id, dto);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var deleted = await _userManagementService.DeleteUserAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}






