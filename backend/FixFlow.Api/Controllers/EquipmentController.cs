using FixFlow.Api.Data;
using FixFlow.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FixFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class EquipmentController(FixFlowDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Equipment>>> GetAll(CancellationToken cancellationToken)
    {
        var equipment = await dbContext.Equipment
            .AsNoTracking()
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);

        return Ok(equipment);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Equipment>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var equipment = await dbContext.Equipment.FindAsync([id], cancellationToken);
        return equipment is null ? NotFound() : Ok(equipment);
    }

    [HttpPost]
    public async Task<ActionResult<Equipment>> Create(Equipment equipment, CancellationToken cancellationToken)
    {
        equipment.Id = Guid.NewGuid();
        equipment.CreatedAtUtc = DateTime.UtcNow;
        dbContext.Equipment.Add(equipment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = equipment.Id }, equipment);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Equipment input, CancellationToken cancellationToken)
    {
        var equipment = await dbContext.Equipment.FindAsync([id], cancellationToken);
        if (equipment is null)
        {
            return NotFound();
        }

        equipment.Name = input.Name;
        equipment.Category = input.Category;
        equipment.Location = input.Location;
        equipment.Status = input.Status;
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var equipment = await dbContext.Equipment.FindAsync([id], cancellationToken);
        if (equipment is null)
        {
            return NotFound();
        }

        dbContext.Equipment.Remove(equipment);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
