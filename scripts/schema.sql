/*
    Hostel Room Allocation System - Database Schema
    Target: Microsoft SQL Server 2022
*/

USE [master];
GO

-- Drop database if exists to start fresh
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'HostelDB')
BEGIN
    ALTER DATABASE [HostelDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [HostelDB];
END
GO

CREATE DATABASE [HostelDB];
GO

USE [HostelDB];
GO

-- 1. Students Table
CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Gender NVARCHAR(10) CHECK (Gender IN ('Male', 'Female')),
    Phone NVARCHAR(15)
);

-- 2. Hostels Table
CREATE TABLE Hostels (
    HostelID INT PRIMARY KEY IDENTITY(1,1),
    HostelName NVARCHAR(100) NOT NULL,
    GenderType NVARCHAR(10) CHECK (GenderType IN ('Male', 'Female', 'Mixed'))
);

-- 3. Rooms Table
CREATE TABLE Rooms (
    RoomID INT PRIMARY KEY IDENTITY(1,1),
    RoomNumber NVARCHAR(10) NOT NULL,
    Capacity INT DEFAULT 4,
    HostelID INT FOREIGN KEY REFERENCES Hostels(HostelID)
);

-- 4. Beds Table
CREATE TABLE Beds (
    BedID INT PRIMARY KEY IDENTITY(1,1),
    BedNumber NVARCHAR(10) NOT NULL,
    RoomID INT FOREIGN KEY REFERENCES Rooms(RoomID),
    Status NVARCHAR(20) DEFAULT 'Available' CHECK (Status IN ('Available', 'Occupied', 'Maintenance'))
);

-- 5. Allocations Table
CREATE TABLE Allocations (
    AllocationID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT UNIQUE FOREIGN KEY REFERENCES Students(StudentID),
    BedID INT FOREIGN KEY REFERENCES Beds(BedID),
    AllocationDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Active' CHECK (Status IN ('Active', 'Cancelled', 'Completed'))
);

-- 6. Payments Table
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    AllocationID INT FOREIGN KEY REFERENCES Allocations(AllocationID),
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentStatus NVARCHAR(20) DEFAULT 'Pending' CHECK (PaymentStatus IN ('Pending', 'Paid', 'Failed'))
);

-- 7. WaitingList Table
CREATE TABLE WaitingList (
    WaitingID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT FOREIGN KEY REFERENCES Students(StudentID),
    HostelID INT FOREIGN KEY REFERENCES Hostels(HostelID),
    ApplicationDate DATETIME DEFAULT GETDATE()
);
GO

-- Create Indexes for Performance Evaluation Phase
CREATE INDEX IX_Beds_Status ON Beds(Status);
CREATE INDEX IX_Allocations_StudentID ON Allocations(StudentID);
GO
