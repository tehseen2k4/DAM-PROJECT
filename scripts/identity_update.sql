/*
    Update Script: Identity & Multi-Tenancy
    Adds Owners and UserAccounts to support SaaS model.
*/

USE [HostelDB];
GO

-- 1. Owners Table (Hostel Business Owners)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Owners')
BEGIN
    CREATE TABLE Owners (
        OwnerID INT PRIMARY KEY IDENTITY(1,1),
        BusinessName NVARCHAR(100) NOT NULL,
        ContactPerson NVARCHAR(100),
        Email NVARCHAR(100) UNIQUE NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. UserAccounts (For Login - Owners and Admins)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserAccounts')
BEGIN
    CREATE TABLE UserAccounts (
        UserID INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(50) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL, -- We will store hashed passwords
        Role NVARCHAR(20) CHECK (Role IN ('Admin', 'Owner', 'Student')) DEFAULT 'Owner',
        OwnerID INT NULL FOREIGN KEY REFERENCES Owners(OwnerID), -- Null for system admins
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 3. Link Hostels to Owners
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'OwnerID')
BEGIN
    ALTER TABLE Hostels ADD OwnerID INT FOREIGN KEY REFERENCES Owners(OwnerID);
END
GO -- Important to end batch here so the next batch knows the column exists

-- 4. Initial Seed for Testing SaaS Login
-- We create one owner and one account for them
IF NOT EXISTS (SELECT * FROM Owners WHERE BusinessName = 'Hostel Empire')
BEGIN
    INSERT INTO Owners (BusinessName, ContactPerson, Email)
    VALUES ('Hostel Empire', 'Tehseen', 'admin@hostelempire.com');

    DECLARE @NewOwnerID INT = SCOPE_IDENTITY();

    -- Default password for testing: 'password123' (In production we use real hashes)
    INSERT INTO UserAccounts (Username, PasswordHash, Role, OwnerID)
    VALUES ('tehseen', 'password123', 'Owner', @NewOwnerID);
END
GO

-- 5. Update existing hostels (Separate batch)
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hostels') AND name = 'OwnerID')
BEGIN
    DECLARE @OwnerID INT = (SELECT TOP 1 OwnerID FROM Owners WHERE BusinessName = 'Hostel Empire');
    UPDATE Hostels SET OwnerID = @OwnerID WHERE OwnerID IS NULL;
END
GO
