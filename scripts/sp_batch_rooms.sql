/*
    StaySync - Batch Room Creation Procedure
    DAM Focus: Procedural logic for high-efficiency inventory setups.
*/

CREATE OR ALTER PROCEDURE sp_BatchCreateRooms
    @HostelID INT,
    @StartRoom INT,
    @EndRoom INT,
    @Capacity INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @CurrentRoom INT = @StartRoom;
        
        WHILE @CurrentRoom <= @EndRoom
        BEGIN
            -- 1. Insert the Room
            INSERT INTO Rooms (RoomNumber, Capacity, HostelID)
            VALUES (CAST(@CurrentRoom AS NVARCHAR(10)), @Capacity, @HostelID);

            DECLARE @NewRoomID INT = SCOPE_IDENTITY();

            -- 2. Insert Beds for this Room
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
