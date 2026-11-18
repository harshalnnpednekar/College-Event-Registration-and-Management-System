# ACADEMIC PROJECT DOCUMENTATION
## FULL STACK DEVELOPMENT – PROGRAMMING EXERCISE
### Individual Practical Assignment | B.E. (AI & DS) | Semester V
**Student Roll No:** 41  
**Department:** Artificial Intelligence and Data Science  
**Subject:** Full Stack Development: Web Dev  
**Assigned Programs:** 5 (Covering Course Outcomes CO1 – CO6)  
**Database Technology:** PostgreSQL (Relational Database Management System - No MongoDB)  
**Deployment Targets:** Vercel (Frontend) & Render (Backend)  
**Academic Year:** 2026–2027  

---

## 1. AIM
To design, implement, and rigorously verify a full-stack academic web application titled **"College Event Registration and Management System"** demonstrating progressive mastery across client-side web technologies (HTML5, CSS3, JavaScript DOM), modern reactive UI frameworks (React.js SPA), server-side core utilities (Node.js native streams and EventEmitters), robust REST API microservices (Express.js, JWT, bcrypt), and relational database modeling using PostgreSQL exclusively via the `pg` client.

---

## 2. PROBLEM STATEMENT
Higher educational institutions conduct diverse technical symposiums, hackathons, cultural festivals, academic workshops, guest lectures, and sports championships throughout the academic calendar. Manual or ad-hoc registration mechanisms (such as paper slips or generic online forms) suffer from significant challenges:
1. **Lack of Concurrency Control:** Inability to prevent overbooking when seat capacities are finite.
2. **Duplicate Entries:** Lack of unique constraint enforcement leading to redundant student registrations.
3. **Absence of Real-Time Visibility:** Students cannot inspect remaining capacity before committing to attend.
4. **Decentralized Records:** Administrators lack unified dashboards to monitor seat utilization, registration velocity, and department-wise participation.
5. **Security Deficits:** Passwords stored in cleartext and lack of role-based authorization for administrative operations.

An end-to-end, transaction-safe, relational management system is required to eliminate race conditions, enforce data consistency, provide instantaneous feedback, and secure both student and administrator workflows.

---

## 3. OBJECTIVES
- **CO1 & CO2 (Program 1):** Develop a responsive, browser-native event portal using HTML5 semantic elements, modern CSS3 variables/flexbox/grid, DOM manipulation, asynchronous `fetch()`, and `async/await` handling.
- **CO3 (Program 2):** Construct a component-driven Single Page Application (SPA) using React.js, React Router v6, custom state hooks (`useState`, `useEffect`, `useMemo`), conditional rendering, and client-side data persistence.
- **CO4 (Program 3):** Implement a zero-dependency server-side utility utilizing core Node.js modules (`http`, `fs`, `path`, `events`, `stream`) to process records, emit event-driven registration notifications, stream audit logs, and transform JSON data to CSV on the fly.
- **CO5 (Program 4):** Engineer a production-grade REST API utilizing Express.js, JWT authentication, bcrypt password hashing, input validation, request logging, centralized error handling, and parameterized SQL queries over PostgreSQL.
- **CO6 (Program 5):** Integrate React, Express, and PostgreSQL into a unified full-stack system featuring ACID database transactions (`BEGIN`, `FOR UPDATE`, `COMMIT`, `ROLLBACK`) for race-condition-free event booking and cancellation.

---

## 4. SYSTEM SPECIFICATIONS

### 4.1 Software Requirements
- **Operating System:** Microsoft Windows 10/11, Linux (Ubuntu 22.04+), or macOS
- **Runtime Environment:** Node.js v18.0.0 or higher (v26.13.0 verified)
- **Package Manager:** npm v9.0.0+ (11.20.0 verified)
- **Database Engine:** PostgreSQL 14.0 or higher (PostgreSQL 18.6 verified)
- **Database Driver:** `pg` (node-postgres) v8.13.0+
- **Frontend Framework:** React 18+ with Vite 6+
- **Routing Engine:** React Router DOM v6.28.0+
- **Authentication:** `jsonwebtoken` (JWT) v9.0.2+
- **Cryptography:** `bcryptjs` v2.4.3+
- **Browsers:** Google Chrome 110+, Mozilla Firefox 110+, Microsoft Edge 110+

