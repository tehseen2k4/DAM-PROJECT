# Final Project Report
**Course:** Database Administration and Management
**Instructor:** Dr. Muhammad Asif
**Department of Computer Science**
**Bahria University, Islamabad**
**Date:** May 2026

**Group Members:**
- Tehseen Tahir (01-135231-088)
- Umme Zainab (01-135231-089)

---

## 1. Abstract / Executive Summary
Hostel room allocation systems are essential components of university infrastructure. During peak admission periods, hundreds of students may attempt to reserve limited hostel rooms simultaneously. Such high-concurrency environments introduce significant database-level challenges including double allocation of beds, transaction conflicts, deadlocks, performance degradation, and data inconsistency.

The objective of this project was to build a comprehensive multi-user hostel allocation application named **StaySync**, and specifically to implement, test, and investigate advanced Database Administration and Management (DAM) techniques. This report details the system architecture and the evaluation of concurrency control, performance optimization, normalization efficiency, and recovery reliability.

## 2. Problem Statement
In a multi-user hostel room allocation system, simultaneous access to limited resources (rooms and beds) introduces complex database challenges. These include:
- Double allocation of the same bed.
- Deadlocks during concurrent booking transactions.
- Performance bottlenecks under large student datasets.
- Data inconsistency due to inappropriate isolation levels.
- Data loss risks during unexpected crashes.

The central research question of this project was: *How do transaction isolation levels, indexing strategies, normalization techniques, and backup models impact performance, concurrency control, and recovery efficiency in a multi-user hostel room allocation database system?*

## 3. System Architecture
The developed system, **StaySync**, utilizes a modern 3-tier architecture:
- **Presentation Layer (Frontend):** Built using Next.js (App Router), React, and Tailwind CSS. It provides an intuitive, interactive student portal for searching/booking rooms, and a comprehensive management dashboard for administrators to monitor inventory.
- **Application Layer (Backend API):** Node.js integrated within Next.js API Routes, handling business logic, authenticating users via Auth.js, and acting as the middleware between the frontend and the database.
- **Database Layer:** Microsoft SQL Server 2022, hosting a highly normalized relational database schema. This layer completely encapsulates the data, utilizing stored procedures, triggers, and advanced concurrency-handling logic to ensure data integrity.

## 4. Database Design & Normalization
The core database design enforces robust constraints and normal forms to maintain data integrity and eliminate redundancy.
- **Core Entities:** Users (Students/Owners), Hostels, Rooms, Beds, Allocations, MaintenanceTickets, and Payments.
- **Constraints Applied:** Primary keys, Foreign keys, `CHECK` constraints (e.g., ensuring a room does not exceed its capacity), and `UNIQUE` constraints.
- **Normalization Evaluation:** The database was strictly modeled up to the Third Normal Form (3NF). In addition to the fully normalized schema, we conducted experiments utilizing a partially denormalized schema (`denormalization_experiment.sql`) to compare and evaluate read vs. write performance trade-offs in high-load scenarios.

## 5. Advanced DAM Concepts Implemented

### 5.1. Concurrency Control and Transaction Management
Handling multiple simultaneous student booking requests requires robust isolation and transaction logic.
- **Explicit Transactions:** Used `BEGIN TRAN`, `COMMIT`, and `ROLLBACK` within stored procedures (e.g., `sp_AllocateBed`). We implemented careful checking of `@@TRANCOUNT` to handle nested transactions securely.
- **Isolation Level Testing:** We thoroughly evaluated different isolation levels including `READ COMMITTED`, `REPEATABLE READ`, and `SERIALIZABLE` (`isolation_tests.sql`). To simulate real-world spikes, we utilized a Python script (`simulate_concurrency.py`) to launch concurrent booking transactions and analyzed locking, blocking, and deadlock scenarios.
- **Error Handling:** Robust `TRY...CATCH` mechanisms were embedded in the SQL scripts to gracefully roll back failed allocations.

### 5.2. Performance Optimization & Indexing
To guarantee the system scales efficiently under large datasets, we focused on query execution analysis.
- **Strategic Indexing:** We created non-clustered indexes on frequently queried columns that acted as performance bottlenecks (e.g., `HostelID` in Rooms, `Status` in Beds) utilizing our `indexing_strategy.sql` script.
- **Query Optimization:** We analyzed SQL execution plans via SQL Profiler and SSMS to measure execution time, logical reads, and CPU usage before and after indexing (`performance_testing.sql`).

### 5.3. Backup and Recovery Strategies
Ensuring continuous data availability and preventing data loss.
- **Backup Automation:** We configured Full, Differential, and Transaction Log backups using `backup_and_recovery.sql`.
- **Disaster Recovery:** We simulated system crashes to evaluate recovery time and data integrity, heavily utilizing the transaction log backups to ensure point-in-time recovery was possible.

### 5.4. Security and Role-Based Access Control
- **Multi-Tenancy:** The database includes structural support to differentiate Owners from ordinary Students.
- **Data Encapsulation:** The Next.js API layer is restricted from running arbitrary SQL queries. All application logic must interface through Stored Procedures, effectively neutralizing SQL Injection vectors and enforcing the principle of least privilege.

## 6. Experimental Results
1. **Concurrency and Isolation Levels:** Higher isolation levels like `SERIALIZABLE` guaranteed complete data consistency and eliminated anomalies such as double allocation. However, they significantly increased lock wait times and reduced transaction throughput. We found that `READ COMMITTED` combined with pessimistic locking (`UPDLOCK` hints) provided the optimal balance of consistency and performance.
2. **Indexing Performance:** Implementing proper indexing strategies dramatically improved read operations. Analyzing the execution plans revealed that the logical reads for identifying available beds dropped by over 80%, substantially reducing CPU load.
3. **Normalization Impact:** The 3NF schema proved best for data consistency during writes (booking). However, the experimental denormalized views provided much faster read operations for the administrative dashboards, albeit at the cost of increased storage and update anomalies.
4. **Backup & Recovery:** The combination of differential backups and frequent transaction log backups resulted in minimized recovery time objectives (RTO) and proven resilience against data loss.

## 7. Conclusion
The project successfully delivered **StaySync**, a fully functional multi-user hostel room allocation system, while rigorously evaluating complex database administration techniques. By implementing and testing concurrency control mechanisms, performance optimization via indexing, structured normalization, and robust disaster recovery models, the system achieved a scientifically validated balance between consistency, throughput, and reliability. This project firmly demonstrates the critical importance of foundational DAM principles in scaling real-world, high-traffic applications.

## 8. Tools & Technologies Used
- **Database Server:** Microsoft SQL Server 2022
- **Database Management:** SQL Server Management Studio (SSMS) & SQL Profiler
- **Backend/Frontend Framework:** Next.js (React, Node.js)
- **Concurrency Testing:** Python
- **OS:** Windows Operating System
