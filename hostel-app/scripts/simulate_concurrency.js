const sql = require('mssql');

const config = {
    server: 'localhost',
    database: 'HostelDB',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        trustedConnection: true
    }
};

async function allocateBedTask(studentId, bedId, amount, threadId) {
    let pool;
    try {
        // Each request needs its own connection to simulate actual concurrent users
        pool = await sql.connect(config);
        
        console.log(`[Thread ${threadId}] Student ${studentId} attempting to book Bed ${bedId}...`);
        
        // Execute the stored procedure
        const result = await pool.request()
            .input('StudentID', sql.Int, studentId)
            .input('BedID', sql.Int, bedId)
            .input('Amount', sql.Decimal(10, 2), amount)
            .execute('sp_AllocateBed');
            
        console.log(`[Thread ${threadId}] SUCCESS: Bed ${bedId} allocated to Student ${studentId}.`);
    } catch (err) {
        // The RAISERROR from SQL Server will be caught here
        console.error(`[Thread ${threadId}] FAILED: ${err.message}`);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

async function runSimulation() {
    console.log("--- Starting Concurrency Simulation ---");
    console.log("Scenario: 4 students trying to book the EXACT SAME bed simultaneously at the exact same millisecond.");
    
    // Find an available bed first
    let pool = await sql.connect(config);
    const bedResult = await pool.request().query("SELECT TOP 1 BedID FROM Beds WHERE Status = 'Available'");
    
    if (bedResult.recordset.length === 0) {
        console.log("No available beds found for the test!");
        process.exit(1);
    }
    
    const bedToBook = bedResult.recordset[0].BedID;
    const price = 500.00;
    await pool.close();

    console.log(`Testing with BedID: ${bedToBook}`);

    // Create 4 random new students to simulate the traffic
    const studentIds = [101, 102, 103, 104];
    
    // Launch all promises simultaneously without awaiting them individually
    const promises = studentIds.map((sId, index) => 
        allocateBedTask(sId, bedToBook, price, index + 1)
    );

    // Wait for all "threads" to finish
    await Promise.all(promises);

    console.log("--- Simulation Finished ---");
    console.log("Notice how only ONE thread succeeded, and the rest were blocked/rejected by the SQL Transaction!");
}

runSimulation();
