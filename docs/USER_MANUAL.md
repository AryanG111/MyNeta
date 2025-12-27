# MyNeta User Manual

## Introduction

MyNeta is a Political Campaign Management System designed for PMC Elections. This manual guides you through all features of the system.

---

## Getting Started

### Accessing the System

Open your web browser and navigate to `http://localhost:5000`. You will see the login page.

### Logging In

1. Go to the **Login** page
2. Select your role: **Admin**, **Volunteer**, or **Voter**
3. Enter your **email/username**
4. Enter your **password**
5. Click **Sign In**

You will be redirected to the appropriate dashboard based on your role.

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | subhash@myneta.app | Vedish0101 |
| Volunteer | sahil@myneta.app | Sahil@6055 |

---

## Admin Dashboard

After logging in as Admin, you see the main dashboard with statistics and navigation sidebar.

### Dashboard Overview

The dashboard displays:
- **Total Voters** - Number of voters in database
- **Supporters** - Voters marked as supporters
- **Complaints** - Active complaints count
- **Volunteers** - Number of active volunteers
- **Voter Distribution Chart** - Pie chart showing supporter/neutral/opponent split
- **Complaint Status Chart** - Bar chart showing pending/in-progress/resolved

### Navigation Sidebar

Click any menu item to navigate:
- **Dashboard** - Home page with statistics
- **Voter Management** - Add, edit, delete voters
- **Complaints** - Manage voter complaints
- **Events & Campaigns** - Create and manage events
- **Volunteers** - Approve and manage volunteers
- **Reports** - View detailed analytics
- **Settings** - System configuration

---

## Managing Voters

### Viewing Voters

1. Click **Voter Management** in sidebar
2. See the table of all voters with Name, Address, Booth, Phone, Category
3. Use the **Search** box to find specific voters

### Adding a New Voter

1. Click **Add New Voter** button
2. Enter:
   - **Name** (required)
   - **Phone Number**
   - **Address**
   - **Booth Number**
   - **Category** (supporter/neutral/opponent)
3. Click **Save**

### Editing a Voter

1. Find the voter in the table
2. Click **Edit** button in Actions column
3. Modify the details
4. Click **Save**

### Deleting a Voter

1. Find the voter in the table
2. Click **Delete** button
3. Confirm deletion when prompted

### Categorizing Voters

Categories help track voter sentiment:
- **Supporter** (Green badge) - Likely to vote for candidate
- **Neutral** (Yellow badge) - Undecided voter
- **Opponent** (Red badge) - Supports opposing candidate

---

## Managing Complaints

### Viewing Complaints

1. Click **Complaints** in sidebar
2. See all complaints with Voter Name, Issue, Status, Date
3. Use **Filter** dropdown to show only Pending, In Progress, or Resolved

### Adding a Complaint

1. Click **Add Complaint** button
2. Select the **Voter** who filed the complaint
3. Enter the **Issue** description
4. Set **Priority** (Low/Medium/High)
5. Click **Save**

### Updating Complaint Status

1. Find the complaint in the table
2. Click **Update** button
3. Change status:
   - **Pending** - Not yet addressed
   - **In Progress** - Being worked on
   - **Resolved** - Issue fixed
4. Click **Save**

---

## Managing Events

### Viewing Events

1. Click **Events & Campaigns** in sidebar
2. See all events with Title, Description, Date, Location

### Creating an Event

1. Click **Add Event** button
2. Enter:
   - **Title** (e.g., "Ward Meeting - Shivajinagar")
   - **Description** (details about the event)
   - **Date** (when it will happen)
   - **Location** (venue)
3. Click **Save**

### Editing/Deleting Events

- Click **Edit** to modify event details
- Click **Delete** to remove an event

---

## Managing Volunteers

### Pending Approvals

When someone registers as a volunteer, their application appears in the **Pending Approvals** section.

1. Click **Volunteers** in sidebar
2. See pending applications at top
3. Review applicant details
4. Click **Approve** to accept or **Reject** to decline

### Active Volunteers

Below pending approvals, see all approved volunteers with:
- Name, Email, Mobile, Area
- Last Login date
- Actions: Edit, Deactivate

### Deactivating a Volunteer

If a volunteer should no longer have access:
1. Find them in the Active Volunteers table
2. Click the **Deactivate** button
3. Confirm when prompted

---

## Volunteer Guide

As a Volunteer, your access is limited but you can still help the campaign.

### What You Can Do

- **View Voters** - Browse and search the voter database
- **Add Complaints** - Record issues voters report to you
- **View Events** - See upcoming campaign events
- **View Dashboard** - See basic campaign statistics

### What You Cannot Do

- Add, edit, or delete voters
- Change complaint status
- Create or manage events
- Approve other volunteers

---

## Public User Guide

### Registering an Account

1. Click **Create Account** on login page
2. Enter your Name, Email, Password
3. Select **Voter** as role
4. Click **Register**

### Filing a Complaint

1. Log in to your account
2. Click **Add Complaint**
3. Describe your issue
4. Submit the complaint
5. Admin/volunteers will follow up

### Applying as Volunteer

1. Go to registration page
2. Select **Volunteer** role
3. Fill in your details
4. Submit application
5. Wait for admin approval (you'll receive access once approved)

---

## Logging Out

Click the **Logout** button at the bottom of the sidebar. You will be redirected to the login page.

---

## Troubleshooting

### Can't Login
- Check if email and password are correct
- Volunteers: ensure your application was approved
- Try clearing browser cache

### Dashboard Shows No Data
- Database may be empty
- Ask admin to import voter data

### Buttons Not Working
- Refresh the page
- Check browser console for errors
- Ensure you have the required permissions

---

## Support

For technical issues, contact the system administrator.

---

*MyNeta v1.0 - PMC Elections Campaign Management*
