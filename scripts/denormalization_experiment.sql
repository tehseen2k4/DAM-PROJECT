/*
    Normalization vs Denormalization Experiment
    Compare performance and storage trade-offs.
*/

USE [HostelDB];
GO

-- 1. Create a "Flat" Denormalized Table
-- This violates 3NF by repeating Student and Hostel details for every allocation.
IF OBJECT_ID('DenormalizedAllocations', 'U') IS NOT NULL
    DROP TABLE DenormalizedAllocations;
GO

SELECT 
    a.AllocationID,
    s.FullName AS StudentName,
    s.Email AS StudentEmail,
    h.HostelName,
    r.RoomNumber,
    b.BedNumber,
    a.AllocationDate,
    a.Status AS AllocationStatus
INTO DenormalizedAllocations
FROM Allocations a
JOIN Students s ON a.StudentID = s.StudentID
JOIN Beds b ON a.BedID = b.BedID
JOIN Rooms r ON b.RoomID = r.RoomID
JOIN Hostels h ON r.HostelID = h.HostelID;
GO

-- 2. Performance Comparison
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
GO

PRINT '--- Querying Normalized 3NF (Requires 5 Table Joins) ---';
SELECT StudentName, StudentEmail, HostelName FROM (
    SELECT 
        s.FullName AS StudentName, 
        s.Email AS StudentEmail, 
        h.HostelName
    FROM Students s
    JOIN Allocations a ON s.StudentID = a.StudentID
    JOIN Beds b ON a.BedID = b.BedID
    JOIN Rooms r ON b.RoomID = r.RoomID
    JOIN Hostels h ON r.HostelID = h.HostelID
) AS Res WHERE HostelName = 'Jinnah Hostel';
GO

PRINT '--- Querying Denormalized Table (No Joins) ---';
SELECT StudentName, StudentEmail, HostelName 
FROM DenormalizedAllocations 
WHERE HostelName = 'Jinnah Hostel';
GO

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO

/*
    OBSERVATIONS:
    1. Check "Logical Reads" in the Messages tab. The Denormalized query 
       should have fewer reads because it doesn't need to jump between multiple tables.
    2. Data Integrity Challenge: If you update a student's name in the 'Students' table,
       the 'DenormalizedAllocations' table will now have WRONG (stale) data.
       This is the primary disadvantage of denormalization!
*/
GO
