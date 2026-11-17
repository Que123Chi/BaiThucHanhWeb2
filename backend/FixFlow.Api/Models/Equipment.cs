using System.ComponentModel.DataAnnotations;

namespace FixFlow.Api.Models;

public sealed class Equipment
{
    public Guid Id { get; set; }

    [Required]
    [StringLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(80)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [StringLength(120)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [StringLength(40)]
    public string Status { get; set; } = "Operational";

    public DateTime CreatedAtUtc { get; set; }
}
