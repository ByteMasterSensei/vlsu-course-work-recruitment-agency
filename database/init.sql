CREATE DATABASE `RecruitmentAgencyDB` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `RecruitmentAgencyDB`;

CREATE TABLE `Users` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(100) NOT NULL,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `FirstName` VARCHAR(100) NOT NULL,
    `LastName` VARCHAR(100) NOT NULL,
    `MiddleName` VARCHAR(100) NULL,
    `Phone` VARCHAR(20) NULL,
    `Role` INT NOT NULL DEFAULT 0,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `IX_Users_Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Vacancies` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Title` VARCHAR(200) NOT NULL,
    `CompanyName` VARCHAR(200) NOT NULL,
    `CompanyINN` VARCHAR(20) NULL,
    `Description` TEXT NOT NULL,
    `Requirements` TEXT NULL,
    `WorkingConditions` TEXT NULL,
    `SalaryRange` VARCHAR(100) NULL,
    `EmploymentType` INT NOT NULL DEFAULT 0,
    `Status` INT NOT NULL DEFAULT 0,
    `ContactPerson` VARCHAR(100) NULL,
    `ContactEmail` VARCHAR(100) NULL,
    `ContactPhone` VARCHAR(20) NULL,
    `PublishedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ExpiresAt` DATETIME(6) NULL,
    `CreatedByUserId` INT NOT NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_Vacancies_CreatedByUserId` (`CreatedByUserId`),
    INDEX `IX_Vacancies_Status` (`Status`),
    INDEX `IX_Vacancies_PublishedAt` (`PublishedAt`),
    CONSTRAINT `FK_Vacancies_Users_CreatedByUserId` 
        FOREIGN KEY (`CreatedByUserId`) 
        REFERENCES `Users` (`Id`) 
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ApplicantProfiles` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `UserId` INT NOT NULL,
    `DesiredPosition` VARCHAR(200) NULL,
    `DesiredSalary` VARCHAR(100) NULL,
    `AdditionalInfo` TEXT NULL,
    `ReadyToRelocate` BOOLEAN NOT NULL DEFAULT FALSE,
    `ReadyForBusinessTrips` BOOLEAN NOT NULL DEFAULT FALSE,
    `Status` INT NOT NULL DEFAULT 0,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_ApplicantProfiles_UserId` (`UserId`),
    INDEX `IX_ApplicantProfiles_Status` (`Status`),
    CONSTRAINT `FK_ApplicantProfiles_Users_UserId` 
        FOREIGN KEY (`UserId`) 
        REFERENCES `Users` (`Id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Educations` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `ApplicantProfileId` INT NOT NULL,
    `Institution` VARCHAR(200) NOT NULL,
    `Specialty` VARCHAR(200) NOT NULL,
    `Degree` VARCHAR(50) NULL,
    `GraduationYear` INT NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_Educations_ApplicantProfileId` (`ApplicantProfileId`),
    CONSTRAINT `FK_Educations_ApplicantProfiles_ApplicantProfileId` 
        FOREIGN KEY (`ApplicantProfileId`) 
        REFERENCES `ApplicantProfiles` (`Id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `WorkExperiences` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `ApplicantProfileId` INT NOT NULL,
    `CompanyName` VARCHAR(200) NOT NULL,
    `Position` VARCHAR(200) NOT NULL,
    `Responsibilities` TEXT NULL,
    `StartDate` DATETIME(6) NOT NULL,
    `EndDate` DATETIME(6) NULL,
    `IsCurrentJob` BOOLEAN NOT NULL DEFAULT FALSE,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_WorkExperiences_ApplicantProfileId` (`ApplicantProfileId`),
    CONSTRAINT `FK_WorkExperiences_ApplicantProfiles_ApplicantProfileId` 
        FOREIGN KEY (`ApplicantProfileId`) 
        REFERENCES `ApplicantProfiles` (`Id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ApplicantSkills` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `ApplicantProfileId` INT NOT NULL,
    `SkillName` VARCHAR(100) NOT NULL,
    `SkillLevel` VARCHAR(50) NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_ApplicantSkills_ApplicantProfileId` (`ApplicantProfileId`),
    CONSTRAINT `FK_ApplicantSkills_ApplicantProfiles_ApplicantProfileId` 
        FOREIGN KEY (`ApplicantProfileId`) 
        REFERENCES `ApplicantProfiles` (`Id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `AccessRights` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `UserId` INT NOT NULL,
    `GrantedByUserId` INT NOT NULL,
    `AccessType` INT NOT NULL,
    `ExpiresAt` DATETIME(6) NULL,
    `IsUsed` BOOLEAN NOT NULL DEFAULT FALSE,
    `UsedAt` DATETIME(6) NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_AccessRights_UserId` (`UserId`),
    INDEX `IX_AccessRights_GrantedByUserId` (`GrantedByUserId`),
    INDEX `IX_AccessRights_ExpiresAt` (`ExpiresAt`),
    CONSTRAINT `FK_AccessRights_Users_UserId` 
        FOREIGN KEY (`UserId`) 
        REFERENCES `Users` (`Id`) 
        ON DELETE RESTRICT,
    CONSTRAINT `FK_AccessRights_Users_GrantedByUserId` 
        FOREIGN KEY (`GrantedByUserId`) 
        REFERENCES `Users` (`Id`) 
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ActionLogs` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `UserId` INT NOT NULL,
    `ActionType` INT NOT NULL,
    `EntityType` VARCHAR(100) NULL,
    `EntityId` INT NULL,
    `Description` TEXT NULL,
    `IpAddress` VARCHAR(45) NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_ActionLogs_UserId` (`UserId`),
    INDEX `IX_ActionLogs_CreatedAt` (`CreatedAt`),
    INDEX `IX_ActionLogs_EntityType_EntityId` (`EntityType`, `EntityId`),
    CONSTRAINT `FK_ActionLogs_Users_UserId` 
        FOREIGN KEY (`UserId`) 
        REFERENCES `Users` (`Id`) 
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `UserSessions` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `UserId` INT NOT NULL,
    `Token` VARCHAR(500) NOT NULL,
    `RefreshToken` VARCHAR(500) NULL,
    `ExpiresAt` DATETIME(6) NOT NULL,
    `IpAddress` VARCHAR(45) NULL,
    `UserAgent` VARCHAR(500) NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (`Id`),
    INDEX `IX_UserSessions_UserId` (`UserId`),
    INDEX `IX_UserSessions_Token` (`Token`),
    INDEX `IX_UserSessions_ExpiresAt` (`ExpiresAt`),
    CONSTRAINT `FK_UserSessions_Users_UserId` 
        FOREIGN KEY (`UserId`) 
        REFERENCES `Users` (`Id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `FavoriteVacancies` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `UserId` INT NOT NULL,
    `VacancyId` INT NOT NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_FavoriteVacancies_UserId` (`UserId`),
    INDEX `IX_FavoriteVacancies_VacancyId` (`VacancyId`),
    UNIQUE INDEX `IX_FavoriteVacancies_UserId_VacancyId` (`UserId`, `VacancyId`),
    CONSTRAINT `FK_FavoriteVacancies_Users_UserId` 
        FOREIGN KEY (`UserId`) 
        REFERENCES `Users` (`Id`) 
        ON DELETE CASCADE,
    CONSTRAINT `FK_FavoriteVacancies_Vacancies_VacancyId` 
        FOREIGN KEY (`VacancyId`) 
        REFERENCES `Vacancies` (`Id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Users` (`Email`, `PasswordHash`, `FirstName`, `LastName`, `Phone`, `Role`, `CreatedAt`, `IsActive`)
VALUES (
    'admin@agency.ru',
    'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=',
    'Администратор',
    'Системы',
    '+7 (999) 999-99-99',
    3,
    UTC_TIMESTAMP(6),
    TRUE
);

INSERT INTO `Users` (`Email`, `PasswordHash`, `FirstName`, `LastName`, `MiddleName`, `Phone`, `Role`, `CreatedAt`, `IsActive`)
VALUES (
    'manager@agency.ru',
    'jZae727K08KaOmKSGFOeQvLJwrcuSw==',
    'Иван',
    'Менеджеров',
    'Петрович',
    '+7 (999) 888-77-66',
    2,
    UTC_TIMESTAMP(6),
    TRUE
);

CREATE TABLE `VacancyApplications` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `ApplicantProfileId` INT NOT NULL,
    `VacancyId` INT NOT NULL,
    `Status` INT NOT NULL DEFAULT 0,
    `CoverLetter` TEXT NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_VacancyApplications_ApplicantProfileId` (`ApplicantProfileId`),
    INDEX `IX_VacancyApplications_VacancyId` (`VacancyId`),
    UNIQUE INDEX `IX_VacancyApplications_ApplicantProfileId_VacancyId` (`ApplicantProfileId`, `VacancyId`),
    CONSTRAINT `FK_VacancyApplications_ApplicantProfiles_ApplicantProfileId` 
        FOREIGN KEY (`ApplicantProfileId`) 
        REFERENCES `ApplicantProfiles` (`Id`) 
        ON DELETE CASCADE,
    CONSTRAINT `FK_VacancyApplications_Vacancies_VacancyId` 
        FOREIGN KEY (`VacancyId`) 
        REFERENCES `Vacancies` (`Id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;