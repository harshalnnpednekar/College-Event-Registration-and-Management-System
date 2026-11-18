# Program 1: College Event Registration Interface (Vanilla JS)

**Course Outcome Alignment:** CO1, CO2

## Overview
A lightweight, high-performance browser interface for exploring college events, filtering & sorting listings, validating registrations, tracking real-time seat availability, and storing registration tickets locally.

## Features Implemented
- **DOM Manipulation:** Pure vanilla JavaScript dynamic card generation, live seat counter updates, active badge updates, and modal/drawer toggling.
- **Fetch API & Async/Await:** Asynchronous JSON data fetching from `data.json` with fallback offline cache.
- **Dynamic Event Listing:** Interactive event cards featuring categories, dates, venues, speakers, progress bars, and seat availability.
- **Form Input Validation:**
  - Full Name (3-50 chars, alphabetic only)
  - College Email (valid email format)
  - Roll Number (alphanumeric pattern)
  - 10-digit Phone Number
  - Department & Semester selection
  - Mandatory guidelines acknowledgement
  - Duplicate registration prevention (matching Email + Event ID)
- **Sorting & Filtering:**
  - Category filter: Technical, Cultural, Workshop, Sports, Seminar
  - Status filter: Open, Fast Filling, Closed
  - Search: Real-time query matching title, description, venue, and tags
  - Sorting: Date (Asc/Desc), Seats Available (Asc/Desc), Title (A-Z/Z-A)
- **Status Updates:** Automatic state transition from `Open` to `Fast Filling` (when seats <= 15) and `Closed` (when capacity reaches 0).
- **Registration Management:** "My Registrations" drawer allowing students to view tickets and cancel registrations with seat restoration.

## Execution Instructions
1. Navigate to this directory:
   ```bash
   cd Program-1-Vanilla-JS
   ```
2. Start the built-in HTTP server:
   ```bash
   npm start
   # or: node server.js
   ```
3. Open `http://localhost:3001` in your browser.
4. Alternatively, you can double-click `index.html` to open directly in any browser.
