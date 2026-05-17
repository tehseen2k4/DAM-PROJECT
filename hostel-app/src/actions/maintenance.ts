'use server';

import { getDbConnection } from '@/lib/db';

export async function getMaintenanceTickets(ownerId?: number) {
  try {
    const pool = await getDbConnection();
    
    let query = `
      SELECT 
        m.TicketID,
        m.IssueCategory,
        m.Description,
        m.PriorityLevel,
        m.Status,
        m.ReportedDate,
        h.HostelName,
        r.RoomNumber,
        s.FullName as ReportedBy
      FROM MaintenanceTickets m
      JOIN Hostels h ON m.HostelID = h.HostelID
      JOIN Rooms r ON m.RoomID = r.RoomID
      LEFT JOIN Students s ON m.ReportedByStudentID = s.StudentID
      WHERE m.Status <> 'Resolved'
    `;

    const request = pool.request();

    if (ownerId) {
      query += ` AND h.OwnerID = @ownerId `;
      request.input('ownerId', ownerId);
    }

    query += ` ORDER BY 
        CASE m.PriorityLevel
            WHEN 'Critical' THEN 1
            WHEN 'High' THEN 2
            WHEN 'Medium' THEN 3
            WHEN 'Low' THEN 4
        END,
        m.ReportedDate DESC`;

    const result = await request.query(query);
    return { success: true, data: result.recordset };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to fetch maintenance tickets' };
  }
}

export async function resolveMaintenanceTicket(ticketId: number, adminNotes: string) {
  try {
    const pool = await getDbConnection();
    
    await pool.request()
      .input('ticketId', ticketId)
      .input('adminNotes', adminNotes)
      .execute('sp_ResolveMaintenanceIssue');

    return { success: true };
  } catch (error: any) {
    console.error('Database Error:', error);
    return { success: false, error: error?.message || 'Failed to resolve ticket' };
  }
}
