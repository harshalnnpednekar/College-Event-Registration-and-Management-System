# COLLEGE EVENT REGISTRATION AND MANAGEMENT SYSTEM

A unified, production-grade academic mini-project implementing all five programs from the **Full Stack Development Programming Exercise**.

> **IMPORTANT ARCHITECTURAL NOTE:**  
> This system uses **PostgreSQL EXCLUSIVELY** as its relational database engine via the official `pg` (node-postgres) driver.  
> **NO MongoDB, Mongoose, Firebase, or any NoSQL database is used anywhere in this repository.**

---

## 📑 TABLE OF CONTENTS
1. [Overview & Project Structure](#overview--project-structure)
2. [Technology Stack](#technology-stack)
3. [Course Outcome (CO) Mapping](#course-outcome-co-mapping)
4. [Prerequisites & PostgreSQL Database Setup](#prerequisites--postgresql-database-setup)
5. [Execution Guide for All 5 Programs](#execution-guide-for-all-5-programs)
   - [Program 1: Vanilla HTML, CSS & JavaScript](#program-1--vanilla-html-css--javascript)
   - [Program 2: React Application](#program-2--react-application)
   - [Program 3: Node.js Server-Side Utility](#program-3--nodejs-server-side-utility)
   - [Program 4: Express.js REST API](#program-4--expressjs-rest-api)
   - [Program 5: Integrated Full-Stack Application](#program-5--integrated-full-stack-application)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Default Test Credentials](#default-test-credentials)
8. [Academic Documentation & Reports](#academic-documentation--reports)

---

## 1. OVERVIEW & PROJECT STRUCTURE

The project is structured into five independently executable programs plus unified full-stack components:

```
College-Event-Registration-and-Management-System/
├── Program-1-Vanilla-JS/          # Program 1: Browser-native UI (HTML5, CSS3, DOM, Fetch API)
├── Program-2-React/               # Program 2: React SPA (Router, useState, useEffect, useMemo)
├── Program-3-Node-Utility/        # Program 3: Node.js Core Utility (Streams, EventEmitter, FS)
├── Program-4-Express-API/         # Program 4: Express REST API (PostgreSQL pg, JWT, bcrypt)
├── Program-5-Full-Stack/          # Program 5: Integrated Full-Stack System
│   ├── frontend/                  # React client with Student & Admin portals
│   ├── backend/                   # Express API with PostgreSQL transaction safety
│   └── database/                  # PostgreSQL schema.sql, seed.sql, setup.js
├── docs/
│   ├── ACADEMIC_DOCUMENTATION.md  # Comprehensive academic lab documentation
│   ├── SCREENSHOTS_CHECKLIST.md   # Screenshot capture checklist for lab report
│   └── TESTING_REPORT.md          # Verification and automated test report
├── .env.example                   # Master environment configuration template
├── .gitignore                     # Git ignore rules for node_modules and credentials
└── README.md                      # Master execution instructions
```

---

## 2. TECHNOLOGY STACK

- **Frontend:** HTML5, CSS3 (Custom properties, Flexbox, Grid), JavaScript (ES6+), React.js (v18+), React Router DOM (v6+), Vite (v6+)
- **Backend:** Node.js (v18+), Express.js (v4+), HTTP Core Module, Streams (`Readable`, `Transform`, `pipeline`), `EventEmitter`
- **Database:** **PostgreSQL ONLY** (PostgreSQL 14+ / 18.6 verified)
- **Database Connectivity:** `pg` (`node-postgres` Connection Pool)
- **Security & Authentication:** JSON Web Tokens (`jsonwebtoken`), salted password hashing (`bcryptjs`)

---

## 3. COURSE OUTCOME (CO) MAPPING

| Program | Module | Target CO | Competencies & Laboratory Outcomes |
|---|---|---|---|
| **Program 1** | Vanilla JS Interface | **CO1, CO2** | Semantic HTML5, CSS Grid/Flexbox, DOM manipulation, asynchronous `fetch()`, `async/await`, input validation. |
| **Program 2** | React Application | **CO3** | Functional components, JSX, props/state, `useState`, `useEffect`, `useMemo`, React Router navigation. |
| **Program 3** | Node.js Server Utility | **CO4** | Core Node modules (`http`, `fs`, `path`, `events`, `stream`), custom Transform streams, EventEmitters, audit logs. |
| **Program 4** | Express.js REST API | **CO5** | Express framework, RESTful CRUD, JWT authentication, bcrypt password hashing, PostgreSQL connectivity (`pg`). |
| **Program 5** | Full-Stack Integration | **CO6** | End-to-end integration: React client + Express server + PostgreSQL database with ACID transaction safety. |

---

## 4. PREREQUISITES & POSTGRESQL DATABASE SETUP

### 4.1 Install Prerequisites
- **Node.js:** Ensure Node.js (v18+) is installed: `node -v`
- **PostgreSQL:** Ensure PostgreSQL is installed: `psql --version`

### 4.2 Create the Database
Open PostgreSQL shell (`psql`):
```sql
-- Create the college events database
CREATE DATABASE college_events;
```

### 4.3 Execute Schema and Seed SQL
Navigate to `Program-5-Full-Stack/database` and apply the relational tables and initial sample data:
```bash
# Connect using psql:
psql -U postgres -d college_events -f Program-5-Full-Stack/database/schema.sql
psql -U postgres -d college_events -f Program-5-Full-Stack/database/seed.sql

# OR use the automated Node setup runner:
cd Program-5-Full-Stack/database
node setup.js
```

### 4.4 Configure Master Environment Variables
Copy `.env.example` to `.env` in the root and in the respective backend folders:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` matches your local or cloud PostgreSQL instance:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/college_events
JWT_SECRET=supersecret_jwt_key_college_events_2026
PORT=5000
NODE_ENV=development
```

---

## 5. EXECUTION GUIDE FOR ALL 5 PROGRAMS

Each of the five programs is **independently executable**.

---

### PROGRAM 1 – VANILLA HTML, CSS & JAVASCRIPT
*Runs 100% independently using sample data and localStorage with zero external npm dependencies.*

1. Navigate to Program 1:
   ```bash
   cd Program-1-Vanilla-JS
   ```
2. Start the built-in HTTP server:
   ```bash
   npm start
   # or: node server.js
   ```
3. Open `http://localhost:3001` in your browser.  
   *(Alternatively, open `index.html` directly in any web browser.)*

---

### PROGRAM 2 – REACT APPLICATION
*Runs independently as a React SPA with mock data, client routing, and localStorage persistence.*

1. Navigate to Program 2:
   ```bash
   cd Program-2-React
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (typically `http://localhost:5173`) in your browser.

---

### PROGRAM 3 – NODE.JS SERVER-SIDE UTILITY
*Built WITHOUT Express using Node.js core modules (`http`, `fs`, `stream`, `events`). Zero external dependencies.*

1. Navigate to Program 3:
   ```bash
   cd Program-3-Node-Utility
   ```
2. **Start the HTTP Server:**
   ```bash
   npm start
   # or: node server.js
   ```
   Open `http://localhost:3003` to view the interactive web dashboard.
3. **Run the CLI Stream & EventEmitter Demonstration:**
   ```bash
   npm run cli
   # or: node cli.js
   ```
4. **Run the Automated Test Suite:**
   ```bash
   npm test
   # or: node test-utility.js
   ```

---

### PROGRAM 4 – EXPRESS.JS REST API
*Express REST API connected to PostgreSQL via `pg`, with JWT auth, bcrypt, and transactions.*

1. Navigate to Program 4:
   ```bash
   cd Program-4-Express-API
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express API server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5000`.
4. Run the automated API verification test suite:
   ```bash
   npm test
   ```

---

### PROGRAM 5 – INTEGRATED FULL-STACK APPLICATION
*Complete integrated system: React frontend + Express backend + PostgreSQL database.*

#### Step 1: Start Backend
```bash
cd Program-5-Full-Stack/backend
npm install
npm start
```
*Backend runs on: `http://localhost:5000`*

#### Step 2: Start Frontend
In a new terminal window:
```bash
cd Program-5-Full-Stack/frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5174`*

Open `http://localhost:5174` in your browser to experience the complete integrated platform.

---

## 6. API ENDPOINTS REFERENCE

### Authentication
- `POST /api/auth/register` &rarr; Register student/admin account (hashes password with bcrypt)
- `POST /api/auth/login` &rarr; Authenticate credentials & return signed JWT token
- `GET /api/auth/me` &rarr; Return currently authenticated user profile

### Events
- `GET /api/events` &rarr; Browse events with filters (`category`, `status`, `search`, `sortBy`)
- `GET /api/events/:id` &rarr; View single event details
- `POST /api/events` &rarr; Create new event *(Admin only)*
- `PUT /api/events/:id` &rarr; Update event details or capacity *(Admin only)*
- `DELETE /api/events/:id` &rarr; Delete event *(Admin only)*

### Registrations (ACID Transactions)
- `POST /api/registrations` &rarr; Book event seat via database transaction *(Student)*
- `GET /api/registrations/my` &rarr; View registered events for current student *(Student)*
- `DELETE /api/registrations/:id` &rarr; Cancel registration and restore seat count *(Student)*
- `GET /api/registrations/all` &rarr; View all student registrations across college *(Admin only)*
- `GET /api/registrations/stats` &rarr; Real-time KPI analytics & seat utilization *(Admin only)*

---

## 7. DEFAULT TEST CREDENTIALS

The database seed script initializes the following test accounts with salted bcrypt hashes:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@college.edu` | `Admin@123` | Full Admin: Event CRUD, Dashboard Analytics, All Registrations |
| **Student** | `john.doe@college.edu` | `Student@123` | Student: Browse, Book Events, My Passes, Cancel Bookings |
| **Student** | `jane.smith@college.edu` | `Student@123` | Student account for multi-user concurrency testing |
| **Student** | `alex.rivera@college.edu` | `Student@123` | Student account for multi-user concurrency testing |

*Tip: The Login page includes one-click demo fill buttons for instant testing!*

---

## 8. ACADEMIC DOCUMENTATION & REPORTS

Comprehensive academic documentation is provided inside the `docs/` folder:
- **[Academic Documentation](docs/ACADEMIC_DOCUMENTATION.md):** Aim, Problem Statement, Objectives, Software/Hardware Specs, Architecture Diagram, Database Schema, ER Diagram, API specifications, Course Outcome Mapping (CO1–CO6), and Conclusion.
- **[Screenshots Checklist](docs/SCREENSHOTS_CHECKLIST.md):** Organized checklist of all 28 screenshot points required for academic lab submissions and viva presentations.
- **[Verification & Testing Report](docs/TESTING_REPORT.md):** Detailed testing logs, console outputs, and validation reports proving successful execution of all five programs.
