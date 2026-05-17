/*
    Performance Testing & Benchmarking
    Use this script to analyze query performance before and after indexing.
*/

USE [HostelDB];
GO

-- Enable IO and Time statistics to measure performance
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
GO

-- 1. A heavy analytical query (e.g., report of all male students allocated in Jinnah Hostel)
-- This query involves multiple joins.
PRINT '--- Testing Analytical Query ---';
SELECT 
    s.FullName, 
    s.Email, 
    h.HostelName, 
    r.RoomNumber, 
    b.BedNumber, 
    a.AllocationDate
FROM Students s
JOIN Allocations a ON s.StudentID = a.StudentID
JOIN Beds b ON a.BedID = b.BedID
JOIN Rooms r ON b.RoomID = r.RoomID
JOIN Hostels h ON r.HostelID = h.HostelID
WHERE h.HostelName = 'Jinnah Hostel' AND s.Gender = 'Male'
ORDER BY a.AllocationDate DESC;
GO

-- 2. Querying by a specific non-indexed column (e.g., Email)
PRINT '--- Testing Query by Email (Likely Table Scan initially) ---';
SELECT * FROM Students WHERE Email = 'ali@example.com';
GO

/*
    INSTRUCTIONS:
    1. Highlight and run the queries above.
    2. Go to the "Messages" tab in SSMS. Note the "logical reads".
    3. Press Ctrl+M to "Include Actual Execution Plan" and run again.
    4. Look for "Clustered Index Scan" (equivalent to Table Scan in this case).
*/
GO

-- Disable statistics
SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO
