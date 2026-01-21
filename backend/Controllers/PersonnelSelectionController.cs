using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecruitmentAgency.API.DTOs.AccessRight;
using RecruitmentAgency.API.Services;
namespace RecruitmentAgency.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager,Admin")]
public class PersonnelSelectionController : ControllerBase
{
    private readonly IPersonnelSelectionService _personnelSelectionService;
    public PersonnelSelectionController(IPersonnelSelectionService personnelSelectionService)
    {
        _personnelSelectionService = personnelSelectionService;
    }
    [HttpPost("search")]
    public async Task<ActionResult<List<PersonnelSearchResultDto>>> SearchPersonnel([FromBody] PersonnelSearchDto searchDto)
    {
        var results = await _personnelSelectionService.SearchPersonnelAsync(searchDto);
        return Ok(results);
    }
}






