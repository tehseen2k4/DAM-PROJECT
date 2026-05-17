'use server';

import { getDbConnection } from '@/lib/db';

export async function getHostels(ownerId?: number, role?: string) {
  try {
    const pool = await getDbConnection();
    let query = 'SELECT * FROM Hostels';
    const request = pool.request();

    // If the user is an 'Owner', they only see THEIR hostels
    if (role === 'Owner' && ownerId) {
      request.input('ownerId', ownerId);
      query += ' WHERE OwnerID = @ownerId';
    }
    // If Admin, they see everything (no WHERE clause needed)

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to fetch hostels' };
  }
}

export async function createHostel(
  name: string,
  genderType: string,
  ownerId: number,
  city: string = 'Lahore',
  address: string = '',
  hasWifi: boolean = true,
  hasAC: boolean = false,
  hasLaundry: boolean = false,
  monthlyRent: number = 5000,
  includedServices: string = 'Security, Water',
  hasFood: boolean = false,
  wifiPrice: number = 0,
  acPrice: number = 0,
  laundryPrice: number = 0,
  foodPrice: number = 0
) {
  try {
    const pool = await getDbConnection();
    await pool.request()
      .input('name', name)
      .input('gender', genderType)
      .input('ownerId', ownerId)
      .input('city', city)
      .input('address', address)
      .input('hasWifi', hasWifi ? 1 : 0)
      .input('hasAC', hasAC ? 1 : 0)
      .input('hasLaundry', hasLaundry ? 1 : 0)
      .input('monthlyRent', monthlyRent)
      .input('includedServices', includedServices)
      .input('hasFood', hasFood ? 1 : 0)
      .input('wifiPrice', wifiPrice)
      .input('acPrice', acPrice)
      .input('laundryPrice', laundryPrice)
      .input('foodPrice', foodPrice)
      .query(`
        INSERT INTO Hostels (HostelName, GenderType, OwnerID, City, Address, HasWifi, HasAC, HasLaundry, MonthlyRent, IncludedServices, HasFood, WifiPrice, ACPrice, LaundryPrice, FoodPrice)
        VALUES (@name, @gender, @ownerId, @city, @address, @hasWifi, @hasAC, @hasLaundry, @monthlyRent, @includedServices, @hasFood, @wifiPrice, @acPrice, @laundryPrice, @foodPrice)
      `);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to create hostel' };
  }
}

export async function updateHostel(
  id: number,
  name: string,
  genderType: string,
  city: string,
  address: string,
  hasWifi: boolean,
  hasAC: boolean,
  hasLaundry: boolean,
  monthlyRent: number,
  includedServices: string,
  hasFood: boolean,
  wifiPrice: number,
  acPrice: number,
  laundryPrice: number,
  foodPrice: number
) {
  try {
    const pool = await getDbConnection();
    await pool.request()
      .input('id', id)
      .input('name', name)
      .input('gender', genderType)
      .input('city', city)
      .input('address', address)
      .input('hasWifi', hasWifi ? 1 : 0)
      .input('hasAC', hasAC ? 1 : 0)
      .input('hasLaundry', hasLaundry ? 1 : 0)
      .input('monthlyRent', monthlyRent)
      .input('includedServices', includedServices)
      .input('hasFood', hasFood ? 1 : 0)
      .input('wifiPrice', wifiPrice)
      .input('acPrice', acPrice)
      .input('laundryPrice', laundryPrice)
      .input('foodPrice', foodPrice)
      .query(`
        UPDATE Hostels 
        SET HostelName = @name, 
            GenderType = @gender,
            City = @city,
            Address = @address,
            HasWifi = @hasWifi,
            HasAC = @hasAC,
            HasLaundry = @hasLaundry,
            MonthlyRent = @monthlyRent,
            IncludedServices = @includedServices,
            HasFood = @hasFood,
            WifiPrice = @wifiPrice,
            ACPrice = @acPrice,
            LaundryPrice = @laundryPrice,
            FoodPrice = @foodPrice
        WHERE HostelID = @id
      `);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to update hostel' };
  }
}

export async function deleteHostel(id: number) {
  try {
    const pool = await getDbConnection();
    
    // Check if there are rooms associated (Enforcing Data Integrity)
    const roomCheck = await pool.request()
      .input('id', id)
      .query('SELECT COUNT(*) as count FROM Rooms WHERE HostelID = @id');
      
    if (roomCheck.recordset[0].count > 0) {
      return { success: false, error: 'Cannot delete hostel with existing rooms. Delete rooms first.' };
    }

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Hostels WHERE HostelID = @id');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to delete hostel' };
  }
}

export async function getOccupiedBeds(ownerId?: number, role?: string) {
  try {
    const pool = await getDbConnection();
    let query = `
      SELECT 
        b.BedID, b.BedNumber, b.Status as BedStatus,
        r.RoomNumber, r.RoomType, r.RoomPrice,
        h.HostelName, h.HostelID, h.MonthlyRent,
        s.StudentID, s.FullName as StudentName, s.Email as StudentEmail, s.University as StudentUniversity, s.Age as StudentAge, s.Gender as StudentGender,
        a.AllocationID,
        (SELECT TOP 1 PaymentStatus FROM Payments WHERE AllocationID = a.AllocationID ORDER BY PaymentID DESC) as LatestPaymentStatus,
        (SELECT TOP 1 Amount FROM Payments WHERE AllocationID = a.AllocationID ORDER BY PaymentID ASC) as AllocatedAmount
      FROM Beds b
      JOIN Rooms r ON b.RoomID = r.RoomID
      JOIN Hostels h ON r.HostelID = h.HostelID
      LEFT JOIN Allocations a ON b.BedID = a.BedID AND a.Status = 'Active'
      LEFT JOIN Students s ON a.StudentID = s.StudentID
      WHERE b.Status = 'Occupied'
    `;

    const request = pool.request();
    if (role === 'Owner' && ownerId) {
      query += ` AND h.OwnerID = @ownerId`;
      request.input('ownerId', ownerId);
    }

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to fetch occupied beds' };
  }
}


export async function generateMonthlyBill(allocationId: number, amount: number) {
  try {
    const pool = await getDbConnection();
    await pool.request()
      .input('allocationId', allocationId)
      .input('amount', amount)
      .query(`
        INSERT INTO Payments (AllocationID, Amount, PaymentDate, PaymentStatus)
        VALUES (@allocationId, @amount, GETDATE(), 'Pending')
      `);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to generate monthly bill' };
  }
}

