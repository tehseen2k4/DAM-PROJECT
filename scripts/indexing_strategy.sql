/*
    Enterprise Indexing Strategy
    Applying B-Tree Indexes to improve the performance of our heavy Next.js queries.
*/

USE [HostelDB];
GO

-- 1. Index for Public Hostel Search (getPublicHostels)
-- We frequently count Available beds per hostel. This covering index stops full table scans.
CREATE NONCLUSTERED INDEX IX_Beds_RoomID_Status 
ON Beds(RoomID, Status);
GO

CREATE NONCLUSTERED INDEX IX_Rooms_HostelID 
ON Rooms(HostelID);
GO

-- 2. Index for Student Bookings
-- Prevents slow lookups when checking if a student exists by email.
CREATE NONCLUSTERED INDEX IX_Students_Email 
ON Students(Email);
GO

-- 3. Composite Index for the Admin Dashboard (getRecentAllocations)
-- This query joins 5 tables! Indexes on Foreign Keys are critical here.
CREATE NONCLUSTERED INDEX IX_Allocations_Student_Bed 
ON Allocations(StudentID, BedID) 
INCLUDE (AllocationDate, Status);
GO

CREATE NONCLUSTERED INDEX IX_Payments_AllocationID
ON Payments(AllocationID)
INCLUDE (PaymentStatus, Amount);
GO

-- 4. Index for Role-Based Access Control
CREATE NONCLUSTERED INDEX IX_UserAccounts_Username
ON UserAccounts(Username)
INCLUDE (PasswordHash, Role, OwnerID);
GO

PRINT 'Enterprise Performance Indexes applied successfully. The database is now tuned for high-traffic student booking seasons!';
GO
