# Office Manager - Full-Stack Application

A comprehensive full-stack Department & Staff Management System built with **React, Redux Toolkit, Node.js, Express.js, and MySQL**.

---

## Technical Architecture

- **Frontend**: React (Vite), JavaScript, React Router DOM v6, Redux Toolkit, Axios, Lucide React icons.
- **Backend**: Node.js, Express.js, MySQL (`mysql2/promise`), JWT Authentication, Bcrypt Password Hashing.
- **Database**: MySQL schema with relational integrity and cascade/set-null foreign keys.
- **Styling**: Modern, responsive dark-mode CSS with glassmorphism effects, custom typography (Plus Jakarta Sans), and card layouts.

---

## Core Features

- **Public Views**:
  - Home landing page with live organizational metrics.
  - Department Directory & Detailed view (shows description, logo, leadership, and staff roster).
  - Department Heads Directory & Detailed view (shows biography, photo, age, department link, and direct reports roster).
  - Staff Employee Directory & Detailed view (shows employee info, photo, age, clickable department link, and clickable supervisor link).
- **Admin Management Portal (JWT Protected)**:
  - Admin login with persistent session storage (`localStorage` & Redux).
  - Interactive dashboard showing overall record counts.
  - Full CRUD operations for Departments, Department Heads, and Employees.
  - Dynamic form dropdowns (Departments loaded dynamically; Supervisors loaded dynamically).
  - Modal confirmation dialogs for destructive delete operations.
- **Pre-Seeded Media Assets**:
  - Image assets automatically mapped to departments, department heads, and employees from local asset folders.

---

## Setup & Running Instructions

### 1. Database Setup
1. Open **MySQL Workbench** or MySQL CLI.
2. Execute/Import the provided `database.sql` file located in the root directory:
   ```bash
   mysql -u root -p < database.sql
   ```
   *(This creates the `office_manager` database, sets up all 4 tables, inserts default admin credentials, 4 departments, 4 department heads, and 10 employees).*

---

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create your environment file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and set your MySQL password:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_ACTUAL_MYSQL_PASSWORD
   DB_NAME=office_manager
   JWT_SECRET=super_secret_jwt_key_officemanager_2026
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

---

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The web app will open at `http://localhost:3000`.*

---

## Application Access & Credentials

- **Frontend Application URL**: [http://localhost:3000](http://localhost:3000)
- **Backend API Base URL**: [http://localhost:5000/api](http://localhost:5000/api)
- **Default Admin Login Credentials**:
  - **Email**: `admin@officemanager.com`
  - **Password**: `Admin@123`

---

## Complete Route Reference

### Public Routes
| Path | Description |
|---|---|
| `/` | Home Landing & Stats Dashboard |
| `/departments` | All Departments Grid View |
| `/departments/:id` | Department Detail, Head, & Staff Roster |
| `/department-heads` | All Department Heads Grid View |
| `/department-heads/:id` | Department Head Detail & Direct Reports |
| `/employees` | Staff Employee Directory |
| `/employees/:id` | Employee Profile Detail |
| `/login` | Admin Authentication Page |

### Protected Admin Routes
| Path | Description |
|---|---|
| `/admin/dashboard` | Admin Metrics Dashboard |
| `/admin/departments` | Manage Departments Table |
| `/admin/departments/new` | Create New Department Form |
| `/admin/departments/:id/edit` | Edit Department Form |
| `/admin/department-heads` | Manage Department Heads Table |
| `/admin/department-heads/new` | Create Department Head Form |
| `/admin/department-heads/:id/edit` | Edit Department Head Form |
| `/admin/employees` | Manage Employees Table |
| `/admin/employees/new` | Create Employee Form |
| `/admin/employees/:id/edit` | Edit Employee Form |

---

## Backend API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate admin & return JWT
- `POST /api/auth/logout` - Sign out
- `GET  /api/auth/me` - Get logged-in admin user info *(Protected)*

### Departments
- `GET    /api/departments` - List departments with staff counts
- `GET    /api/departments/:id` - Department detail with heads & employees
- `POST   /api/departments` - Create department *(Protected)*
- `PUT    /api/departments/:id` - Update department *(Protected)*
- `DELETE /api/departments/:id` - Delete department *(Protected)*

### Department Heads
- `GET    /api/department-heads` - List department heads
- `GET    /api/department-heads/:id` - Head detail & direct reports
- `POST   /api/department-heads` - Create department head *(Protected)*
- `PUT    /api/department-heads/:id` - Update department head *(Protected)*
- `DELETE /api/department-heads/:id` - Delete department head *(Protected)*

### Employees
- `GET    /api/employees` - List employees with department & supervisor info
- `GET    /api/employees/:id` - Employee detail
- `POST   /api/employees` - Create employee *(Protected)*
- `PUT    /api/employees/:id` - Update employee *(Protected)*
- `DELETE /api/employees/:id` - Delete employee *(Protected)*