### 4.2 Hardware Requirements
- **Processor:** 64-bit Dual Core x86_64 / ARM64 processor (Intel Core i3/i5/i7 or AMD Ryzen)
- **Memory (RAM):** 4 GB RAM minimum (8 GB recommended)
- **Storage:** 2 GB of free disk space for Node modules, PostgreSQL database cluster, and logs
- **Network Interface:** Local loopback interface (TCP/IP stack)

---

## 5. SYSTEM ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (CLIENT)                      │
│                                                                        │
│   Program 1: Vanilla HTML5 / CSS3 / ES6 DOM Interface                  │
│   Program 2: React.js Component-Driven SPA (Router, Hooks, Storage)    │
│   Program 5: Integrated React SPA (Auth Context, Admin & Student Views)│
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ HTTP / JSON REST + JWT Bearer
┌───────────────────────────────────▼────────────────────────────────────┐
│                        APPLICATION TIER (BACKEND)                      │
│                                                                        │
│   Program 3: Node.js Core Utility (HTTP, Streams, EventEmitter, FS)   │
│   Program 4: Express.js REST API Microservices                         │
│   Program 5: Integrated Express Controller & Transaction Manager       │
│                                                                        │
│   Middlewares: Logger, JWT Auth Guard, Role Guard, Input Validator,     │
│                Centralized Error Handler                               │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ Parameterized SQL Queries & Pools
┌───────────────────────────────────▼────────────────────────────────────┐
│                        DATA TIER (POSTGRESQL RDBMS)                    │
│                                                                        │
│   - Relational Tables: users, events, registrations                   │
│   - Integrity: PRIMARY KEY, FOREIGN KEY ON DELETE CASCADE              │
│   - Constraints: UNIQUE(user_id, event_id), CHECK(available_seats >= 0)│
│   - ACID Concurrency: SELECT ... FOR UPDATE, BEGIN, COMMIT, ROLLBACK   │
│   - Indexes: B-tree indexes on email, category, status, foreign keys   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. PROGRAM-BY-PROGRAM DESCRIPTION

### 6.1 Program 1 – HTML5, CSS3, and Vanilla JavaScript
- **Directory:** `Program-1-Vanilla-JS/`
- **Course Outcomes:** CO1, CO2
- **Description:** A standalone browser interface that performs asynchronous data fetching from `data.json`, dynamically generates responsive DOM elements, provides real-time search, multi-factor filtering (Category, Status), sorting (Date, Available Seats, Title), and interactive registration modal dialogs.
- **Key Technical Mechanics:**
  - `document.querySelector` & `addEventListener` for reactive event binding.
  - ES6 `async/await` and `fetch()` API with fallback local caching.
  - Input regex validation for full name, college email, roll number, and 10-digit mobile number.
  - Live seat decrements and state transitions (`Open` &rarr; `Fast Filling` &rarr; `Closed`).
  - "My Registrations" sliding drawer allowing students to inspect bookings and cancel registrations with seat count recovery.

### 6.2 Program 2 – React Application
- **Directory:** `Program-2-React/`
- **Course Outcomes:** CO3
- **Description:** An independent single-page application engineered with React 18, React Router v6, and Vite.
- **Key Technical Mechanics:**
  - Functional component breakdown (`Navbar`, `EventCard`, `FilterBar`, `Toast`).
  - Declarative state management via `useState` and `useEffect`.
  - Memoized filtering and sorting pipelines via `useMemo`.
  - Client-side routing:
    - `/`: Event listing page with live capacity statistics.
    - `/events/:id`: Event details page with speaker, venue, and guideline view.
    - `/register` & `/register/:id`: Registration form with client-side validation.
    - `/my-registrations`: Registered tickets list with cancellation and print capabilities.

