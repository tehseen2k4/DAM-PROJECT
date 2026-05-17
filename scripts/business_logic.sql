/*
    Hostel Room Allocation System - Business Logic
    Includes Stored Procedures and Triggers
*/

USE [HostelDB];
GO

-- 1. Stored Procedure to Allocate a Bed
-- This is a critical procedure for concurrency testing.
IF OBJECT_ID('sp_AllocateBed', 'P') IS NOT NULL
    DROP PROCEDURE sp_AllocateBed;
GO

CREATE PROCEDURE sp_AllocateBed
    @StudentID INT,
    @BedID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Start a transaction to ensure atomicity
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Check if student already has an active allocation
        IF EXISTS (SELECT 1 FROM Allocations WHERE StudentID = @StudentID AND Status = 'Active')
        BEGIN
            RAISERROR('Student already has an active allocation.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Check if the bed is available
        -- Note: In the concurrency testing phase, we will experiment with isolation levels here.
        DECLARE @CurrentStatus NVARCHAR(20);
        SELECT @CurrentStatus = Status FROM Beds WHERE BedID = @BedID;

        IF @CurrentStatus IS NULL OR @CurrentStatus <> 'Available'
        BEGIN
            RAISERROR('Selected bed is not available.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Perform the allocation
        INSERT INTO Allocations (StudentID, BedID, AllocationDate, Status)
        VALUES (@StudentID, @BedID, GETDATE(), 'Active');

        DECLARE @NewAllocationID INT = SCOPE_IDENTITY();

        -- Create a pending payment record
        INSERT INTO Payments (AllocationID, Amount, PaymentDate, PaymentStatus)
        VALUES (@NewAllocationID, @Amount, GETDATE(), 'Pending');

        -- Update the bed status
        -- Alternatively, this could be handled by a trigger
        UPDATE Beds SET Status = 'Occupied' WHERE BedID = @BedID;

        -- Commit the transaction if everything is successful
        COMMIT TRANSACTION;
        PRINT 'Bed allocated successfully.';
    END TRY
    BEGIN CATCH
        -- Rollback in case of any error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- 2. Trigger to Prevent Deleting a Student with Active Allocation
IF OBJECT_ID('trg_PreventDeleteStudentWithAllocation', 'TR') IS NOT NULL
    DROP TRIGGER trg_PreventDeleteStudentWithAllocation;
GO

CREATE TRIGGER trg_PreventDeleteStudentWithAllocation
ON Students
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (
        SELECT 1 
        FROM deleted d
        JOIN Allocations a ON d.StudentID = a.StudentID
        WHERE a.Status = 'Active'
    )
    BEGIN
        RAISERROR('Cannot delete a student with an active allocation.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    DELETE FROM Students WHERE StudentID IN (SELECT StudentID FROM deleted);
END;
GO

-- 3. Trigger to Auto-Update Bed Status on Allocation Cancellation
-- This handles synchronization if an allocation is cancelled manually.
IF OBJECT_ID('trg_UpdateBedStatusOnCancel', 'TR') IS NOT NULL
    DROP TRIGGER trg_UpdateBedStatusOnCancel;
GO

CREATE TRIGGER trg_UpdateBedStatusOnCancel
ON Allocations
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- If status changed to 'Cancelled' or 'Completed', set the bed to 'Available'
    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.AllocationID = d.AllocationID 
               WHERE i.Status IN ('Cancelled', 'Completed') AND d.Status = 'Active')
    BEGIN
        UPDATE b
        SET b.Status = 'Available'
        FROM Beds b
        JOIN inserted i ON b.BedID = i.BedID
        WHERE i.Status IN ('Cancelled', 'Completed');
    END
END;
GO

PRINT 'Business logic (Stored Procedures and Triggers) created successfully.';
GO

-- 4. Function to Calculate Total Dues
CREATE FUNCTION fn_CalculateTotalDues(@AllocationID INT)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @TotalDues DECIMAL(10,2);

    SELECT @TotalDues = ISNULL(SUM(Amount), 0)
    FROM Payments   
    WHERE AllocationID = @AllocationID
    AND PaymentStatus <> 'Paid';

    RETURN ISNULL(@TotalDues, 0);
END;
GO

