/*
    StaySync v2.0 - Full Schema Extension
    Run this ONCE in SSMS to add Student Auth, Hostel Amenities, and Archiving.
*/

USE [HostelDB];
GO

-- ============================================================
-- 1. Add Student Auth to UserAccounts
-- Students get their own login now
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM UserAccounts WHERE Role = 'Student')
BEGIN
    -- Add a StudentID FK column to UserAccounts
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('UserAccounts') AND name = 'StudentID')
    BEGIN
        ALTER TABLE UserAccounts ADD StudentID INT NULL FOREIGN KEY REFERENCES Students(StudentID);
        PRINT 'StudentID column added to UserAccounts.';
    END

    -- Create a demo student account (student1 / student123)
    -- First insert the student
    DECLARE @StudentID INT;
    IF NOT EXISTS (SELECT 1 FROM Students WHERE Email = 'student1@university.edu')
    BEGIN
        INSERT INTO Students (FullName, Email, Gender, Phone)
        VALUES ('Ali Hassan', 'student1@university.edu', 'Male', '03001234567');
        SET @StudentID = SCOPE_IDENTITY();
    END
    ELSE
    BEGIN
        SELECT @StudentID = StudentID FROM Students WHERE Email = 'student1@university.edu';
    END

    IF NOT EXISTS (SELECT 1 FROM UserAccounts WHERE Username = 'student1')
    BEGIN
        -- Use EXEC so SQL Server resolves the column name at runtime,
        -- not at compile time (when StudentID might not exist yet).
        EXEC('INSERT INTO UserAccounts (Username, PasswordHash, Role, StudentID) VALUES (''student1'', ''student123'', ''Student'', ' + @StudentID + ')');
        PRINT 'Demo student account created: student1 / student123';
    END
END
GO

-- ============================================================
-- 2. Add Location & Amenities to Hostels table
-- For Advanced Search & Filters feature
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'City')
BEGIN
    ALTER TABLE Hostels ADD City NVARCHAR(100) DEFAULT 'Lahore';
    PRINT 'City column added to Hostels.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'Address')
BEGIN
    ALTER TABLE Hostels ADD Address NVARCHAR(255) NULL;
    PRINT 'Address column added to Hostels.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'HasWifi')
BEGIN
    ALTER TABLE Hostels ADD HasWifi BIT DEFAULT 1;
    PRINT 'HasWifi column added to Hostels.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'HasAC')
BEGIN
    ALTER TABLE Hostels ADD HasAC BIT DEFAULT 0;
    PRINT 'HasAC column added to Hostels.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'HasLaundry')
BEGIN
    ALTER TABLE Hostels ADD HasLaundry BIT DEFAULT 0;
    PRINT 'HasLaundry column added to Hostels.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'MonthlyRent')
BEGIN
    ALTER TABLE Hostels ADD MonthlyRent DECIMAL(10,2) DEFAULT 5000.00;
    PRINT 'MonthlyRent column added to Hostels.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'IncludedServices')
BEGIN
    ALTER TABLE Hostels ADD IncludedServices NVARCHAR(500) DEFAULT 'Security, Water, Electricity';
    PRINT 'IncludedServices column added to Hostels.';
END
GO

-- Update existing hostels with sample data
UPDATE Hostels SET City = 'Lahore', HasWifi = 1, HasAC = 0, HasLaundry = 1, MonthlyRent = 5000, IncludedServices = 'Security, Water, Electricity';
GO

-- ============================================================
-- 3. Automated Data Archiving System
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Allocations_Archive')
BEGIN
    CREATE TABLE Allocations_Archive (
        ArchiveID INT PRIMARY KEY IDENTITY(1,1),
        OriginalAllocationID INT NOT NULL,
        StudentID INT,
        BedID INT,
        AllocationDate DATETIME,
        Status NVARCHAR(20),
        PaymentID INT,
        Amount DECIMAL(10,2),
        PaymentStatus NVARCHAR(20),
        ArchivedAt DATETIME DEFAULT GETDATE()
    );
    PRINT 'Allocations_Archive table created.';
END
GO

-- Stored Procedure for Archiving old completed/cancelled records
CREATE OR ALTER PROCEDURE sp_ArchiveOldAllocations
    @OlderThanDays INT = 365  -- Default: archive records older than 1 year
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @CutoffDate DATETIME = DATEADD(DAY, -@OlderThanDays, GETDATE());
        DECLARE @ArchivedCount INT = 0;

        -- Move qualifying records to archive
        INSERT INTO Allocations_Archive (OriginalAllocationID, StudentID, BedID, AllocationDate, Status, PaymentID, Amount, PaymentStatus)
        SELECT 
            a.AllocationID, a.StudentID, a.BedID, a.AllocationDate, a.Status,
            p.PaymentID, p.Amount, p.PaymentStatus
        FROM Allocations a
        JOIN Payments p ON a.AllocationID = p.AllocationID
        WHERE a.Status IN ('Completed', 'Cancelled')
          AND a.AllocationDate < @CutoffDate;

        SET @ArchivedCount = @@ROWCOUNT;

        -- Delete archived payments first (FK constraint)
        DELETE FROM Payments
        WHERE AllocationID IN (
            SELECT a.AllocationID FROM Allocations a
            WHERE a.Status IN ('Completed', 'Cancelled')
              AND a.AllocationDate < @CutoffDate
        );

        -- Then delete archived allocations
        DELETE FROM Allocations
        WHERE Status IN ('Completed', 'Cancelled')
          AND AllocationDate < @CutoffDate;

        COMMIT TRANSACTION;
        PRINT CONCAT('Archiving complete. ', @ArchivedCount, ' records archived.');
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

PRINT '=== v2.0 Schema Extension Applied Successfully! ===';
GO
