/*
    Isolation Level & Concurrency Monitoring Script
    Use this script in SSMS tabs while running the Python simulation.
*/

USE [HostelDB];
GO

-- 1. Check current locks in the system
-- Useful to see which transaction is blocking others.
SELECT 
    request_session_id AS SessionID,
    resource_type AS ResourceType,
    resource_description AS Description,
    request_mode AS Mode,
    request_status AS Status
FROM sys.dm_tran_locks
WHERE resource_database_id = DB_ID('HostelDB');

-- 2. Check waiting tasks (Blocking)
SELECT 
    waiting_task_address,
    session_id,
    wait_duration_ms,
    wait_type,
    blocking_session_id,
    resource_description
FROM sys.dm_os_waiting_tasks
WHERE blocking_session_id IS NOT NULL;

-- 3. Experiment with different isolation levels
-- Switch to SERIALIZABLE if you want to force more strict locking (and likely more deadlocks)
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- 4. Clean up script (Reset for next test)
-- Run this if you want to rerun the simulation from scratch.
/*
UPDATE Beds SET Status = 'Available';
DELETE FROM Payments;
DELETE FROM Allocations;
*/
GO
