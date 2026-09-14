# PMS Enterprise — User Manual

**Project Management System**
Version 1.0

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [Installation & Setup](#3-installation--setup)
4. [Getting Started](#4-getting-started)
5. [Login](#5-login)
6. [Dashboard](#6-dashboard)
7. [Projects](#7-projects)
8. [Team](#8-team)
9. [Kanban Board](#9-kanban-board)
10. [Admin Panel](#10-admin-panel)
11. [Invitation System](#11-invitation-system)
12. [User Roles & Permissions](#12-user-roles--permissions)
13. [API Reference](#13-api-reference)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Introduction

PMS Enterprise is an internal project management system designed for team managers and department leads. It provides a centralized view of active projects, team workload, upcoming deadlines, and required actions.

**Key features:**

- Invite-only authentication (no self-registration)
- Workspace-based organization
- Role-based access control (Admin / Member)
- Real-time dashboard with computed statistics
- Filterable project and team directories
- Drag-and-drop Kanban board with persistent state
- Member invitation and management system

---

## 2. System Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | v18 or higher |
| MongoDB | v6 or higher (local or cloud) |
| Browser | Chrome, Firefox, Safari, or Edge (latest) |
| npm | v9 or higher |

---

## 3. Installation & Setup

### 3.1 Clone the Repository

```bash
git clone <repository-url>
cd PMS
```

### 3.2 Install Dependencies

Install both frontend and backend dependencies:

```bash
npm install
cd server && npm install && cd ..
```

### 3.3 Configure Environment Variables

Copy the example environment file and edit it:

```bash
cp .env.example .env
```

Open `.env` and configure the following variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/pms` |
| `JWT_SECRET` | Secret key for JWT tokens (change this!) | — |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `SMTP_HOST` | Email server host | `smtp.ethereal.email` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email account username | — |
| `SMTP_PASS` | Email account password | — |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `ADMIN_EMAIL` | Initial admin email | `admin@pms.com` |
| `ADMIN_PASSWORD` | Initial admin password | `admin123` |
| `ADMIN_NAME` | Initial admin display name | `Admin` |

> **Important:** Always change `JWT_SECRET` before deploying to production.

### 3.4 Seed the Database

Populate the database with initial data (admin user, team members, sample projects, and tasks):

```bash
npm run seed
```

The seed script will output:
- Admin login credentials
- Sample member credentials
- The default workspace ID

### 3.5 Start the Application

Run both the frontend and backend simultaneously:

```bash
npm run dev
```

This starts:
- **Frontend** (Vite) at `http://localhost:5173`
- **Backend** (Express) at `http://localhost:5000`

Open your browser and navigate to `http://localhost:5173`.

---

## 4. Getting Started

### First-Time Setup Workflow

1. Run the seed script to create the admin account
2. Log in with the admin credentials
3. You will land on the Dashboard
4. Navigate to **Admin > Invitations** to invite your team members
5. Team members receive an email with an invitation link
6. They click the link, set their name and password, and join the workspace

---

## 5. Login

**URL:** `http://localhost:5173/login`

Enter your email and password, then click **Sign In**.

- Access is invite-only — there is no registration form
- If you don't have an account, contact your workspace administrator
- After login, you are redirected to the Dashboard
- Your session remains active for 7 days (configurable via `JWT_EXPIRES_IN`)

### Logout

Click your profile name in the top-right corner of the Topbar, then click **Logout** in the dropdown menu. This clears your session and redirects you to the login page.

---

## 6. Dashboard

The Dashboard is the home page and provides an overview of your workspace activity.

### 6.1 Welcome Section

Displays a personalized greeting with your name, the number of tasks due today, and upcoming deadlines this week.

### 6.2 Statistics Cards

Four summary cards showing real-time counts:

| Card | Description |
|------|-------------|
| **Active Projects** | Number of projects with status "Active" |
| **Total Tasks** | Total number of tasks across all projects |
| **Completed Tasks** | Tasks with status "Done" |
| **Upcoming Deadlines** | Tasks due within the next 7 days |

### 6.3 Recent Activity

Shows the 10 most recent actions in the workspace (task creation, project updates, member joins, etc.) with the user who performed the action and a relative timestamp.

### 6.4 Upcoming Deadlines

Lists the nearest task deadlines with the task name, associated project, and priority level.

### 6.5 Action Required

Displays tasks assigned to you that are due within the next 7 days, sorted by priority. These are tasks that need your immediate attention.

### 6.6 Project Progress

A donut chart showing the distribution of project statuses:
- **In Progress** (navy) — Active projects
- **Completed** (red) — Finished projects
- **Pending** (gray) — On-hold projects

---

## 7. Projects

**URL:** `http://localhost:5173/projects`

### 7.1 Viewing Projects

The Projects page displays all workspace projects as cards. Each card shows:
- Project name and description
- Creation date
- Status badge (Active / Completed / In Hold)
- Progress bar (0–100%)
- Member count

### 7.2 Filtering Projects

Use the filter tabs at the top to filter by status:
- **All** — Show all projects
- **Active** — Only active projects
- **Completed** — Only completed projects
- **In Hold** — Only paused projects

### 7.3 Managing Projects (Admin Only)

Admins can create, update, and delete projects through the API. The "Add Project" button in the header is reserved for admin users.

---

## 8. Team

**URL:** `http://localhost:5173/team`

### 8.1 Viewing Team Members

The Team page displays all workspace members as cards. Each card shows:
- Member avatar and name
- Job role (e.g., "Frontend Developer")
- Availability status with color indicator:
  - **Available** (green dot)
  - **Remote** (red dot)
  - **On Leave** (gray dot)

### 8.2 Filtering by Department

Use the filter tabs to filter members by department:
- **All** — Show all members
- **Frontend** — Frontend developers
- **Backend** — Backend developers
- **Design** — UX/UI designers

### 8.3 Inviting Members (Admin Only)

Admins see an **Invite Member** button in the Team header. Clicking it opens the invite modal where you can:
1. Enter the invitee's email address
2. Select their role (Member or Admin)
3. Click **Send Invitation**

The invitee receives an email with a link to join the workspace.

---

## 9. Kanban Board

**URL:** `http://localhost:5173/kanban`

### 9.1 Board Layout

The Kanban board displays tasks organized into four columns:

| Column | Description |
|--------|-------------|
| **To Do** | Tasks not yet started |
| **In Progress** | Tasks currently being worked on |
| **Review** | Tasks awaiting review |
| **Done** | Completed tasks |

Each task card shows:
- Task title and description
- Priority badge (High / Medium / Low)
- Due date
- Assigned members (up to 2 avatars, with "+N" for additional)

### 9.2 Drag and Drop

To move a task between columns:
1. Click and hold a task card
2. Drag it to the target column
3. Release to drop

The new position is automatically saved to the server. You can also reorder tasks within the same column by dragging them up or down.

### 9.3 Task Persistence

All drag-and-drop changes are persisted to the database. If you refresh the page, tasks remain in their updated positions.

---

## 10. Admin Panel

**URL:** `http://localhost:5173/admin`

> This page is only visible to users with the **Admin** role. The "Admin" link appears in the sidebar only for admins.

### 10.1 Members Tab

Displays all workspace members in a list with:
- Avatar, name, and email
- Role badge (Admin / Member)
- Role dropdown to change a member's role
- Remove button to remove a member from the workspace

**Changing a member's role:**
1. Find the member in the list
2. Use the dropdown to select "Admin" or "Member"
3. The change takes effect immediately

**Removing a member:**
1. Click the remove button (person-x icon)
2. Confirm the action in the dialog
3. The member is removed from the workspace

> **Note:** The workspace owner cannot be removed.

### 10.2 Invitations Tab

**Sending an invitation:**
1. Enter the email address in the form at the top
2. Select the role (Member or Admin)
3. Click **Send**
4. A confirmation message appears, and the invitation is added to the list below

**Invitation statuses:**
| Status | Color | Meaning |
|--------|-------|---------|
| **Pending** | Amber | Invitation sent, awaiting acceptance |
| **Accepted** | Green | Invitee has registered and joined |
| **Expired** | Gray | Invitation exceeded the 7-day window |
| **Revoked** | Red | Admin cancelled the invitation |

**Managing pending invitations:**
- **Resend** (refresh icon) — Resends the invitation email and resets the 7-day expiration
- **Revoke** (x-circle icon) — Cancels the invitation so it can no longer be used

---

## 11. Invitation System

### How It Works

PMS uses an invite-only registration system. There is no way to create an account without an invitation.

### Invitation Flow

```
Admin sends invitation
        ↓
System generates unique token
        ↓
Email sent to invitee with link
        ↓
Invitee clicks link → /invite/:token
        ↓
System validates token (not expired, not revoked)
        ↓
Invitee sees registration form (email pre-filled)
        ↓
Invitee sets name + password → clicks "Create Account & Join"
        ↓
Account created → added to workspace → logged in automatically
```

### Invitation Details

- Each invitation contains a cryptographically secure token
- Invitations expire after **7 days**
- An invitation can be resent (resets the expiration timer)
- An invitation can be revoked at any time before acceptance
- The invitee's email is locked to the invitation — they cannot change it during registration
- If no SMTP credentials are configured, the system uses Ethereal (test email service) and prints the email preview URL to the server console

### Email Configuration

For production, configure real SMTP credentials in `.env`:

```
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASS=your-email-password
```

For development, leave `SMTP_USER` and `SMTP_PASS` empty — the system will use Ethereal and log the preview URL to the server console.

---

## 12. User Roles & Permissions

PMS has two roles at the workspace level:

### Admin

| Action | Allowed |
|--------|---------|
| View Dashboard, Projects, Team, Kanban | Yes |
| Drag-and-drop tasks on Kanban | Yes |
| Create / Update / Delete projects | Yes |
| Delete tasks | Yes |
| Send invitations | Yes |
| Revoke / Resend invitations | Yes |
| Change member roles | Yes |
| Remove members from workspace | Yes |
| Access Admin panel | Yes |
| See "Admin" in sidebar | Yes |
| See "Invite Member" button on Team page | Yes |

### Member

| Action | Allowed |
|--------|---------|
| View Dashboard, Projects, Team, Kanban | Yes |
| Drag-and-drop tasks on Kanban | Yes |
| Create tasks | Yes |
| Update tasks | Yes |
| Create / Update / Delete projects | No |
| Delete tasks | No |
| Send invitations | No |
| Access Admin panel | No |
| Change member roles | No |
| Remove members | No |

---

## 13. API Reference

All API endpoints are prefixed with `/api`. Workspace-scoped endpoints use `/api/workspaces/:workspaceId/...`.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login with email + password | No |
| POST | `/api/auth/register` | Register via invitation token | No |
| POST | `/api/auth/validate-invite/:token` | Validate an invitation | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/me` | Update own profile | Yes |

### Workspaces

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/workspaces` | Create workspace | Any |
| GET | `/api/workspaces` | List user's workspaces | Any |
| GET | `/api/workspaces/:id` | Get workspace details | Member |
| PUT | `/api/workspaces/:id` | Update workspace | Admin |
| DELETE | `/api/workspaces/:id` | Delete workspace | Admin (owner) |
| GET | `/api/workspaces/:id/members` | List members | Member |
| PUT | `/api/workspaces/:id/members/:userId/role` | Change member role | Admin |
| DELETE | `/api/workspaces/:id/members/:userId` | Remove member | Admin |

### Projects

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `.../projects` | List projects (filter: `?status=`) | Member |
| POST | `.../projects` | Create project | Admin |
| GET | `.../projects/:id` | Get project | Member |
| PUT | `.../projects/:id` | Update project | Admin |
| DELETE | `.../projects/:id` | Delete project | Admin |
| POST | `.../projects/:id/members` | Add member to project | Admin |
| DELETE | `.../projects/:id/members/:userId` | Remove member from project | Admin |

### Tasks

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `.../tasks` | List tasks (filter: `?status=`, `?project=`) | Member |
| POST | `.../tasks/project/:projectId` | Create task | Member |
| GET | `.../tasks/:id` | Get task | Member |
| PUT | `.../tasks/:id` | Update task | Member |
| PATCH | `.../tasks/:id/status` | Update task status (Kanban) | Member |
| PATCH | `.../tasks/reorder` | Batch reorder tasks | Member |
| DELETE | `.../tasks/:id` | Delete task | Admin |

### Team

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `.../team` | List team members (filter: `?department=`) | Member |
| POST | `.../team` | Create team member profile | Admin |
| PUT | `.../team/:id` | Update team member | Admin |
| DELETE | `.../team/:id` | Remove team member profile | Admin |

### Invitations

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `.../invitations` | Send invitation | Admin |
| GET | `.../invitations` | List invitations | Admin |
| DELETE | `.../invitations/:id` | Revoke invitation | Admin |
| POST | `.../invitations/:id/resend` | Resend invitation | Admin |

### Dashboard

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `.../dashboard` | Get all dashboard data (aggregated) | Member |

---

## 14. Troubleshooting

### Cannot connect to MongoDB

**Symptom:** Server crashes on startup with a MongoDB connection error.

**Solution:**
1. Ensure MongoDB is running: `mongosh` or `mongod --dbpath /your/data/path`
2. Verify `MONGODB_URI` in `.env` is correct
3. For MongoDB Atlas (cloud), ensure your IP is whitelisted

### Login fails with "Invalid email or password"

**Solution:**
1. Run `npm run seed` to ensure the database is populated
2. Default admin credentials: `admin@pms.com` / `admin123`
3. Default member credentials: `ahmad@pms.com` / `member123`

### Invitation email not received

**Solution:**
1. If `SMTP_USER` and `SMTP_PASS` are empty, the system uses Ethereal (test service)
2. Check the server console for the email preview URL
3. Open the preview URL in your browser to see the invitation email
4. For production, configure real SMTP credentials

### Dashboard shows empty data

**Solution:**
1. Ensure you ran `npm run seed`
2. Check that the workspace ID in localStorage matches an existing workspace
3. Open browser DevTools > Console for API error messages

### Drag-and-drop not persisting

**Solution:**
1. Ensure the backend server is running (port 5000)
2. Check browser DevTools > Network tab for failed API calls
3. Verify the Vite proxy is configured in `vite.config.js`

### "Admin" not showing in sidebar

**Solution:**
Only users with the `admin` role see the Admin nav item. Log in as the admin user (`admin@pms.com`) or have an admin promote your account via the Admin panel.

---

*PMS Enterprise v1.0 — Project Management System*
