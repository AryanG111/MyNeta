# MyNeta - Entity Relationship Diagram

## Database ERD

```mermaid
erDiagram
    Users {
        int id PK
        string name
        string email UK
        string password_hash
        enum role "admin|volunteer|voter"
        string mobile
        string area
        string avatar_path
        boolean is_approved
        int approved_by FK
        datetime approved_at
        datetime last_login
        datetime createdAt
        datetime updatedAt
    }

    Voters {
        int id PK
        string epic_encrypted
        string name
        int age
        string gender
        text address
        string booth
        string city
        string section
        string part_no
        text notes
        string phone
        enum category "supporter|neutral|opponent"
        datetime createdAt
        datetime updatedAt
    }

    Complaints {
        int id PK
        int voter_id FK
        text issue
        enum status "pending|in_progress|resolved"
        text resolution
        enum priority "low|medium|high"
        datetime createdAt
        datetime updatedAt
    }

    Events {
        int id PK
        string title
        text description
        datetime event_date
        string location
        enum event_type "meeting|campaign|rally|other"
        enum status "scheduled|ongoing|completed|cancelled"
        int attendees_count
        decimal budget
        datetime createdAt
        datetime updatedAt
    }

    AuditLogs {
        int id PK
        int user_id FK
        string action
        string entity_type
        int entity_id
        text old_values
        text new_values
        datetime createdAt
        datetime updatedAt
    }

    Logins {
        int id PK
        int voter_id FK
        string ip_address
        string user_agent
        datetime createdAt
        datetime updatedAt
    }

    VotersImports {
        int id PK
        string filename
        int total_rows
        int imported_rows
        int failed_rows
        enum status "pending|processing|completed|failed"
        datetime createdAt
        datetime updatedAt
    }

    VolunteerRequests {
        int id PK
        string name
        string email
        string phone
        string password_hash
        string avatar_path
        text message
        enum status "pending|approved|rejected"
        datetime createdAt
        datetime updatedAt
    }

    Users ||--o{ AuditLogs : "creates"
    Users ||--o| Users : "approved_by"
    Voters ||--o{ Complaints : "files"
    Voters ||--o{ Logins : "has"
```

## Relationships Summary

| Parent | Child | Relationship | Description |
|--------|-------|--------------|-------------|
| **Users** | AuditLogs | 1:N | User actions are logged |
| **Users** | Users | 1:1 (self) | Admin approves volunteers |
| **Voters** | Complaints | 1:N | Voter files complaints |
| **Voters** | Logins | 1:N | Voter login history |

## Entity Descriptions

### Users
Central user table for all authenticated users (admins, volunteers, voters who register).

### Voters  
Voter database containing voter roll information. Not linked to Users - these are constituents, not system users.

### Complaints
Issues/complaints filed by voters, tracked through resolution workflow.

### Events
Campaign events like meetings, rallies, door-to-door campaigns.

### AuditLogs
Tracks all user actions for accountability and debugging.

### Logins
Records voter login attempts (for public portal).

### VotersImports
Tracks bulk imports of voter data from Excel files.

### VolunteerRequests
Pending volunteer registration requests awaiting admin approval.

---

## Cardinality Notation

| Symbol | Meaning |
|--------|---------|
| `\|\|` | Exactly one |
| `o\|` | Zero or one |
| `\|{` | One or many |
| `o{` | Zero or many |
