# Program 4: College Event REST API (Express.js & PostgreSQL)

**Course Outcome Alignment:** CO5

## Overview
A production-grade REST API engineered with Express.js and PostgreSQL using the official `pg` (node-postgres) driver. Implements role-based access control (Student vs Admin), bcrypt password hashing, JSON Web Tokens (JWT), database transactions for race-condition-free event registrations, input validation, request logging, and centralized error handling.

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (exclusively, connected via `pg.Pool`)
- **Authentication:** JWT (`jsonwebtoken`)
- **Security:** bcrypt (`bcryptjs`) for salted password hashing
- **Middleware:** Custom request logger, input validators, centralized error handler

## API Specifications

### Authentication Endpoints
- `POST /api/auth/register`: Register new student/admin account with bcrypt password hashing.
- `POST /api/auth/login`: Authenticate credentials and return signed JWT token.
- `GET /api/auth/me`: Retrieve currently authenticated user profile (Protected).

### Event Management Endpoints
- `GET /api/events`: List events with multi-parameter filtering (`category`, `status`), keyword search (`title`, `description`, `venue`), and sorting (`date`, `seats`, `title`).
- `GET /api/events/:id`: Retrieve single event details.
- `POST /api/events`: Create a new college event (Admin only).
- `PUT /api/events/:id`: Update event title, venue, category, or capacity (Admin only).
- `DELETE /api/events/:id`: Remove event and cascade registrations (Admin only).

### Registration & Transactional Endpoints
- `POST /api/registrations`: Register student for an event using a **PostgreSQL Database Transaction** (`BEGIN`, `FOR UPDATE`, decrement `available_seats`, `COMMIT`). Prevents duplicate bookings via `UNIQUE(user_id, event_id)` constraint.
- `GET /api/registrations/my`: View all registered events for the logged-in student.
- `DELETE /api/registrations/:id`: Cancel student registration and atomically restore available seat capacity.
- `GET /api/registrations/all`: View all college registrations with student and event join details (Admin only).
- `GET /api/registrations/stats`: Aggregated dashboard metrics for total events, capacity, registrations, and category counts (Admin only).

## Execution Instructions
1. Navigate to directory:
   ```bash
   cd Program-4-Express-API
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/college_events
   JWT_SECRET=supersecret_jwt_key_college_events_2026
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Run the automated API verification test suite:
   ```bash
   npm test
   ```
