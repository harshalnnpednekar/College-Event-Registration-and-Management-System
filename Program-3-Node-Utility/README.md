# Program 3: Node.js Server-Side Utility (WITHOUT Express)

**Course Outcome Alignment:** CO4

## Overview
A lightweight server-side utility built strictly on top of Node.js core modules (`http`, `fs`, `path`, `events`, `stream`) without any third-party framework such as Express. Demonstrates low-level asynchronous stream piping, event-driven architecture using `EventEmitter`, JSON file persistence, and robust HTTP request handling.

## Requirements & Implementation
- **File System & Path Modules:** 
  - Asynchronously reads and writes event and registration records to `data/events.json` and `data/registrations.json`.
  - Ensures safe path normalization and avoids directory traversal vulnerabilities.
- **Streams for File Processing:**
  - `GET /api/logs/stream`: Streams `logs/audit.log` chunk-by-chunk to the client using `fs.createReadStream` without buffering large files in memory.
  - `GET /api/export/csv`: Implements a custom Node.js `Transform` stream using `stream.pipeline` to convert JSON event objects to CSV records on the fly.
- **EventEmitter for Notifications:**
  - `registrationCreated`: Triggered whenever a student successfully reserves a seat.
  - `registrationCancelled`: Triggered when a booking is withdrawn, automatically restoring seat availability.
  - `capacityAlert`: Dispatched when an event's available seats drop below threshold (&le; 5) or reaches 0 (sold out).
  - All events asynchronously append structured audit entries to `logs/audit.log` using file write streams.
- **Node.js HTTP Server (`http.createServer`):**
  - RESTful routing for `/api/events`, `/api/register`, `/api/registrations`, `/api/cancel-registration`, `/api/logs/stream`, `/api/export/csv`.
  - Serves an embedded web dashboard at `GET /` for manual endpoint testing.
- **Error Handling:** Proper HTTP status codes (`200`, `201`, `400`, `404`, `409`, `500`) and graceful handling of malformed JSON payloads.

## Execution Instructions
1. Navigate to this directory:
   ```bash
   cd Program-3-Node-Utility
   ```
2. Start the HTTP server:
   ```bash
   npm start
   # or: node server.js
   ```
3. Run the interactive CLI demonstration of streams and EventEmitter:
   ```bash
   npm run cli
   # or: node cli.js
   ```
4. Run the automated verification test suite:
   ```bash
   npm test
   # or: node test-utility.js
   ```
