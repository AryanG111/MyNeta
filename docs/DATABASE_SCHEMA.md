# MyNeta Database Schema

## Overview

Database: **SQLite** (development) / MySQL (production)
ORM: **Sequelize 6.x**

---

## Tables

### 1. Users

Stores all authenticated users (admins, volunteers, voters).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM | NOT NULL | 'admin', 'volunteer', 'voter' |
| mobile | VARCHAR(255) | NULL | Phone number |
| area | VARCHAR(255) | NULL | Assigned area |
| avatar_path | VARCHAR(255) | NULL | Profile picture path |
| is_approved | BOOLEAN | DEFAULT false | Volunteer approval status |
| approved_by | INTEGER | FK → Users.id | Admin who approved |
| approved_at | DATETIME | NULL | Approval timestamp |
| last_login | DATETIME | NULL | Last login time |
| createdAt | DATETIME | NOT NULL | Record creation |
| updatedAt | DATETIME | NOT NULL | Last update |

---

### 2. Voters

Voter database containing constituent information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| epic_encrypted | TEXT | NULL | Encrypted voter ID |
| name | VARCHAR(255) | NOT NULL | Voter's name |
| age | INTEGER | NULL | Age |
| gender | VARCHAR(255) | NULL | Gender |
| address | TEXT | NULL | Full address |
| booth | VARCHAR(255) | NULL | Polling booth |
| city | VARCHAR(255) | NULL | City name |
| section | VARCHAR(255) | NULL | Section/Ward |
| part_no | VARCHAR(255) | NULL | Part number |
| notes | TEXT | NULL | Additional notes |
| phone | VARCHAR(255) | NULL | Contact number |
| category | ENUM | DEFAULT 'neutral' | 'supporter', 'neutral', 'opponent' |
| createdAt | DATETIME | NOT NULL | Record creation |
| updatedAt | DATETIME | NOT NULL | Last update |

---

### 3. Complaints

Issues filed by voters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| voter_id | INTEGER | FK → Voters.id | Related voter |
| issue | TEXT | NOT NULL | Complaint description |
| status | ENUM | DEFAULT 'pending' | 'pending', 'in_progress', 'resolved' |
| resolution | TEXT | NULL | How it was resolved |
| priority | VARCHAR(255) | DEFAULT 'medium' | 'low', 'medium', 'high' |
| createdAt | DATETIME | NOT NULL | Record creation |
| updatedAt | DATETIME | NOT NULL | Last update |

---

### 4. Events

Campaign events and activities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Event title |
| description | TEXT | NULL | Event details |
| event_date | DATETIME | NULL | Date and time |
| location | VARCHAR(255) | NULL | Venue |
| event_type | ENUM | DEFAULT 'meeting' | 'meeting', 'campaign', 'rally', 'other' |
| status | ENUM | DEFAULT 'scheduled' | 'scheduled', 'ongoing', 'completed', 'cancelled' |
| attendees_count | INTEGER | NULL | Expected attendees |
| budget | DECIMAL(10,2) | NULL | Event budget |
| createdAt | DATETIME | NOT NULL | Record creation |
| updatedAt | DATETIME | NOT NULL | Last update |

---

### 5. AuditLogs

Tracks user actions for accountability.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| user_id | INTEGER | FK → Users.id | User who acted |
| action | VARCHAR(255) | NOT NULL | Action performed |
| entity_type | VARCHAR(255) | NULL | Table affected |
| entity_id | INTEGER | NULL | Record ID affected |
| old_values | TEXT | NULL | Previous values (JSON) |
| new_values | TEXT | NULL | New values (JSON) |
| createdAt | DATETIME | NOT NULL | Action timestamp |
| updatedAt | DATETIME | NOT NULL | Last update |

---

### 6. Logins

Voter login tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| voter_id | INTEGER | FK → Voters.id | Voter who logged in |
| ip_address | VARCHAR(255) | NULL | Client IP |
| user_agent | TEXT | NULL | Browser info |
| createdAt | DATETIME | NOT NULL | Login time |
| updatedAt | DATETIME | NOT NULL | Last update |

---

### 7. VotersImports

Bulk import tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| filename | VARCHAR(255) | NULL | Uploaded file name |
| total_rows | INTEGER | NULL | Total rows in file |
| imported_rows | INTEGER | NULL | Successfully imported |
| failed_rows | INTEGER | NULL | Failed imports |
| status | ENUM | NULL | 'pending', 'processing', 'completed', 'failed' |
| createdAt | DATETIME | NOT NULL | Import start |
| updatedAt | DATETIME | NOT NULL | Last update |

---

### 8. VolunteerRequests

Pending volunteer applications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Applicant name |
| email | VARCHAR(255) | NOT NULL | Email address |
| phone | VARCHAR(255) | NOT NULL | Phone number |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| avatar_path | VARCHAR(255) | NULL | Profile picture |
| message | TEXT | NULL | Application message |
| status | ENUM | DEFAULT 'pending' | 'pending', 'approved', 'rejected' |
| createdAt | DATETIME | NOT NULL | Application date |
| updatedAt | DATETIME | NOT NULL | Last update |

---

## Foreign Key Relationships

| Table | Column | References | On Delete |
|-------|--------|------------|-----------|
| Complaints | voter_id | Voters.id | CASCADE |
| AuditLogs | user_id | Users.id | SET NULL |
| Logins | voter_id | Voters.id | CASCADE |
| Users | approved_by | Users.id | SET NULL |

---

## Indexes

| Table | Column(s) | Type |
|-------|-----------|------|
| Users | email | UNIQUE |
| Voters | category | INDEX |
| Complaints | status | INDEX |
| Events | event_date | INDEX |
