# Program 5: Integrated Full-Stack College Event Registration & Management System

**Course Outcome Alignment:** CO6

## System Overview
The pinnacle integration of the Full Stack Development academic exercise, combining React.js on the client, Express.js REST API on the server, and PostgreSQL as the exclusive database engine.

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                 REACT CLIENT (Vite SPA)                     │
│  - Event Catalog & Filter/Search Controls                   │
│  - JWT Auth Context (Persistent login & Role Guard)         │
│  - Student Booking & Cancellation Portal                    │
│  - Administrator Analytics & Event Management Controls      │
└──────────────────────────────▲──────────────────────────────┘
                               │ JSON / HTTP REST + JWT Bearer
┌──────────────────────────────▼──────────────────────────────┐
│                 EXPRESS.JS BACKEND (Node.js)                │
│  - JWT Authentication & Role Authorization Middleware       │
│  - Input Validation & Logging Middleware                    │
│  - Centralized Error Handler                                │
│  - Database Transaction Management (BEGIN, COMMIT, ROLLBACK)│
└──────────────────────────────▲──────────────────────────────┘
                               │ node-postgres (pg Pool)
┌──────────────────────────────▼──────────────────────────────┐
│                    POSTGRESQL DATABASE                      │
│  - Relational tables: users, events, registrations          │
│  - Constraints: FOREIGN KEY ON DELETE CASCADE,             │
│    UNIQUE(user_id, event_id), CHECK constraints             │
└─────────────────────────────────────────────────────────────┘
```

## Key Capabilities

### Student Workflow
1. Register with email, name, and password (salted with bcrypt).
2. Authenticate to receive signed JWT token.
3. Browse and search events with category and status filters.
4. View venue, agenda, keynote speaker, and live seat count.
5. Reserve seats with atomic PostgreSQL database transactions (prevents race conditions and duplicate bookings).
6. View confirmed registrations with printable event passes.
7. Cancel reservations with instant seat restoration.

### Administrator Workflow
1. Secure administrator login (`admin@college.edu`).
2. Dashboard with live KPIs: Total events, seat capacity, confirmed bookings, student count, and category breakdown.
3. Event CRUD: Create new events, update capacity and details, or delete events.
4. View all registrations: Comprehensive college-wide audit log of student bookings.

## Execution Instructions

### 1. Database Setup
```bash
cd Program-5-Full-Stack/database
# Connect to your PostgreSQL server and execute:
psql -U postgres -d college_events -f schema.sql
psql -U postgres -d college_events -f seed.sql

# Or run the Node setup runner:
node setup.js
```

### 2. Backend Server
```bash
cd Program-5-Full-Stack/backend
npm install
# Configure .env:
# PORT=5000
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/college_events
# JWT_SECRET=supersecret_key
npm start
```

### 3. Frontend Client
```bash
cd Program-5-Full-Stack/frontend
npm install
npm run dev
# Open displayed URL (http://localhost:5174) in your browser
```
