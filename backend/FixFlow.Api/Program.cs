using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var envFilePath = Path.Combine(builder.Environment.ContentRootPath, ".env");

if (File.Exists(envFilePath))
{
    DotNetEnv.Env.NoClobber().Load(envFilePath);
    builder.Configuration.AddEnvironmentVariables();
}

builder.Services.AddControllers();
builder.Services.AddDbContext<FixFlow.Api.Data.FixFlowDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("EquipmentDatabase")
        ?? throw new InvalidOperationException(
            "Connection string 'EquipmentDatabase' is not configured.")));

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()
    ?? throw new InvalidOperationException("Cors:AllowedOrigins is not configured.");
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()));

var app = builder.Build();

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
