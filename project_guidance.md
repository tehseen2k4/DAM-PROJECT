# Hostel Room Allocation System - Project Implementation Guide

This document provides a comprehensive guide for implementing your Database Administration and Management (DAM) semester project: **Performance, Concurrency Control, and Recovery Evaluation in a Multi-User Hostel Room Allocation System**.

---

## 1. Project Overview
You are building a relational database system to manage hostel room allocations. However, the *primary focus* is not just basic CRUD (Create, Read, Update, Delete) operations. The core objective is to experiment with and evaluate advanced database administration concepts such as concurrency control, performance tuning, indexing, normalization, and disaster recovery under simulated multi-user workloads.

---

## 2. What Will We Make?
We will create a robust database backend for a Hostel Room Allocation System. The system will consist of:
1. **A Normalized Database Schema** handling Students, Hostels, Rooms, Beds, Allocations, Waiting Lists, and Payments.
2. **Business Logic Layer** using Stored Procedures and Triggers to enforce rules (e.g., preventing double-booking of beds).
3. **Concurrency Simulation Scripts** to test how the database handles multiple students trying to book the same bed simultaneously.
4. **Different Schema Versions** (Normalized vs. Denormalized) for performance comparison.
5. **A Backup & Recovery System** to ensure data is not lost during simulated failures.

---

## 3. Required Software & Tools
Based on your proposal, here is the exact software you need to install and configure:

1. **Microsoft SQL Server 2022 (Developer or Express Edition)**
   - **Why?** It is the core Database Management System (DBMS) where your database will reside. Developer Edition is highly recommended as it has all enterprise features for free.
2. **SQL Server Management Studio (SSMS)**
   - **Why?** This is the graphical interface used to execute queries, design tables, configure backups, and view execution plans.
3. **SQL Server Profiler / Extended Events**
   - **Why?** Used to trace queries, monitor database performance, monitor deadlocks, and gather metrics (CPU, execution time, etc.) during your experiments.
4. **Programming Environment (Optional but highly recommended for Concurrency Simulation)**
   - **Why?** To simulate 100+ students trying to book rooms at the exact same millisecond, you will need a simple script. 
   - **Tools:** Python (with `pyodbc` library) or C# / .NET Console Application to spawn multiple threads communicating with SQL Server simultaneously.
5. **Windows Operating System** (Host environment for SQL Server).

---

## 4. Technologies & Concepts Used
- **T-SQL (Transact-SQL):** The primary query language for MS SQL Server used to write views, stored procedures, triggers, and transactions.
- **ACID Properties:** Ensuring Atomicity, Consistency, Isolation, and Durability in your transactions.
- **Transaction Isolation Levels:** Testing `READ COMMITTED`, `REPEATABLE READ`, and `SERIALIZABLE`.
- **Database Indexing:** Clustered vs. Non-Clustered indexes.
- **Normalization Forms (1NF, 2NF, 3NF):** Structuring data to minimize redundancy.
- **Data Backup Strategies:** Full, Differential, and Transaction Log backups.

---

## 5. Step-by-Step Implementation Plan (How We Will Make It)

### Phase 1: Database Design & Core Schema (Week 1-2)
- Create the database in SQL Server.
- Create all tables: `Students`, `Hostels`, `Rooms`, `Beds`, `Allocations`, `WaitingList`, `Payments`.
- Enforce constraints: Primary Keys (PK), Foreign Keys (FK), `UNIQUE`, `CHECK`, and `NOT NULL`.
- Generate sample/mock data (e.g., 10 hostels, 1000 rooms, 5000 students) using scripts or data generation tools to make performance testing realistic.

### Phase 2: Implement Business Rules & Logic (Week 3)
- Write a Stored Procedure: `sp_AllocateBed`. This procedure should start a transaction, check if a bed is available, assign it, generate a payment record, and commit.
- Write Triggers: Ensure capacity is not exceeded, or handle auto-moving students to a `WaitingList` if the hostel is full.

### Phase 3: Concurrency Control Implementation (Week 4)
- **The Experiment:** Write a Python/C# script (or run multiple SSMS tabs simultaneously) that tries to execute `sp_AllocateBed` for the *same bed* using different student IDs.
- Set the transaction isolation level to `READ COMMITTED`. Observe conflicts.
- Change isolation to `SERIALIZABLE`. Observe locking, blocking, and deadlock scenarios.
- Catch deadlocks using SQL Profiler and document how the Database Engine resolves them (Deadlock Victim).

### Phase 4: Performance Optimization & Indexing (Week 5)
- **The Experiment:** Run heavy queries (e.g., "Find all students who have pending payments in a specific hostel").
- Check the **Execution Plan** in SSMS (note the physical/logical reads, CPU cost, and Table Scans).
- Create Non-Clustered Indexes on `hostel_id`, `status`, etc.
- Re-run the queries and compare the new Execution Plan (Index Seeks vs. Table Scans) to prove performance improvement.

### Phase 5: Normalization Impact Analysis (Week 6)
- Create a secondary, deliberately "Denormalized" table (e.g., combining `Students`, `Allocations`, and `Payments` into one massive flat table).
- Run identical analytical queries against both the Normalized (3NF) tables using `JOIN`s, and the Denormalized table.
- Document the trade-offs: Write speed vs. Read speed, and storage space differences.

### Phase 6: Backup and Recovery Strategy (Week 6-7)
- Configure **Recovery Model** to `Full`.
- Execute a **Full Backup**.
- Insert 100 new allocations, perform a **Differential Backup**.
- Insert 50 more allocations, perform a **Transaction Log Backup**.
- **The Crash Simulation:** Deliberately delete data or drop a table.
- Perform a point-in-time recovery using the Transaction Log backup to restore the database right before the "crash" happened.

### Phase 7: Documentation and Data Analysis (Week 7-8)
- Gather all screenshots from SQL Profiler, Execution Plans, and SSMS outputs.
- Create comparison charts (Execution time with Index vs. Without Index).
- Write up the conclusions based on expected results from the proposal.

---

## Next Steps
Whenever you are ready to begin **Phase 1**, let me know. I can provide the exact SQL script (Data Definition Language - DDL) to create your database, tables, and relationships exactly as depicted in your ER diagram!
