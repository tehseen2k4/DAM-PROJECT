/*
    StaySync - Room Schema Enhancement (Robust Version)
    Target: SQL Server 2022
    
    NOTE: If you see red squiggly lines in SSMS, press Ctrl+Shift+R 
    to refresh the local cache. It won't affect execution.
*/

USE [HostelDB];
GO

-- 1. Ensure Columns Exist First
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Rooms') AND name = 'FloorNumber')
BEGIN
    ALTER TABLE Rooms ADD FloorNumber INT DEFAULT 0;
    PRINT 'Column FloorNumber added.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Rooms') AND name = 'RoomType')
BEGIN
    ALTER TABLE Rooms ADD RoomType NVARCHAR(20) DEFAULT 'Standard' CHECK (RoomType IN ('Standard', 'Premium', 'Deluxe'));
    PRINT 'Column RoomType added.';
END
GO

-- 2. Create/Update Batch Stored Procedure
-- We use a fresh GO here to ensures the columns are "visible" to the parser
CREATE OR ALTER PROCEDURE sp_BatchCreateRooms
    @HostelID INT,
    @StartRoom INT,
    @EndRoom INT,
    @Capacity INT,
    @FloorNumber INT = 0,
    @RoomType NVARCHAR(20) = 'Standard'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @CurrentRoom INT = @StartRoom;
        
        WHILE @CurrentRoom <= @EndRoom
        BEGIN
            -- Insert the Room using the new columns
            INSERT INTO Rooms (RoomNumber, Capacity, HostelID, FloorNumber, RoomType)
            VALUES (CAST(@CurrentRoom AS NVARCHAR(10)), @Capacity, @HostelID, @FloorNumber, @RoomType);

            DECLARE @NewRoomID INT = SCOPE_IDENTITY();

            -- Insert Beds for this Room
            DECLARE @CurrentBed INT = 1;
            WHILE @CurrentBed <= @Capacity
            BEGIN
                INSERT INTO Beds (BedNumber, RoomID, Status)
                VALUES (CAST(@CurrentBed AS NVARCHAR(10)), @NewRoomID, 'Available');
                
                SET @CurrentBed = @CurrentBed + 1;
            END

            SET @CurrentRoom = @CurrentRoom + 1;
        END

        COMMIT TRANSACTION;
        SELECT 'Success' AS Status, 'Rooms created successfully' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        SELECT 'Error' AS Status, @ErrorMessage AS Message;
    END CATCH
END
GO

PRINT 'Schema enhancement and stored procedure updated successfully.';
GO
