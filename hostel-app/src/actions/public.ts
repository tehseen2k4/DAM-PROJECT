'use server';

import { getDbConnection } from '@/lib/db';

export async function getPublicHostels(
  genderFilter?: string,
  searchQuery?: string,
  cityFilter?: string,
  wifiFilter?: boolean,
  acFilter?: boolean,
  laundryFilter?: boolean,
  maxRent?: number
) {
  try {
    const pool = await getDbConnection();
    let query = `
      SELECT 
          h.HostelID, 
          h.HostelName, 
          h.GenderType,
          h.City,
          h.Address,
          h.HasWifi,
          h.HasAC,
          h.HasLaundry,
          h.HasFood,
          h.WifiPrice,
          h.ACPrice,
          h.LaundryPrice,
          h.FoodPrice,
          h.MonthlyRent,
          h.IncludedServices,
          o.BusinessName as OwnerName,
          (SELECT COUNT(*) FROM Beds b 
           JOIN Rooms r ON b.RoomID = r.RoomID 
           WHERE r.HostelID = h.HostelID AND b.Status = 'Available') as AvailableBeds
      FROM Hostels h
      LEFT JOIN Owners o ON h.OwnerID = o.OwnerID
      WHERE 1=1
    `;
    
    const request = pool.request();
    
    if (genderFilter && genderFilter !== 'All') {
        query += ' AND h.GenderType = @gender';
        request.input('gender', genderFilter);
    }

    if (searchQuery) {
        query += ' AND (h.HostelName LIKE @search OR h.City LIKE @search OR h.Address LIKE @search)';
        request.input('search', `%${searchQuery}%`);
    }

    if (cityFilter && cityFilter !== 'All') {
        query += ' AND h.City = @city';
        request.input('city', cityFilter);
    }

    if (wifiFilter) {
        query += ' AND h.HasWifi = 1';
    }

    if (acFilter) {
        query += ' AND h.HasAC = 1';
    }

    if (laundryFilter) {
        query += ' AND h.HasLaundry = 1';
    }

    if (maxRent) {
        query += ' AND h.MonthlyRent <= @maxRent';
        request.input('maxRent', maxRent);
    }

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to fetch public hostels' };
  }
}

export async function getPublicHostelDetails(hostelId: number) {
  try {
    const pool = await getDbConnection();
    
    // Get Hostel Info
    const hostelRes = await pool.request()
      .input('id', hostelId)
      .query(`
        SELECT h.*, o.BusinessName as OwnerName 
        FROM Hostels h 
        LEFT JOIN Owners o ON h.OwnerID = o.OwnerID 
        WHERE h.HostelID = @id
      `);
      
    if (hostelRes.recordset.length === 0) return { success: false, error: 'Hostel not found' };

    // Get Rooms with Available Beds
    const roomsRes = await pool.request()
      .input('hostelId', hostelId)
      .query(`
          SELECT 
              r.RoomID, 
              r.RoomNumber, 
              r.FloorNumber,
              r.RoomType,
              r.Capacity,
              r.RoomPrice,
              b.BedID, 
              b.BedNumber
          FROM Rooms r
          JOIN Beds b ON r.RoomID = b.RoomID
          WHERE r.HostelID = @hostelId AND b.Status = 'Available'
          ORDER BY r.FloorNumber, r.RoomNumber, b.BedNumber
      `);

    // Group the results by Room
    const roomsMap = new Map();
    roomsRes.recordset.forEach(row => {
        if (!roomsMap.has(row.RoomID)) {
            roomsMap.set(row.RoomID, {
                RoomID: row.RoomID,
                RoomNumber: row.RoomNumber,
                Capacity: row.Capacity,
                FloorNumber: row.FloorNumber,
                RoomType: row.RoomType,
                RoomPrice: row.RoomPrice,
                AvailableBeds: []
            });
        }
        
        if (row.BedID) {
            roomsMap.get(row.RoomID).AvailableBeds.push({
                BedID: row.BedID,
                BedNumber: row.BedNumber
            });
        }
    });

    const data = {
        hostel: hostelRes.recordset[0],
        rooms: Array.from(roomsMap.values())
    };

    return { success: true, data };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to fetch hostel details' };
  }
}

export async function createStudentAndBook(bedId: number, fullName: string, email: string, gender: string) {
  try {
    const pool = await getDbConnection();
    
    // Check if student exists by email
    let studentId;
    const studentRes = await pool.request()
      .input('email', email)
      .query('SELECT StudentID FROM Students WHERE Email = @email');

    if (studentRes.recordset.length > 0) {
      studentId = studentRes.recordset[0].StudentID;
    } else {
      // Create new student
      const newStudentRes = await pool.request()
        .input('fullName', fullName)
        .input('email', email)
        .input('gender', gender)
        .query(`
          INSERT INTO Students (FullName, Email, Gender) 
          OUTPUT INSERTED.StudentID 
          VALUES (@fullName, @email, @gender)
        `);
      studentId = newStudentRes.recordset[0].StudentID;
    }

    // Call the Stored Procedure to Allocate Bed safely
    // Passing 500.00 as a standard fee for demonstration
    await pool.request()
      .input('StudentID', studentId)
      .input('BedID', bedId)
      .input('Amount', 500.00)
      .execute('sp_AllocateBed');

    return { success: true };
  } catch (error: any) {
    console.error('Booking Error:', error);
    return { success: false, error: error?.message || 'Failed to book bed. It may have been taken by someone else.' };
  }
}
