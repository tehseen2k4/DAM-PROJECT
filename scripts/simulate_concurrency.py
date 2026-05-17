import threading
import pyodbc
import time

# SQL Server Connection Configuration
# Replace 'YOUR_SERVER_NAME' with your actual SQL Server name (e.g., 'localhost' or 'DESKTOP-ABC\SQLEXPRESS')
conn_str = (
    r'DRIVER={ODBC Driver 18 for SQL Server};'
    r'SERVER=localhost;'
    r'DATABASE=HostelDB;'
    r'Trusted_Connection=yes;'
    r'TrustServerCertificate=yes;'
)

def allocate_bed_task(student_id, bed_id, amount, thread_id):
    """
    Attempt to allocate a bed via the stored procedure.
    """
    try:
        # Each thread needs its own connection
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        print(f"[Thread {thread_id}] Student {student_id} attempting to book Bed {bed_id}...")
        
        # Call the stored procedure
        cursor.execute("{CALL sp_AllocateBed (?, ?, ?)}", (student_id, bed_id, amount))
        
        # Check for success (the SP prints status, but we can also check tables)
        conn.commit()
        print(f"[Thread {thread_id}] SUCCESS: Bed {bed_id} allocated to Student {student_id}.")
        
    except pyodbc.Error as e:
        # Handle SQL Server errors (e.g., custom RAISERROR or Deadlocks)
        print(f"[Thread {thread_id}] FAILED: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()

def run_simulation():
    print("--- Starting Concurrency Simulation ---")
    print("Scenario: Multiple students trying to book the SAME bed simultaneously.")
    
    bed_to_book = 1  # From seed data, Bed 1 in Room 1 (Jinnah Hostel)
    price = 5000.00
    
    # List of student IDs from seed data (Ali Khan=1, Osman Ghani=4)
    # We will simulate 4 students competing for the same bed
    student_ids = [1, 2, 3, 4]
    threads = []

    for i, s_id in enumerate(student_ids):
        t = threading.Thread(target=allocate_bed_task, args=(s_id, bed_to_book, price, i+1))
        threads.append(t)

    # Start all threads simultaneously
    for t in threads:
        t.start()

    # Wait for all to finish
    for t in threads:
        t.join()

    print("--- Simulation Finished ---")
    print("Check SSMS to see which StudentID actually won the BedID 1.")

if __name__ == "__main__":
    run_simulation()
