'use server';

import { getDbConnection } from '@/lib/db';
import sql from 'mssql';

export async function getRoomsByHostel(hostelId: number) {
  try {
    const pool = await getDbConnection();
    
    // Fetch rooms and their beds in one go using a JOIN
    const result = await pool.request()
        .input('hostelId', hostelId)
        .query(`
            SELECT 
                r.RoomID, 
                r.RoomNumber, 
                r.Capacity,
                r.FloorNumber,
                r.RoomType,
                r.RoomPrice,
                b.BedID, 
                b.BedNumber, 
                b.Status as BedStatus
            FROM Rooms r
            LEFT JOIN Beds b ON r.RoomID = b.RoomID
            WHERE r.HostelID = @hostelId
            ORDER BY r.RoomNumber, b.BedNumber
        `);

    // Group the results by Room
    const roomsMap = new Map();
    
    result.recordset.forEach(row => {
        if (!roomsMap.has(row.RoomID)) {
            roomsMap.set(row.RoomID, {
                RoomID: row.RoomID,
                RoomNumber: row.RoomNumber,
                Capacity: row.Capacity,
                FloorNumber: row.FloorNumber,
                RoomType: row.RoomType,
                RoomPrice: row.RoomPrice,
                Beds: []
            });
        }
        
        if (row.BedID) {
            roomsMap.get(row.RoomID).Beds.push({
                BedID: row.BedID,
                BedNumber: row.BedNumber,
                Status: row.BedStatus
            });
        }
    });

    return { success: true, data: Array.from(roomsMap.values()) };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to fetch rooms' };
  }
}

export async function getHostelById(id: number) {
    try {
        const pool = await getDbConnection();
        const result = await pool.request()
            .input('id', id)
            .query('SELECT * FROM Hostels WHERE HostelID = @id');
        
        return { success: true, data: result.recordset[0] };
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, error: 'Failed to fetch hostel' };
    }
}

export async function batchCreateRooms(
    hostelId: number, 
    startRoom: number, 
    endRoom: number, 
    capacity: number,
    floorNumber: number = 0,
    roomType: string = 'Standard',
    roomPrice: number = 5000
) {
    try {
        const pool = await getDbConnection();
        const result = await pool.request()
            .input('HostelID', hostelId)
            .input('StartRoom', startRoom)
            .input('EndRoom', endRoom)
            .input('Capacity', capacity)
            .input('FloorNumber', floorNumber)
            .input('RoomType', roomType)
            .input('RoomPrice', roomPrice)
            .execute('sp_BatchCreateRooms');
        
        const status = result.recordset[0];
        if (status.Status === 'Success') {
            return { success: true, message: status.Message };
        } else {
            return { success: false, error: status.Message };
        }
    } catch (error: any) {
        console.error('Database Error:', error);
        return { success: false, error: error.message || 'Failed to create rooms' };
    }
}


export async function createRoom(hostelId: number, roomNumber: string, capacity: number, floorNumber: number, roomType: string, roomPrice: number = 5000) {
    try {
        const pool = await getDbConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const roomRes = await transaction.request()
                .input('hostelId', hostelId)
                .input('roomNumber', roomNumber)
                .input('capacity', capacity)
                .input('floor', floorNumber)
                .input('type', roomType)
                .input('price', roomPrice)
                .query(`
                    INSERT INTO Rooms (RoomNumber, Capacity, HostelID, FloorNumber, RoomType, RoomPrice)
                    VALUES (@roomNumber, @capacity, @hostelId, @floor, @type, @price);
                    SELECT SCOPE_IDENTITY() as RoomID;
                `);
            
            const roomId = roomRes.recordset[0].RoomID;

            for (let i = 1; i <= capacity; i++) {
                await transaction.request()
                    .input('roomId', roomId)
                    .input('bedNum', i.toString())
                    .query("INSERT INTO Beds (BedNumber, RoomID, Status) VALUES (@bedNum, @roomId, 'Available')");
            }

            await transaction.commit();
            return { success: true };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, error: 'Failed to create room' };
    }
}

