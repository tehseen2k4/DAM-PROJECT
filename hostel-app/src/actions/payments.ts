'use server';

import { getDbConnection } from '@/lib/db';

export async function getRecentAllocations(ownerId?: number) {
  try {
    const pool = await getDbConnection();
    
    let query = `
      SELECT 
        a.AllocationID,
        a.AllocationDate,
        a.Status as AllocationStatus,
        s.FullName as StudentName,
        s.Email as StudentEmail,
        b.BedNumber,
        r.RoomNumber,
        h.HostelName,
        p.PaymentID,
        p.Amount,
        p.PaymentStatus
      FROM Allocations a
      JOIN Students s ON a.StudentID = s.StudentID
      JOIN Beds b ON a.BedID = b.BedID
      JOIN Rooms r ON b.RoomID = r.RoomID
      JOIN Hostels h ON r.HostelID = h.HostelID
      JOIN Payments p ON a.AllocationID = p.AllocationID
    `;

    const request = pool.request();

    if (ownerId) {
      query += ` WHERE h.OwnerID = @ownerId `;
      request.input('ownerId', ownerId);
    }

    query += ` ORDER BY a.AllocationDate DESC`;

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to fetch allocations' };
  }
}

export async function verifyPayment(paymentId: number) {
  try {
    const pool = await getDbConnection();
    
    // Begin a transaction to ensure both payment and allocation statuses are handled if needed
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      await transaction.request()
        .input('paymentId', paymentId)
        .query(`
          UPDATE Payments 
          SET PaymentStatus = 'Paid', PaymentDate = GETDATE()
          WHERE PaymentID = @paymentId
        `);

      await transaction.commit();
      return { success: true };
    } catch (txError) {
      await transaction.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to verify payment' };
  }
}

export async function cancelAllocation(allocationId: number, paymentId: number) {
  try {
    const pool = await getDbConnection();
    
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // The trigger trg_UpdateBedStatusOnCancel will automatically free the bed!
      await transaction.request()
        .input('allocationId', allocationId)
        .query(`
          UPDATE Allocations 
          SET Status = 'Cancelled'
          WHERE AllocationID = @allocationId
        `);

      await transaction.request()
        .input('paymentId', paymentId)
        .query(`
          UPDATE Payments 
          SET PaymentStatus = 'Failed'
          WHERE PaymentID = @paymentId
        `);

      await transaction.commit();
      return { success: true };
    } catch (txError) {
      await transaction.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to cancel allocation' };
  }
}

export async function checkoutAllocation(allocationId: number) {
  try {
    const pool = await getDbConnection();
    
    // The trigger trg_UpdateBedStatusOnCancel will automatically free the bed!
    await pool.request()
      .input('allocationId', allocationId)
      .query(`
        UPDATE Allocations 
        SET Status = 'Completed'
        WHERE AllocationID = @allocationId AND Status = 'Active'
      `);

    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to checkout student' };
  }
}

export async function payPendingInvoice(paymentId: number) {
  try {
    const pool = await getDbConnection();
    await pool.request()
      .input('paymentId', paymentId)
      .query(`
        UPDATE Payments 
        SET PaymentStatus = 'Pending Verification', PaymentDate = GETDATE()
        WHERE PaymentID = @paymentId
      `);
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to submit payment verification' };
  }
}


