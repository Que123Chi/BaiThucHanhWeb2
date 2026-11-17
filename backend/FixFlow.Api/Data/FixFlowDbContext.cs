using FixFlow.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FixFlow.Api.Data;

public sealed class FixFlowDbContext(DbContextOptions<FixFlowDbContext> options) : DbContext(options)
{
    public DbSet<Equipment> Equipment => Set<Equipment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var equipment = modelBuilder.Entity<Equipment>();

        equipment.ToTable("dotnet_equipment");
        equipment.HasKey(item => item.Id);
        equipment.Property(item => item.Name).HasMaxLength(120).IsRequired();
        equipment.Property(item => item.Category).HasMaxLength(80).IsRequired();
        equipment.Property(item => item.Location).HasMaxLength(120).IsRequired();
        equipment.Property(item => item.Status).HasMaxLength(40).IsRequired();
        equipment.Property(item => item.CreatedAtUtc)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}
