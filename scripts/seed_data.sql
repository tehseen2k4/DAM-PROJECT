/*
    Seed Data Script
    Populates the database with initial records for testing.
*/

USE [HostelDB];
GO

-- Insert Hostels
INSERT INTO Hostels (HostelName, GenderType) VALUES 
('Jinnah Hostel', 'Male'),
('Fatima Hostel', 'Female'),
('Iqbal Hostel', 'Male');

-- Insert Students
INSERT INTO Students (FullName, Email, Gender, Phone) VALUES 
('Ali Khan', 'ali@example.com', 'Male', '03001112223'),
('Sara Ahmed', 'sara@example.com', 'Female', '03004445556'),
('Zainab Bibi', 'zainab@example.com', 'Female', '03007778889'),
('Osman Ghani', 'osman@example.com', 'Male', '03009990001');

-- Insert Rooms (for Jinnah Hostel)
INSERT INTO Rooms (RoomNumber, Capacity, HostelID) VALUES 
('J-101', 2, 1),
('J-102', 2, 1);

-- Insert Rooms (for Fatima Hostel)
INSERT INTO Rooms (RoomNumber, Capacity, HostelID) VALUES 
('F-201', 2, 2);

-- Insert Beds
INSERT INTO Beds (BedNumber, RoomID, Status) VALUES 
('B1', 1, 'Available'),
('B2', 1, 'Available'),
('B3', 2, 'Available'),
('B4', 2, 'Available'),
('B1', 3, 'Available'),
('B2', 3, 'Available');

PRINT 'Seed data inserted successfully.';
GO