export async function deleteRoom(roomId: number) {
    try {
        const pool = await getDbConnection();
        
        // 1. Check if ANY bed in this room is occupied
        const checkRes = await pool.request()
            .input('roomId', roomId)
            .query("SELECT Status FROM Beds WHERE RoomID = @roomId AND Status = 'Occupied'");
        
        if (checkRes.recordset.length > 0) {
            return { success: false, error: 'Cannot delete room with occupied beds.' };
        }

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Delete beds first (FK)
            await transaction.request().input('roomId', roomId).query('DELETE FROM Beds WHERE RoomID = @roomId');
            // Delete room
            await transaction.request().input('roomId', roomId).query('DELETE FROM Rooms WHERE RoomID = @roomId');

            await transaction.commit();
            return { success: true };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, error: 'Failed to delete room' };
    }
}

export async function updateRoom(roomId: number, roomNumber: string, capacity: number, floorNumber: number, roomType: string, roomPrice: number = 5000) {
    try {
        const pool = await getDbConnection();
        
        // 1. Transaction to update room and adjust beds
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Update Room Details
            await transaction.request()
                .input('roomId', roomId)
                .input('roomNumber', roomNumber)
                .input('capacity', capacity)
                .input('floor', floorNumber)
                .input('type', roomType)
                .input('price', roomPrice)
                .query(`
                    UPDATE Rooms 
                    SET RoomNumber = @roomNumber, 
                        Capacity = @capacity, 
                        FloorNumber = @floor, 
                        RoomType = @type,
                        RoomPrice = @price
                    WHERE RoomID = @roomId
                `);

            // Adjust Beds if capacity changed? 
            // For now, let's keep it simple: if capacity increases, add beds. If decreases, check if occupied first.
            const currentBeds = await transaction.request()
                .input('roomId', roomId)
                .query('SELECT BedID, Status FROM Beds WHERE RoomID = @roomId');
            
            const bedCount = currentBeds.recordset.length;

            if (capacity > bedCount) {
                for (let i = bedCount + 1; i <= capacity; i++) {
                    await transaction.request()
                        .input('roomId', roomId)
                        .input('bedNum', i.toString())
                        .query("INSERT INTO Beds (BedNumber, RoomID, Status) VALUES (@bedNum, @roomId, 'Available')");
                }
            } else if (capacity < bedCount) {
                // Check if any beds we're about to remove are occupied
                const bedsToRemove = currentBeds.recordset.slice(capacity);
                const occupied = bedsToRemove.some(b => b.Status === 'Occupied');
                
                if (occupied) {
                    throw new Error('Cannot reduce capacity: some beds to be removed are occupied.');
                }

                for (const bed of bedsToRemove) {
                    await transaction.request()
                        .input('bedId', bed.BedID)
                        .query('DELETE FROM Beds WHERE BedID = @bedId');
                }
            }

            await transaction.commit();
            return { success: true };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error: any) {
        console.error('Database Error:', error);
        return { success: false, error: error.message || 'Failed to update room' };
    }
}

export async function deleteAllRooms(hostelId: number) {
    try {
        const pool = await getDbConnection();
        
        // 1. Check if ANY bed in ANY room of this hostel is occupied
        const checkRes = await pool.request()
            .input('hostelId', hostelId)
            .query(`
                SELECT b.Status 
                FROM Beds b
                JOIN Rooms r ON b.RoomID = r.RoomID
                WHERE r.HostelID = @hostelId AND b.Status = 'Occupied'
            `);
        
        if (checkRes.recordset.length > 0) {
            return { success: false, error: 'Cannot clear inventory: some rooms have occupied beds.' };
        }

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Delete beds first (FK)
            await transaction.request()
                .input('hostelId', hostelId)
                .query('DELETE b FROM Beds b JOIN Rooms r ON b.RoomID = r.RoomID WHERE r.HostelID = @hostelId');
            
            // Delete rooms
            await transaction.request()
                .input('hostelId', hostelId)
                .query('DELETE FROM Rooms WHERE HostelID = @hostelId');

            await transaction.commit();
            return { success: true };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, error: 'Failed to clear all rooms' };
    }
}
