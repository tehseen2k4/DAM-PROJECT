/*
    StaySync v2.0 - Maintenance & Issue Tracking System
    Adds capability for students to report issues and owners to manage repairs.
*/

USE [HostelDB];
GO

-- 1. Create the MaintenanceTickets Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MaintenanceTickets')
BEGIN
    CREATE TABLE MaintenanceTickets (
        TicketID INT PRIMARY KEY IDENTITY(1,1),
        HostelID INT FOREIGN KEY REFERENCES Hostels(HostelID),
        RoomID INT FOREIGN KEY REFERENCES Rooms(RoomID),
        ReportedByStudentID INT FOREIGN KEY REFERENCES Students(StudentID) NULL, -- Null if reported by admin
        IssueCategory NVARCHAR(50) NOT NULL CHECK (IssueCategory IN ('Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Other')),
        Description NVARCHAR(MAX) NOT NULL,
        PriorityLevel NVARCHAR(20) DEFAULT 'Medium' CHECK (PriorityLevel IN ('Low', 'Medium', 'High', 'Critical')),
        Status NVARCHAR(20) DEFAULT 'Open' CHECK (Status IN ('Open', 'In Progress', 'Resolved', 'Cancelled')),
        ReportedDate DATETIME DEFAULT GETDATE(),
        ResolvedDate DATETIME NULL,
        AdminNotes NVARCHAR(MAX) NULL
    );
    PRINT 'MaintenanceTickets table created successfully.';
END
ELSE
BEGIN
    PRINT 'MaintenanceTickets table already exists.';
END
GO

-- 2. Performance Indexing for the Maintenance Dashboard
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Maintenance_Hostel_Status')
BEGIN
    CREATE NONCLUSTERED INDEX IX_Maintenance_Hostel_Status 
    ON MaintenanceTickets(HostelID, Status)
    INCLUDE (IssueCategory, PriorityLevel, ReportedDate);
    PRINT 'Index IX_Maintenance_Hostel_Status created.';
END
GO

-- 3. Stored Procedure: Report a New Issue
CREATE OR ALTER PROCEDURE sp_ReportMaintenanceIssue
    @HostelID INT,
    @RoomID INT,
    @StudentID INT,
    @Category NVARCHAR(50),
    @Description NVARCHAR(MAX),
    @Priority NVARCHAR(20) = 'Medium'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO MaintenanceTickets (HostelID, RoomID, ReportedByStudentID, IssueCategory, Description, PriorityLevel)
        VALUES (@HostelID, @RoomID, @StudentID, @Category, @Description, @Priority);
        
        -- If Priority is Critical, automatically set the associated Beds in that room to 'Maintenance'
        -- so no new students can book them while it's broken.
        IF @Priority = 'Critical'
        BEGIN
            UPDATE Beds 
            SET Status = 'Maintenance' 
            WHERE RoomID = @RoomID AND Status = 'Available';
        END

        PRINT 'Issue reported successfully.';
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- 4. Stored Procedure: Resolve an Issue
CREATE OR ALTER PROCEDURE sp_ResolveMaintenanceIssue
    @TicketID INT,
    @AdminNotes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        DECLARE @RoomID INT;
        
        -- Update the ticket
        UPDATE MaintenanceTickets
        SET Status = 'Resolved',
            ResolvedDate = GETDATE(),
            AdminNotes = @AdminNotes
        WHERE TicketID = @TicketID AND Status <> 'Resolved';

        -- Get the RoomID from the ticket to fix the beds
        SELECT @RoomID = RoomID FROM MaintenanceTickets WHERE TicketID = @TicketID;

        -- Automatically make any 'Maintenance' beds in that room 'Available' again
        UPDATE Beds
        SET Status = 'Available'
        WHERE RoomID = @RoomID AND Status = 'Maintenance';

        PRINT 'Issue resolved and inventory restored.';
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- 5. Seed Some Dummy Data for Testing
IF NOT EXISTS (SELECT 1 FROM MaintenanceTickets)
BEGIN
    -- Assumes Hostel 1 and Room 1 exist from previous seed data
    EXEC sp_ReportMaintenanceIssue 1, 1, 1, 'Plumbing', 'The sink is leaking continuously.', 'High';
    EXEC sp_ReportMaintenanceIssue 1, 2, NULL, 'Electrical', 'AC is not turning on.', 'Critical';
    PRINT 'Seed maintenance tickets inserted.';
END
GO
