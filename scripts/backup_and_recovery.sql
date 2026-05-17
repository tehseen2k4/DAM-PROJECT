/*
    Backup and Recovery Strategy
    Learn how to protect data and recover from accidental deletion.
*/

USE [master];
GO

-- 1. Ensure the database is in FULL Recovery Model for point-in-time recovery
ALTER DATABASE [HostelDB] SET RECOVERY FULL;
GO

-- 2. Create the Baseline (FULL BACKUP)
-- Note: Replace 'C:\Temp\' with a real writable path on your PC (e.g., a folder you created)
PRINT '--- Running Full Backup ---';
BACKUP DATABASE [HostelDB] 
TO DISK = 'C:\Users\Shuaiauspxs\Desktop\DAM PROJECT\backups\HostelDB_Full.bak' 
WITH FORMAT, MEDIANAME = 'HostelBackups', NAME = 'Full Backup of HostelDB';
GO

USE [HostelDB];
GO

-- 3. Simulate Data Changes (Activity between backups)
INSERT INTO Students (FullName, Email, Gender, Phone) 
VALUES ('Disaster Test Student', 'temp@crash.com', 'Male', '000000');
GO

-- 4. Run a TRAN LOG BACKUP (Captures the change above)
PRINT '--- Running Transaction Log Backup ---';
BACKUP LOG [HostelDB] 
TO DISK = 'C:\Users\Shuaiauspxs\Desktop\DAM PROJECT\backups\HostelDB_Log1.trn' 
WITH NOFORMAT, NAME = 'Log Backup 1';
GO

-- 5. THE DISASTER: Accidental Deletion
-- We simulate someone deleting the new student by mistake.
DELETE FROM Students WHERE Email = 'temp@crash.com';
PRINT '--- DISASTER: Student "Disaster Test Student" has been deleted! ---';
GO

-- 6. THE RECOVERY
-- To recover, we must restore the Full Backup and then the Logs.
USE [master];
GO
-- Forcefully kick out users to allow restore
ALTER DATABASE [HostelDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

-- Restore Full Backup (WITH NORECOVERY because we have logs to apply)
RESTORE DATABASE [HostelDB] 
FROM DISK = 'C:\Users\Shuaiauspxs\Desktop\DAM PROJECT\backups\HostelDB_Full.bak' 
WITH REPLACE, NORECOVERY;

-- Restore the Log Backup (WITH RECOVERY to make it usable again)
RESTORE LOG [HostelDB] 
FROM DISK = 'C:\Users\Shuaiauspxs\Desktop\DAM PROJECT\backups\HostelDB_Log1.trn' 
WITH RECOVERY;

-- Allow users back in
ALTER DATABASE [HostelDB] SET MULTI_USER;
GO

-- 7. Verify Recovery
USE [HostelDB];
GO
PRINT '--- VERIFICATION: Checking if deleted student is back ---';
SELECT * FROM Students WHERE Email = 'temp@crash.com';
GO
