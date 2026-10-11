# QuickNotes System Architecture

## 1. Overview

QuickNotes is a note-taking application that allows users to create, read, update, and delete notes. The system uses a web client, an API layer, caching, a relational database, and background workers to support reliability and growth.

## 2. Functional Requirements

- Users can create an account and sign in securely.
- Users can create, view, edit, and delete their notes.
- Users can search and organize notes using tags.
- Users can only access notes they are authorized to view.
- The system displays clear loading, success, empty, and error states.

## 3. Non-Functional Requirements

- **Performance:** Most read requests should respond within 300 milliseconds under normal load.
- **Availability:** The service should target 99.9% availability.
- **Security:** Authentication, authorization, encrypted connections, and secure password storage are required.
- **Scalability:** The application should support increasing users by adding application servers.
- **Reliability:** Backups, monitoring, and recovery procedures should protect against data loss.
- **Maintainability:** Clear APIs, automated tests, and documentation should make the system easier to update.

## 4. High-Level Architecture Diagram

```text
                    +------------------+
                    |   Web Client     |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |       DNS        |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |       CDN        |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | Load Balancer    |
                    +--------+---------+
                             |
                  +----------+----------+
                  |                     |
                  v                     v
          +---------------+     +---------------+
          | App Server 1  |     | App Server 2  |
          +-------+-------+     +-------+-------+
                  |                     |
                  +----------+----------+
                             |
                    +--------+---------+
                    |   Cache (Redis)  |
                    +--------+---------+
                             |
                    +--------+---------+
                    | Primary Database |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |   Read Replica   |
                    +------------------+

          App Servers -----> Message Queue
                                  |
                                  v
                           Background Worker
```

## 5. Component Responsibilities

- **Web Client:** Provides the interface for users to manage notes.
- **DNS:** Resolves the application domain to the correct network address.
- **CDN:** Delivers static files such as CSS, JavaScript, and images from locations closer to users.
- **Load Balancer:** Distributes incoming API requests across healthy application servers.
- **Application Servers:** Validate requests, enforce access controls, and implement business logic.
- **Cache:** Stores frequently accessed data temporarily to reduce database load and improve response times.
- **Primary Database:** Stores authoritative user, note, and tag data and handles writes.
- **Read Replica:** Handles eligible read queries to reduce pressure on the primary database.
- **Message Queue:** Holds background tasks so they can be processed asynchronously.
- **Background Worker:** Processes tasks such as notifications, exports, and other time-consuming work.

## 6. Request Flows

### GET /notes

1. The user opens the notes page in the web client.
2. DNS resolves the application domain, and the client sends the request through the CDN and load balancer.
3. The load balancer routes the request to a healthy application server.
4. The server authenticates the user and checks authorization.
5. The server checks the cache for the user's notes.
6. If the data is not cached, the server queries the database or an appropriate read replica.
7. The server returns the notes as JSON, and the client displays them.

### POST /notes

1. The user submits a note through the web client.
2. The client sends a POST request containing the title and body.
3. The load balancer routes the request to a healthy application server.
4. The server validates the input and verifies the user's identity and permissions.
5. The server saves the note to the primary database.
6. The server invalidates or updates relevant cached data.
7. The API returns a `201 Created` response with the saved note.
8. If additional background work is needed, the server publishes a task to the message queue.

## 7. Scaling Estimate for One Million Users

These are planning assumptions, not measured production statistics.

Assume one million registered users, with 10% active on an average day. Assume each daily active user performs 20 reads and 2 writes per day.

### Read and Write Load

- Daily active users: 1,000,000 × 10% = 100,000.
- Reads per day: 100,000 × 20 = 2,000,000.
- Writes per day: 100,000 × 2 = 200,000.
- Average reads per second: 2,000,000 ÷ 86,400 ≈ 23.
- Average writes per second: 200,000 ÷ 86,400 ≈ 2.3.

For planning, the system should be tested for peak traffic significantly above these averages, for example 10 times the average load.

### Storage Estimate

Assume each stored note, including its text and basic metadata, averages 2 KB, and each daily active user creates two notes per day.

- New notes per day: 100,000 × 2 = 200,000.
- Storage per day: 200,000 × 2 KB = 400 MB.
- Storage per year: 400 MB × 365 ≈ 146 GB.

This estimate excludes indexes, replicas, backups, logs, and other database overhead. Actual storage depends on note sizes and user activity.

## 8. Trade-Offs

### SQL vs NoSQL

A relational database provides strong consistency, transactions, and clear relationships between users, notes, and tags. NoSQL can offer flexible data models and can suit some high-scale access patterns. QuickNotes should start with SQL because its data is relational and needs integrity constraints.

### Caching vs Freshness

Caching improves read performance and reduces database load, but cached data can become stale. The application should invalidate or update the cache after note changes and use a suitable expiration policy.

### Read Replicas vs Consistency

Read replicas improve read capacity, but replication delay can cause recently written notes to appear late in reads. Requests that require immediately consistent results should read from the primary database.

### Synchronous vs Asynchronous Work

Synchronous processing gives immediate feedback but can increase response time. A message queue and background worker allow slower tasks to run separately, but require retry handling and monitoring.

## 9. Avoiding Single Points of Failure

- Run at least two application servers behind a load balancer.
- Use health checks to stop routing traffic to unhealthy servers.
- Deploy the database with automated backups and a tested failover plan.
- Monitor the cache and provide a fallback strategy if it becomes unavailable.
- Use a durable message queue and retry failed background tasks.
- Monitor errors, latency, database health, and resource usage.
- Test recovery procedures regularly.