using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System;
using System.Threading;
using RecruitmentAgency.API.Data;
using RecruitmentAgency.API.Services;
using RecruitmentAgency.API.Models;
using RecruitmentAgency.API.Helpers;
using AutoMapper;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Recruitment Agency API",
        Version = "v1",
        Description = "API для системы управления кадровым агентством"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
var server = Environment.GetEnvironmentVariable("DB_SERVER") ?? "mysql";
var database = Environment.GetEnvironmentVariable("DB_DATABASE") ?? "RecruitmentAgencyDB";
var user = Environment.GetEnvironmentVariable("DB_USER") ?? "appuser";
var password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "apppassword";
var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "3306";
var connectionString = $"Server={server};Database={database};User={user};Password={password};Port={port};";
if (string.IsNullOrEmpty(connectionString) || connectionString.Contains("localhost"))
{
    connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
        ?? builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? builder.Configuration["ConnectionStrings:DefaultConnection"]
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}
Console.WriteLine($"[DEBUG] Connection string: {connectionString?.Replace("Password=apppassword", "Password=***")}");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 33)), 
        mysqlOptions =>
        {
            mysqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        });
    options.EnableSensitiveDataLogging();
});
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IVacancyService, VacancyService>();
builder.Services.AddScoped<IApplicantProfileService, ApplicantProfileService>();
builder.Services.AddScoped<IAccessRightService, AccessRightService>();
builder.Services.AddScoped<IPersonnelSelectionService, PersonnelSelectionService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<IActionLogService, ActionLogService>();
builder.Services.AddScoped<IVacancyApplicationService, VacancyApplicationService>();
builder.WebHost.UseKestrel(options =>
{
    options.ListenAnyIP(80);
});
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    if (!context.Users.Any(u => u.Email == "admin@agency.ru"))
    {
        context.Users.Add(new User
        {
            Email = "admin@agency.ru",
            PasswordHash = PasswordHasher.HashPassword("admin123"),
            FirstName = "Администратор",
            LastName = "Системы",
            Phone = "+7 (999) 999-99-99",
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        });
        context.SaveChanges();
        Console.WriteLine("[INFO] Admin user created: admin@agency.ru / admin123");
    }
    if (!context.Users.Any(u => u.Email == "manager@agency.ru"))
    {
        context.Users.Add(new User
        {
            Email = "manager@agency.ru",
            PasswordHash = PasswordHasher.HashPassword("manager123"),
            FirstName = "Иван",
            LastName = "Менеджеров",
            MiddleName = "Петрович",
            Phone = "+7 (999) 888-77-66",
            Role = UserRole.Manager,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        });
        context.SaveChanges();
        Console.WriteLine("[INFO] Manager user created: manager@agency.ru / manager123");
    }
}
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Recruitment Agency API v1");
    c.RoutePrefix = "swagger";
});
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
