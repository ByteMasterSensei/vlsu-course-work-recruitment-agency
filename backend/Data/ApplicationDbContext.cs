using Microsoft.EntityFrameworkCore;
using RecruitmentAgency.API.Models;
namespace RecruitmentAgency.API.Data;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Vacancy> Vacancies { get; set; }
    public DbSet<ApplicantProfile> ApplicantProfiles { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<WorkExperience> WorkExperiences { get; set; }
    public DbSet<ApplicantSkill> ApplicantSkills { get; set; }
    public DbSet<AccessRight> AccessRights { get; set; }
    public DbSet<ActionLog> ActionLogs { get; set; }
    public DbSet<UserSession> UserSessions { get; set; }
    public DbSet<FavoriteVacancy> FavoriteVacancies { get; set; }
    public DbSet<VacancyApplication> VacancyApplications { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Role).HasConversion<int>();
        });
        modelBuilder.Entity<Vacancy>(entity =>
        {
            entity.HasIndex(e => e.CreatedByUserId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.PublishedAt);
            entity.Property(e => e.EmploymentType).HasConversion<int>();
            entity.Property(e => e.Status).HasConversion<int>();
        });
        modelBuilder.Entity<ApplicantProfile>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            entity.Property(e => e.Status).HasConversion<int>();
        });
        modelBuilder.Entity<Education>(entity =>
        {
            entity.HasIndex(e => e.ApplicantProfileId);
        });
        modelBuilder.Entity<WorkExperience>(entity =>
        {
            entity.HasIndex(e => e.ApplicantProfileId);
        });
        modelBuilder.Entity<ApplicantSkill>(entity =>
        {
            entity.HasIndex(e => e.ApplicantProfileId);
        });
        modelBuilder.Entity<AccessRight>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.GrantedByUserId);
            entity.HasIndex(e => e.ExpiresAt);
            entity.Property(e => e.AccessType).HasConversion<int>();
        });
        modelBuilder.Entity<ActionLog>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => new { e.EntityType, e.EntityId });
            entity.Property(e => e.ActionType).HasConversion<int>();
        });
        modelBuilder.Entity<UserSession>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Token);
            entity.HasIndex(e => e.ExpiresAt);
        });
        modelBuilder.Entity<FavoriteVacancy>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.VacancyId);
            entity.HasIndex(e => new { e.UserId, e.VacancyId }).IsUnique();
        });
        modelBuilder.Entity<VacancyApplication>(entity =>
        {
            entity.HasIndex(e => e.ApplicantProfileId);
            entity.HasIndex(e => e.VacancyId);
            entity.HasIndex(e => new { e.ApplicantProfileId, e.VacancyId }).IsUnique();
            entity.Property(e => e.Status).HasConversion<int>();
        });
        modelBuilder.Entity<Vacancy>()
            .HasOne(v => v.CreatedByUser)
            .WithMany(u => u.CreatedVacancies)
            .HasForeignKey(v => v.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ApplicantProfile>()
            .HasOne(ap => ap.User)
            .WithMany(u => u.ApplicantProfiles)
            .HasForeignKey(ap => ap.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<AccessRight>()
            .HasOne(ar => ar.User)
            .WithMany(u => u.ReceivedAccessRights)
            .HasForeignKey(ar => ar.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<AccessRight>()
            .HasOne(ar => ar.GrantedByUser)
            .WithMany(u => u.GrantedAccessRights)
            .HasForeignKey(ar => ar.GrantedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