### 6.3 Program 3 – Node.js Server-Side Utility (Without Express)
- **Directory:** `Program-3-Node-Utility/`
- **Course Outcomes:** CO4
- **Description:** A utility built exclusively with Node.js built-in standard modules without third-party frameworks.
- **Key Technical Mechanics:**
  - `http.createServer()` for HTTP routing and response handling.
  - `fs` and `path` for asynchronous reading and writing of `data/events.json` and `data/registrations.json`.
  - Node.js `stream.Readable`, `stream.Transform`, and `stream.pipeline` for high-throughput streaming:
    - `GET /api/logs/stream`: Direct chunk-by-chunk file streaming of audit logs.
    - `GET /api/export/csv`: Dynamic transform stream converting JSON event streams into CSV on the fly.
  - `EventEmitter` inheritance (`EventNotificationEmitter`):
    - Emits `registrationCreated`, `registrationCancelled`, `capacityAlert`, and `eventCreated`.
    - Asynchronously writes audit trails to `logs/audit.log` via writable streams.
  - Dual execution: Built-in HTTP server (`server.js`) and command-line demonstration runner (`cli.js`).

### 6.4 Program 4 – Express.js REST API
- **Directory:** `Program-4-Express-API/`
- **Course Outcomes:** CO5
- **Description:** A robust, modular REST API connecting Express.js to PostgreSQL using the `pg` library.
- **Key Technical Mechanics:**
  - CRUD operations on events and registrations.
  - Passwords salted and hashed with `bcryptjs` (10 rounds).
  - Stateless authentication using JSON Web Tokens (JWT) with Bearer token authorization header inspection.
  - Role-based authorization (`isAdmin`, `isStudent`).
  - Request logging middleware and centralized error handler for PostgreSQL error codes (`23505` duplicate key, `23503` foreign key violation).
  - Automated test suite (`tests/api.test.js`) verifying all 15 endpoints.

### 6.5 Program 5 – Complete Integrated Full-Stack Application
- **Directory:** `Program-5-Full-Stack/`
- **Course Outcomes:** CO6
- **Description:** The unified full-stack implementation connecting the React.js client to the Express.js API and PostgreSQL relational database.
- **Key Technical Mechanics:**
  - Frontend features Student Portal and Administrator Portal.
  - PostgreSQL connection pool (`pg.Pool`) configured with SSL support and environment variable injection.
  - **ACID Database Transactions:**
    ```sql
    BEGIN;
    SELECT available_seats, total_seats, status FROM events WHERE id = $1 FOR UPDATE;
    INSERT INTO registrations (user_id, event_id, registration_date, status) VALUES ($1, $2, NOW(), 'confirmed');
    UPDATE events SET available_seats = available_seats - 1 WHERE id = $1;
    COMMIT;
    ```
  - Prevents concurrency race conditions, duplicate bookings, and capacity drift.

---

## 7. POSTGRESQL DATABASE DESIGN

### 7.1 Relational Schema

```sql
-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- EVENTS TABLE
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Technical', 'Cultural', 'Workshop', 'Sports', 'Seminar')),
    venue VARCHAR(150) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0 AND available_seats <= total_seats),
    status VARCHAR(30) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Fast Filling', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- REGISTRATIONS TABLE
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    CONSTRAINT uq_user_event_registration UNIQUE (user_id, event_id)
);
```

### 7.2 Entity-Relationship (ER) Description
- **users (1) &rarr; (N) registrations:** One student can register for multiple distinct events. Foreign key `registrations.user_id` references `users.id` with `ON DELETE CASCADE`.
- **events (1) &rarr; (N) registrations:** One event can have multiple student registrations up to its `total_seats` capacity. Foreign key `registrations.event_id` references `events.id` with `ON DELETE CASCADE`.
- **registrations:** Bridge entity with a compound unique constraint: `UNIQUE (user_id, event_id)`. This guarantees at the database storage engine level that a student can never have duplicate concurrent registrations for the same event.

