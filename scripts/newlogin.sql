USE [master];
GO

-- 1. Create a fresh LOGIN for the whole server
-- I renamed it to 'hostel_admin' to avoid any old "ghost" errors
IF EXISTS (SELECT name FROM sys.server_principals WHERE name = 'hostel_admin')
    DROP LOGIN hostel_admin;
GO

CREATE LOGIN hostel_admin WITH PASSWORD = 'tehseen2k4', CHECK_POLICY = OFF;
GO

USE [HostelDB];
GO

-- 2. Create the USER in the specifically for this database
IF EXISTS (SELECT name FROM sys.database_principals WHERE name = 'hostel_admin')
    DROP USER hostel_admin;
GO

CREATE USER hostel_admin FOR LOGIN hostel_admin;
GO

-- 3. Give this user full control of the Hostel database
ALTER ROLE db_owner ADD MEMBER hostel_admin;
GO
