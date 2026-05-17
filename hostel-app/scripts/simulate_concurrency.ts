import { getDbConnection } from '../src/lib/db';
import sql from 'mssql';

async function allocateBedTask(studentId: number, bedId: number, amount: number, threadId: number) {
    try {
        const pool = await getDbConnection();
        
        console.log(`[Thread ${threadId}] Student ${studentId} attempting to book Bed ${bedId}...`);
        
        // We use a transaction directly here to force isolation if the SP doesn't handle it
        // But our SP has BEGIN TRANSACTION inside it!
        const result = await pool.request()
            .input('StudentID', sql.Int, studentId)
            .input('BedID', sql.Int, bedId)
            .input('Amount', sql.Decimal(10, 2), amount)
            .execute('sp_AllocateBed');
            
        console.log(`[Thread ${threadId}] ✅ SUCCESS: Bed ${bedId} allocated to Student ${studentId}.`);
    } catch (err: any) {
        console.error(`[Thread ${threadId}] ❌ FAILED: ${err.message}`);
    }
}

async function runSimulation() {
    console.log("==========================================");
    console.log("   🚀 STARTING CONCURRENCY SIMULATION");
    console.log("==========================================");
    console.log("Scenario: 4 students trying to book the EXACT SAME bed simultaneously.");
    
    // Find an available bed first
    const pool = await getDbConnection();
    const bedResult = await pool.request().query("SELECT TOP 1 BedID FROM Beds WHERE Status = 'Available'");
    
    if (bedResult.recordset.length === 0) {
        console.log("No available beds found for the test! Please add beds or cancel a booking.");
        process.exit(1);
    }
    
    const bedToBook = bedResult.recordset[0].BedID;
    const price = 500.00;

    console.log(`Targeting BedID: ${bedToBook}`);

    // Create 4 random new students to simulate the traffic
    // We will just create temporary student records for them
    const studentIds: number[] = [];
    for (let i = 1; i <= 4; i++) {
        const res = await pool.request()
            .input('name', sql.NVarChar, `Concurrency Test ${i}`)
            .input('email', sql.NVarChar, `test${i}_${Date.now()}@crash.com`)
            .query("INSERT INTO Students (FullName, Email, Gender) OUTPUT INSERTED.StudentID VALUES (@name, @email, 'Male')");
        studentIds.push(res.recordset[0].StudentID);
    }
    
    console.log(`Created 4 concurrent virtual students. Firing requests...\n`);

    // Launch all promises simultaneously without awaiting them individually
    // This creates a "Race Condition"
    const promises = studentIds.map((sId, index) => 
        allocateBedTask(sId, bedToBook, price, index + 1)
    );

    // Wait for all "threads" to finish
    await Promise.all(promises);

    console.log("\n==========================================");
    console.log("            SIMULATION FINISHED");
    console.log("==========================================");
    console.log("If your transaction logic (ACID properties) is working correctly,");
    console.log("only ONE thread should say SUCCESS, and the rest should FAIL.");
    
    process.exit(0);
}

runSimulation();