---

## 8. REST API ENDPOINTS SPECIFICATION

| Method | Endpoint | Access Level | Description | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account with bcrypt password | 201, 400, 409 |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and return signed JWT | 200, 400, 401 |
| `GET` | `/api/auth/me` | Protected | Return currently logged-in user profile | 200, 401 |
| `GET` | `/api/events` | Public | List events with category, status, search, and sort | 200 |
| `GET` | `/api/events/:id` | Public | Retrieve detailed event record | 200, 404 |
| `POST` | `/api/events` | Admin Only | Create new college event with seat capacity | 201, 400, 403 |
| `PUT` | `/api/events/:id` | Admin Only | Update existing event details and capacity | 200, 400, 403, 404 |
| `DELETE` | `/api/events/:id` | Admin Only | Remove event and cascade delete registrations | 200, 403, 404 |
| `POST` | `/api/registrations` | Student | Book seat via ACID database transaction | 201, 400, 409 |
| `GET` | `/api/registrations/my` | Student | Return logged-in student's active bookings | 200, 401 |
| `DELETE` | `/api/registrations/:id` | Student | Cancel booking and atomically restore seat | 200, 401, 404 |
| `GET` | `/api/registrations/all`| Admin Only | College-wide audit of all student registrations | 200, 403 |
| `GET` | `/api/registrations/stats`| Admin Only | Live KPI analytics: events, seats, registrations | 200, 403 |

---

## 9. COURSE OUTCOME (CO) MAPPING

| Program | Title | Target CO | Competencies & Skills Demonstrated |
|---|---|---|---|
| **Program 1** | Vanilla JS Interface | **CO1, CO2** | Semantic HTML5, CSS3 Grid/Flexbox, DOM manipulation, asynchronous `fetch()`, `async/await`, input validation. |
| **Program 2** | React Application | **CO3** | Functional components, JSX, props/state, `useState`, `useEffect`, `useMemo`, React Router navigation, mock state. |
| **Program 3** | Node.js Server Utility | **CO4** | Node.js built-in modules (`http`, `fs`, `path`, `events`, `stream`), custom Transform streams, EventEmitters, audit logs. |
| **Program 4** | Express.js REST API | **CO5** | Express framework, RESTful CRUD, JWT authentication, bcrypt password hashing, input validation, PostgreSQL connectivity (`pg`). |
| **Program 5** | Full-Stack Integration | **CO6** | End-to-end integration: React client + Express server + PostgreSQL database, ACID transaction seat allocation, RBAC. |

---

## 10. DEPLOYMENT ON VERCEL & RENDER

Per the Program 5 requirements:
- **Frontend (Vercel):** The React SPA is bundled using Vite and configured with `vercel.json` for client-side routing rewrites and API reverse-proxying.
- **Backend (Render):** The Express REST API is configured via `render.yaml` as a Web Service running Node.js connected to a managed PostgreSQL database.
- **Environment & CORS:** Configured with `cors` middleware and `.env` parameters (`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `PORT`).
- **ORM & Models:** Application records are mapped using PostgreSQL relational schema via `pg` connection pool and Sequelize models (`src/models/index.js`), completely excluding MongoDB/Mongoose.

Detailed steps are provided in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

---

## 11. CONCLUSION
The **College Event Registration and Management System** successfully accomplishes all requirements set forth in the Full Stack Development Programming Exercise for **Student Roll No. 41 (B.E. AI & DS, Semester V)**. By developing five independently runnable programs and consolidating them into a unified full-stack system, this project demonstrates the practical application of frontend reactive architectures, backend microservice design, relational database transactions using PostgreSQL, and modern cloud deployment on Vercel and Render.
