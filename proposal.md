SEMESTER PROJECT PROPOSAL
Performance, Concurrency Control, and Recovery
Evaluation in a Multi-User Hostel Room Allocation System
Group Member 1:
Tehseen Tahir
01-135231-088
Group Member 2:
Umme Zainab
01-135231-089
Instructor:
Dr. Muhammad Asif
Course: Database Administration and Management
DEPARTMENT OF COMPUTER SCIENCE
Bahria University, Islamabad
February 22, 2026
Contents
1 Introduction 2
2 Related Work 2
3 Problem Statement 2
4 Proposed Solution 3
4.1 Database Design . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
4.2 Concurrency Control Implementation . . . . . . . . . . . . . . . . . . . . . . 5
4.3 Performance Optimization . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
4.4 Normalization Evaluation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
4.5 Backup and Recovery Strategy . . . . . . . . . . . . . . . . . . . . . . . . . . 5
5 Experiments 5
6 Equipment / Software Required 5
7 Schedule and Milestones 6
8 Expected Results 6
9 Conclusion 6
1
1 Introduction
Hostel room allocation systems are essential components of university infrastructure, responsible for managing student accommodation efficiently and fairly. During peak admission periods, hundreds of students may attempt to reserve limited hostel rooms simultaneously. Such
high-concurrency environments introduce significant database-level challenges including double allocation of beds, transaction conflicts, deadlocks, performance degradation, and data
inconsistency.
The objective of this project is not merely to build a hostel allocation application, but to investigate how advanced Database Administration and Management techniques can improve
concurrency control, performance optimization, normalization efficiency, and recovery reliability in a multi-user database system.
This study experimentally evaluates transaction isolation levels, indexing strategies, normalization approaches, and backup models within a controlled hostel room allocation database
environment. The expected outcome is to determine which database configurations provide the
best balance between consistency, throughput, and recovery efficiency under concurrent access
conditions.
2 Related Work
Database research emphasizes the importance of ACID properties, concurrency control mechanisms, indexing optimization, normalization design, and disaster recovery strategies in multiuser systems. Improper isolation levels may result in anomalies such as dirty reads, phantom
reads, and lost updates. Similarly, inefficient indexing or schema design can significantly
degrade performance in high-load environments.
In allocation-based systems such as ticket booking, seat reservation, and accommodation management platforms, most implementations prioritize application logic while underutilizing
database-level optimizations. Academic studies indicate that higher isolation levels improve
consistency but may reduce throughput, indexing improves query execution time, and proper
normalization enhances data integrity at the cost of more complex joins.
Despite these findings, few practical systems experimentally compare these database administration strategies under simulated concurrent workloads. This project aims to bridge that gap
by implementing and evaluating these techniques in a structured hostel room allocation system.
3 Problem Statement
In a multi-user hostel room allocation system, simultaneous access to limited resources (rooms
and beds) introduces complex database challenges. These include:
2
• Double allocation of the same bed.
• Deadlocks during concurrent booking transactions.
• Performance bottlenecks under large student datasets.
• Data inconsistency due to inappropriate isolation levels.
• Data loss risks during unexpected crashes.
The central research question of this project is:
How do transaction isolation levels, indexing strategies, normalization techniques, and backup
models impact performance, concurrency control, and recovery efficiency in a multi-user hostel
room allocation database system?
This qualifies as a Complex Computing Problem because it involves multi-user concurrency
simulation, transaction management analysis, deadlock detection, query optimization benchmarking, and backup recovery experimentation.
4 Proposed Solution
The proposed solution is to design and implement a relational database system using Microsoft
SQL Server 2022 that supports multi-user hostel room allocation while integrating advanced
database administration techniques.
4.1 Database Design
The system will include core entities such as Students, Hostels, Rooms, Beds, Allocations, WaitingList, and Payments. The schema will enforce primary keys, foreign keys, unique constraints,
check constraints, NOT NULL constraints, and Third Normal Form (3NF) normalization.
Stored procedures and triggers will enforce business rules such as preventing double allocation
and maintaining capacity constraints.
3
Entity Relationship Diagram
Hostel Room Allocation System
Student Allocation Bed
Payment Hostel Room
student id name email
hostel id hostel name
room id
capacity
bed id
status
allocation id
allocation date
payment id
amount
Makes Assigned Belongs
Located
Generates
1 N N 1 N
1
N
1
1
1
1
Figure 1: Entity Relationship Diagram of the Hostel Room Allocation System
4
4.2 Concurrency Control Implementation
Different isolation levels including Read Committed, Repeatable Read, and Serializable will
be tested. Concurrent booking simulations will be performed to analyze locking behavior,
blocking, and deadlock scenarios.
4.3 Performance Optimization
Indexes will be created on frequently queried columns. Query execution plans will be analyzed,
and execution time, logical reads, and CPU usage will be measured before and after indexing.
4.4 Normalization Evaluation
Two schema versions (fully normalized and partially denormalized) will be implemented and
compared in terms of performance and storage efficiency.
4.5 Backup and Recovery Strategy
Full, differential, and transaction log backups will be configured. Crash simulations will be
performed to evaluate recovery time and data integrity.
5 Experiments
The following experiments will be conducted:
1. Concurrency and Isolation Level Testing
2. Index Performance Evaluation
3. Normalization Impact Analysis
4. Backup and Recovery Testing
Each experiment will measure execution time, system resource usage, data consistency, and
recovery efficiency.
6 Equipment / Software Required
• Microsoft SQL Server 2022
• SQL Server Management Studio (SSMS)
• Windows Operating System
• SQL Profiler
5
7 Schedule and Milestones
• Week 1: Literature Review and Research Finalization
• Week 2: Database Schema Design
• Week 3: Core Implementation
• Week 4: Concurrency Testing
• Week 5: Indexing and Performance Analysis
• Week 6: Backup and Recovery Testing
• Week 7: Data Analysis and Documentation
• Week 8: Final Preparation and Submission
8 Expected Results
Higher isolation levels are expected to reduce anomalies but may impact throughput. Indexing is
expected to significantly improve query performance. Normalization will enhance data integrity
while potentially increasing query complexity. Transaction log backups are expected to reduce
recovery time and improve reliability.
9 Conclusion
This project investigates advanced database administration techniques within a multi-user hostel
room allocation environment. Through implementation and experimental evaluation of concurrency control, indexing optimization, normalization strategies, and backup mechanisms, the
study aims to provide scientific insights into database performance optimization and recovery
reliability in real-world allocation systems.
6