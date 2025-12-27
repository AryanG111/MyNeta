# MyNeta - Project Scope Document

## Executive Summary

**MyNeta** is a comprehensive Political Campaign Management System designed for PMC (Pune Municipal Corporation) Elections. It enables political candidates and their teams to manage voter databases, track complaints, organize events, and coordinate volunteer activities through a centralized web-based platform.

---

## Project Overview

| Attribute | Value |
|-----------|-------|
| **Project Name** | MyNeta |
| **Domain** | Political Campaign Management |
| **Target Election** | PMC Elections |
| **Candidate** | Swati Subhash Dhore Campaign |
| **Platform** | Web Application |

---

## Objectives

1. **Voter Management** - Maintain a comprehensive database of voters with categorization (supporter/neutral/opponent)
2. **Complaint Tracking** - Record and track voter complaints and issues
3. **Event Management** - Plan and manage campaign events, rallies, and meetings
4. **Volunteer Coordination** - Manage volunteer registrations, approvals, and assignments
5. **Analytics & Reports** - Provide insights through dashboards and reports

---

## User Roles & Access

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **Admin** | Full | All features, user management, approvals |
| **Volunteer** | Limited | View voters, add complaints, events |
| **Voter** | Public | View public dashboard, register complaints |

---

## Core Features

### 1. Authentication & Authorization
- [x] Email/Password login
- [x] Role-based access control
- [x] JWT token authentication
- [x] Volunteer approval workflow

### 2. Voter Management
- [x] Add/Edit/Delete voters
- [x] Voter categorization (supporter/neutral/opponent)
- [x] Search and filter voters
- [x] Booth assignment
- [x] Voter count statistics

### 3. Complaint Management
- [x] Create complaints linked to voters
- [x] Status tracking (pending/in_progress/resolved)
- [x] Priority levels
- [x] Filter by status

### 4. Event Management
- [x] Create/Edit/Delete events
- [x] Event types (meeting/campaign/rally)
- [x] Location and date tracking
- [x] Status management

### 5. Volunteer Management
- [x] Volunteer registration
- [x] Admin approval workflow
- [x] Active/Pending volunteer lists
- [x] Volunteer deactivation

### 6. Dashboard & Analytics
- [x] Voter category distribution chart
- [x] Complaint status overview
- [x] Key statistics cards
- [x] Monthly activity reports

---

## Technology Stack

### Backend
| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express 5.x |
| ORM | Sequelize 6.x |
| Database | SQLite (development) |
| Auth | JWT + bcrypt |
| Validation | Joi |

### Frontend
| Component | Technology |
|-----------|------------|
| UI | HTML5/CSS3/JavaScript |
| CSS Framework | Bootstrap 5.3 |
| Icons | Font Awesome 6.4 |
| Charts | Chart.js |
| Fonts | Inter (Google Fonts) |

### Security
- JWT token authentication (8h expiry)
- Password hashing (bcrypt)
- Rate limiting
- Helmet.js security headers
- CORS protection

---

## Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Users     │     │   Voters    │     │  Complaints │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ name        │     │ name        │     │ voter_id    │──┐
│ email       │     │ phone       │     │ issue       │  │
│ password    │     │ address     │     │ status      │  │
│ role        │     │ booth       │     │ priority    │  │
│ is_approved │     │ category    │     └─────────────┘  │
└─────────────┘     └─────────────┘◄────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Events    │     │  AuditLogs  │     │VolunteerReq │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ title       │     │ user_id     │     │ name        │
│ description │     │ action      │     │ email       │
│ event_date  │     │ entity      │     │ phone       │
│ location    │     │ createdAt   │     │ status      │
│ event_type  │     └─────────────┘     └─────────────┘
└─────────────┘
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |

### Voters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/voters | List all voters |
| GET | /api/voters/counts | Category counts |
| POST | /api/voters | Create voter |
| PUT | /api/voters/:id | Update voter |
| DELETE | /api/voters/:id | Delete voter |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/complaints | List complaints |
| POST | /api/complaints | Create complaint |
| PATCH | /api/complaints/:id/status | Update status |
| DELETE | /api/complaints/:id | Delete complaint |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | List events |
| POST | /api/events | Create event |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |

### Volunteers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/volunteers | List volunteers |
| POST | /api/volunteers/:id/approve | Approve volunteer |
| POST | /api/volunteers/:id/reject | Reject volunteer |

---

## Project Structure

```
MyNeta/
├── backend/
│   ├── config/           # Database config
│   ├── migrations/       # Database migrations
│   ├── models/           # Sequelize models
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API routes
│   │   ├── app.js        # Express app
│   │   └── server.js     # Server entry
│   └── package.json
└── public/
    ├── css/              # Stylesheets
    ├── js/               # Frontend scripts
    ├── img/              # Images
    ├── admin-dashboard.html
    ├── volunteer-dashboard.html
    ├── public-dashboard.html
    ├── login.html
    └── register.html
```

---

## Current Status

### Completed ✅
- Backend API infrastructure
- Database schema and migrations
- Authentication system
- Admin dashboard with dynamic data
- CRUD operations for all entities
- Sample data seeding

### In Progress 🔄
- Full modal forms for CRUD operations
- Volunteer dashboard functionality
- Public dashboard functionality

### Planned 📋
- Excel import for bulk voter data
- SMS notifications
- PDF report generation
- Mobile-responsive enhancements

---

## Deployment Requirements

| Resource | Requirement |
|----------|-------------|
| Node.js | v18+ |
| Database | SQLite (dev) / MySQL (prod) |
| RAM | 512MB minimum |
| Storage | 1GB+ for database |

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | subhash@myneta.app | Vedish0101 |
| Volunteer | sahil@myneta.app | Sahil@6055 |

---

*Document Generated: December 27, 2025*
