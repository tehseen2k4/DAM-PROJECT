'use server';

import { getDbConnection } from '@/lib/db';

export async function getStudentDashboard(studentId: number) {
  try {
    const pool = await getDbConnection();

    // Get student profile
    const studentRes = await pool.request()
      .input('id', studentId)
      .query(`SELECT * FROM Students WHERE StudentID = @id`);

    if (studentRes.recordset.length === 0) return { success: false, error: 'Student not found' };

    // Get active allocation with hostel/room/bed details
    const allocRes = await pool.request()
      .input('id', studentId)
      .query(`
        SELECT 
          a.AllocationID, a.AllocationDate, a.Status as AllocationStatus,
          b.BedNumber, r.RoomNumber, r.RoomType, r.FloorNumber, r.RoomID,
          h.HostelName, h.HostelID, h.City, h.Address, h.HasWifi, h.HasAC, h.HasLaundry, h.IncludedServices,
          p.PaymentID, p.Amount, p.PaymentStatus, p.PaymentDate
        FROM Allocations a
        JOIN Beds b ON a.BedID = b.BedID
        JOIN Rooms r ON b.RoomID = r.RoomID
        JOIN Hostels h ON r.HostelID = h.HostelID
        JOIN Payments p ON a.AllocationID = p.AllocationID
        WHERE a.StudentID = @id
        ORDER BY a.AllocationDate DESC
      `);

    // Get open maintenance tickets reported by this student
    const ticketsRes = await pool.request()
      .input('id', studentId)
      .query(`
        SELECT m.*, h.HostelName, r.RoomNumber
        FROM MaintenanceTickets m
        JOIN Hostels h ON m.HostelID = h.HostelID
        JOIN Rooms r ON m.RoomID = r.RoomID
        WHERE m.ReportedByStudentID = @id
        ORDER BY m.ReportedDate DESC
      `);

    return {
      success: true,
      data: {
        student: studentRes.recordset[0],
        allocations: allocRes.recordset,
        tickets: ticketsRes.recordset,
      }
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to load student dashboard' };
  }
}

export async function getAdminDashboard() {
  try {
    const pool = await getDbConnection();

    const [hostelCount, studentCount, allocationCount, revenueRes, allAllocations, allHostels] = await Promise.all([
      pool.request().query(`SELECT COUNT(*) as total FROM Hostels`),
      pool.request().query(`SELECT COUNT(*) as total FROM Students`),
      pool.request().query(`SELECT COUNT(*) as total FROM Allocations WHERE Status = 'Active'`),
      pool.request().query(`SELECT SUM(Amount) as total FROM Payments WHERE PaymentStatus = 'Paid'`),
      pool.request().query(`
        SELECT TOP 20
          a.AllocationID, a.AllocationDate, a.Status as AllocationStatus,
          s.FullName as StudentName, s.Email as StudentEmail,
          b.BedNumber, r.RoomNumber,
          h.HostelName,
          p.PaymentID, p.Amount, p.PaymentStatus
        FROM Allocations a
        JOIN Students s ON a.StudentID = s.StudentID
        JOIN Beds b ON a.BedID = b.BedID
        JOIN Rooms r ON b.RoomID = r.RoomID
        JOIN Hostels h ON r.HostelID = h.HostelID
        JOIN Payments p ON a.AllocationID = p.AllocationID
        ORDER BY a.AllocationDate DESC
      `),
      pool.request().query(`
        SELECT 
          h.HostelID, h.HostelName, h.GenderType, h.City, h.Address, h.HasWifi, h.HasAC, h.HasLaundry, h.MonthlyRent,
          o.BusinessName as OwnerName,
          (SELECT COUNT(*) FROM Beds b 
           JOIN Rooms r ON b.RoomID = r.RoomID 
           WHERE r.HostelID = h.HostelID AND b.Status = 'Available') as AvailableBeds
        FROM Hostels h
        LEFT JOIN Owners o ON h.OwnerID = o.OwnerID
      `)
    ]);

    return {
      success: true,
      data: {
        stats: {
          hostels: hostelCount.recordset[0].total,
          students: studentCount.recordset[0].total,
          activeAllocations: allocationCount.recordset[0].total,
          totalRevenue: revenueRes.recordset[0].total || 0,
        },
        allocations: allAllocations.recordset,
        hostels: allHostels.recordset
      }
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to load admin dashboard' };
  }
}

export async function joinWaitlist(hostelId: number, studentId: number) {
  try {
    const pool = await getDbConnection();
    
    // Check if already on waitlist
    const existing = await pool.request()
      .input('hostelId', hostelId)
      .input('studentId', studentId)
      .query(`SELECT WaitingID FROM WaitingList WHERE HostelID = @hostelId AND StudentID = @studentId`);
    
    if (existing.recordset.length > 0) {
      return { success: false, error: 'You are already on the waitlist for this hostel.' };
    }

    await pool.request()
      .input('hostelId', hostelId)
      .input('studentId', studentId)
      .query(`INSERT INTO WaitingList (StudentID, HostelID) VALUES (@studentId, @hostelId)`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to join waitlist' };
  }
}

export async function reportIssueAsStudent(
  hostelId: number, roomId: number, studentId: number,
  category: string, description: string, priority: string
) {
  try {
    const pool = await getDbConnection();

    await pool.request()
      .input('hostelId', hostelId)
      .input('roomId', roomId)
      .input('studentId', studentId)
      .input('category', category)
      .input('description', description)
      .input('priority', priority)
      .execute('sp_ReportMaintenanceIssue');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to report issue' };
  }
}

export async function bookBedForStudent(
  bedId: number, 
  studentId: number,
  useWifi: boolean = false,
  useAC: boolean = false,
  useLaundry: boolean = false,
  useFood: boolean = false
) {
  try {
    const pool = await getDbConnection();

    // 0. Check if student already has an active allocation (currently living in a hostel)
    const activeCheck = await pool.request()
      .input('studentId', studentId)
      .query("SELECT COUNT(*) as count FROM Allocations WHERE StudentID = @studentId AND Status = 'Active'");
    
    if (activeCheck.recordset[0].count > 0) {
      return { success: false, error: 'You already have an active stay allocation in a hostel! You cannot book multiple beds.' };
    }

    // 1. Get RoomPrice and Amenities prices
    const detailsRes = await pool.request()
      .input('bedId', bedId)
      .query(`
        SELECT r.RoomPrice, h.WifiPrice, h.ACPrice, h.LaundryPrice, h.FoodPrice
        FROM Beds b
        JOIN Rooms r ON b.RoomID = r.RoomID
        JOIN Hostels h ON r.HostelID = h.HostelID
        WHERE b.BedID = @bedId
      `);
    
    if (detailsRes.recordset.length === 0) {
      return { success: false, error: 'Bed or associated hostel/room details not found.' };
    }

    const row = detailsRes.recordset[0];
    const basePrice = row.RoomPrice || 5000.00;
    
    const wifiAddon = useWifi ? (row.WifiPrice || 0) : 0;
    const acAddon = useAC ? (row.ACPrice || 0) : 0;
    const laundryAddon = useLaundry ? (row.LaundryPrice || 0) : 0;
    const foodAddon = useFood ? (row.FoodPrice || 0) : 0;

    const amount = basePrice + wifiAddon + acAddon + laundryAddon + foodAddon;

    // 2. Execute Stored Procedure
    await pool.request()
      .input('StudentID', studentId)
      .input('BedID', bedId)
      .input('Amount', amount)
      .execute('sp_AllocateBed');

    return { success: true };
  } catch (error: any) {
    console.error('Booking Transaction Error:', error);
    return { success: false, error: error?.message || 'Failed to book bed. It may have been reserved by someone else.' };
  }
}

