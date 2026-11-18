/**
 * Program 3: Node.js Server-Side Utility (WITHOUT Express)
 * 
 * Features:
 *  - Uses Node.js built-in 'http', 'fs', 'path', 'events', 'stream' modules
 *  - Stores and retrieves event records using JSON files
 *  - Uses Streams for file processing (Readable, Writable, Transform streams)
 *  - Uses EventEmitter for registration lifecycle notifications & audit logging
 *  - Implements a basic HTTP REST server using http.createServer
 *  - Robust error handling and proper HTTP status codes
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const { Readable, Transform, pipeline } = require('stream');

const PORT = process.env.PORT || 3003;
const DATA_DIR = path.join(__dirname, 'data');
const LOGS_DIR = path.join(__dirname, 'logs');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const AUDIT_LOG_FILE = path.join(LOGS_DIR, 'audit.log');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

// ==========================================
// 1. EVENT EMITTER FOR NOTIFICATIONS
// ==========================================
class EventNotificationEmitter extends EventEmitter {}
const notifier = new EventNotificationEmitter();

// Registration event listeners
notifier.on('registrationCreated', (data) => {
  console.log(`\x1b[32m[EVENT EMITTER: registrationCreated]\x1b[0m Student "${data.studentName}" registered for Event #${data.eventId} (${data.eventTitle})`);
  logAuditEvent(`REGISTRATION_CREATED: Student "${data.studentName}" (${data.studentRoll}) booked Event #${data.eventId} [RegID: ${data.id}]`);
});

notifier.on('registrationCancelled', (data) => {
  console.log(`\x1b[33m[EVENT EMITTER: registrationCancelled]\x1b[0m RegID #${data.id} cancelled for Event #${data.eventId}. Seat released.`);
  logAuditEvent(`REGISTRATION_CANCELLED: RegID #${data.id} cancelled. Restored seat for Event #${data.eventId}`);
});

notifier.on('capacityAlert', (data) => {
  console.log(`\x1b[31m[EVENT EMITTER: capacityAlert]\x1b[0m Event #${data.id} "${data.title}" reached critical capacity: ${data.available_seats} seats remaining! Status: ${data.status}`);
  logAuditEvent(`CAPACITY_ALERT: Event #${data.id} "${data.title}" has ${data.available_seats} seats remaining (Status: ${data.status})`);
});

notifier.on('eventCreated', (data) => {
  console.log(`\x1b[36m[EVENT EMITTER: eventCreated]\x1b[0m New event added: #${data.id} "${data.title}"`);
  logAuditEvent(`EVENT_CREATED: Added new event #${data.id} "${data.title}" with ${data.total_seats} seats`);
});

/**
 * Append audit log entry using a file stream
 */
function logAuditEvent(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [AUDIT] ${message}\n`;

  // Write through stream
  const logStream = fs.createWriteStream(AUDIT_LOG_FILE, { flags: 'a' });
  logStream.write(logLine, (err) => {
    if (err) console.error('Failed to write audit stream:', err);
  });
  logStream.end();
}

// ==========================================
// 2. FILE SYSTEM OPERATIONS (JSON FILES)
// ==========================================
function readJSONFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') return resolve([]);
        return reject(err);
      }
      try {
        const parsed = JSON.parse(data || '[]');
        resolve(parsed);
      } catch (parseErr) {
        reject(new Error(`Failed to parse JSON file at ${filePath}: ${parseErr.message}`));
      }
    });
  });
}

function writeJSONFile(filePath, data) {
  return new Promise((resolve, reject) => {
    const formatted = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, formatted, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Helper to parse incoming HTTP request JSON body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Guard against payload flood
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// ==========================================
// 3. HTTP SERVER ROUTING & CONTROLLERS
// ==========================================
const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // ----------------------------------------------------
    // GET / -> Web dashboard / test interface
    // ----------------------------------------------------
    if (method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      serveDashboard(res);
      return;
    }

    // ----------------------------------------------------
    // GET /api/events -> List all events (Retrieved from events.json)
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/events') {
      const events = await readJSONFile(EVENTS_FILE);
      sendJSON(res, 200, { success: true, count: events.length, data: events });
      return;
    }

    // ----------------------------------------------------
    // GET /api/events/:id -> Single event details
    // ----------------------------------------------------
    if (method === 'GET' && pathname.startsWith('/api/events/')) {
      const id = parseInt(pathname.split('/')[3], 10);
      const events = await readJSONFile(EVENTS_FILE);
      const ev = events.find(e => e.id === id);
      if (!ev) {
        sendJSON(res, 404, { success: false, error: `Event with ID ${id} not found.` });
        return;
      }
      sendJSON(res, 200, { success: true, data: ev });
      return;
    }

    // ----------------------------------------------------
    // POST /api/events -> Add new event
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/events') {
      const payload = await parseRequestBody(req);
      if (!payload.title || !payload.category || !payload.venue || !payload.total_seats) {
        sendJSON(res, 400, { success: false, error: 'Missing required fields: title, category, venue, total_seats.' });
        return;
      }

      const events = await readJSONFile(EVENTS_FILE);
      const newEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        title: payload.title.trim(),
        category: payload.category.trim(),
        description: payload.description ? payload.description.trim() : '',
        venue: payload.venue.trim(),
        event_date: payload.event_date || new Date(Date.now() + 7 * 86400000).toISOString(),
        total_seats: Number(payload.total_seats),
        available_seats: Number(payload.total_seats),
        status: 'Open',
        speaker: payload.speaker ? payload.speaker.trim() : 'College Faculty'
      };

      events.push(newEvent);
      await writeJSONFile(EVENTS_FILE, events);
      notifier.emit('eventCreated', newEvent);

      sendJSON(res, 201, { success: true, message: 'Event created successfully.', data: newEvent });
      return;
    }

    // ----------------------------------------------------
    // POST /api/register -> Register for an event
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/register') {
      const payload = await parseRequestBody(req);
      const { eventId, studentName, studentRoll, studentEmail, studentDept } = payload;

      if (!eventId || !studentName || !studentRoll || !studentEmail) {
        sendJSON(res, 400, { success: false, error: 'Missing required fields: eventId, studentName, studentRoll, studentEmail.' });
        return;
      }

      const events = await readJSONFile(EVENTS_FILE);
      const registrations = await readJSONFile(REGISTRATIONS_FILE);

      const targetEvent = events.find(e => e.id === Number(eventId));
      if (!targetEvent) {
        sendJSON(res, 404, { success: false, error: `Event with ID ${eventId} does not exist.` });
        return;
      }

      if (targetEvent.available_seats <= 0 || targetEvent.status === 'Closed') {
        sendJSON(res, 400, { success: false, error: `Event "${targetEvent.title}" is already full.` });
        return;
      }

      // Check duplicate registration
      const duplicate = registrations.some(
        r => r.eventId === Number(eventId) && r.studentEmail.toLowerCase() === studentEmail.trim().toLowerCase()
      );
      if (duplicate) {
        sendJSON(res, 409, { success: false, error: 'Student email is already registered for this event.' });
        return;
      }

      // Decrement seats
      targetEvent.available_seats -= 1;
      if (targetEvent.available_seats === 0) {
        targetEvent.status = 'Closed';
      } else if (targetEvent.available_seats <= 5) {
        targetEvent.status = 'Fast Filling';
      }

      const newRegistration = {
        id: registrations.length > 0 ? Math.max(...registrations.map(r => r.id)) + 1 : 101,
        eventId: targetEvent.id,
        eventTitle: targetEvent.title,
        studentName: studentName.trim(),
        studentRoll: studentRoll.trim().toUpperCase(),
        studentEmail: studentEmail.trim().toLowerCase(),
        studentDept: studentDept ? studentDept.trim() : 'General',
        status: 'Confirmed',
        registeredAt: new Date().toISOString()
      };

      registrations.push(newRegistration);

      // Persist changes
      await writeJSONFile(EVENTS_FILE, events);
      await writeJSONFile(REGISTRATIONS_FILE, registrations);

      // Emit lifecycle events
      notifier.emit('registrationCreated', newRegistration);
      if (targetEvent.available_seats <= 5) {
        notifier.emit('capacityAlert', targetEvent);
      }

      sendJSON(res, 201, {
        success: true,
        message: 'Registration confirmed successfully!',
        data: newRegistration,
        remainingSeats: targetEvent.available_seats
      });
      return;
    }

    // ----------------------------------------------------
    // GET /api/registrations -> List all registrations
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/registrations') {
      const registrations = await readJSONFile(REGISTRATIONS_FILE);
      sendJSON(res, 200, { success: true, count: registrations.length, data: registrations });
      return;
    }

    // ----------------------------------------------------
    // POST /api/cancel-registration -> Cancel registration & restore seat
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/cancel-registration') {
      const payload = await parseRequestBody(req);
      const regId = Number(payload.registrationId);

      if (!regId) {
        sendJSON(res, 400, { success: false, error: 'registrationId is required.' });
        return;
      }

      const registrations = await readJSONFile(REGISTRATIONS_FILE);
      const index = registrations.findIndex(r => r.id === regId);
      if (index === -1) {
        sendJSON(res, 404, { success: false, error: `Registration #${regId} not found.` });
        return;
      }

      const cancelledReg = registrations.splice(index, 1)[0];
      const events = await readJSONFile(EVENTS_FILE);
      const targetEvent = events.find(e => e.id === cancelledReg.eventId);

      if (targetEvent) {
        targetEvent.available_seats = Math.min(targetEvent.total_seats, targetEvent.available_seats + 1);
        if (targetEvent.available_seats > 5) targetEvent.status = 'Open';
        else if (targetEvent.available_seats > 0) targetEvent.status = 'Fast Filling';
        await writeJSONFile(EVENTS_FILE, events);
      }

      await writeJSONFile(REGISTRATIONS_FILE, registrations);
      notifier.emit('registrationCancelled', cancelledReg);

      sendJSON(res, 200, {
        success: true,
        message: `Registration #${regId} cancelled and seat restored.`,
        data: cancelledReg
      });
      return;
    }

    // ----------------------------------------------------
    // GET /api/logs/stream -> STREAMING AUDIT LOG FILE
    // Uses fs.createReadStream to pipe logs directly to HTTP response
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/logs/stream') {
      if (!fs.existsSync(AUDIT_LOG_FILE)) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('[AUDIT LOG EMPTY]');
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Stream-Source': 'Node.js-fs.createReadStream'
      });

      const readStream = fs.createReadStream(AUDIT_LOG_FILE);
      readStream.on('error', (err) => {
        console.error('Audit stream error:', err);
        if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Stream read error: ${err.message}`);
      });
      readStream.pipe(res);
      return;
    }

    // ----------------------------------------------------
    // GET /api/export/csv -> STREAMING TRANSFORM
    // Converts JSON event stream to CSV stream on the fly
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/export/csv') {
      const events = await readJSONFile(EVENTS_FILE);

      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="events_export.csv"'
      });

      // Custom Transform Stream
      const jsonToCsvTransform = new Transform({
        writableObjectMode: true,
        transform(chunk, encoding, callback) {
          const row = `"${chunk.id}","${chunk.title.replace(/"/g, '""')}","${chunk.category}","${chunk.venue}","${chunk.total_seats}","${chunk.available_seats}","${chunk.status}"\n`;
          callback(null, row);
        }
      });

      // Write CSV Header
      res.write('ID,Title,Category,Venue,Total_Seats,Available_Seats,Status\n');

      const readable = Readable.from(events);
      pipeline(readable, jsonToCsvTransform, res, (err) => {
        if (err) console.error('CSV Stream pipeline error:', err);
      });
      return;
    }

    // Route not found
    sendJSON(res, 404, { success: false, error: `Route ${method} ${pathname} not found.` });

  } catch (err) {
    console.error(`Internal Server Error [${method} ${pathname}]:`, err);
    sendJSON(res, 500, { success: false, error: 'Internal Server Error', message: err.message });
  }
});

/**
 * Serves an interactive HTML console for Program 3
 */
function serveDashboard(res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Program 3 - Node.js Server Utility (No Express)</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
    .container { max-width: 1000px; margin: 0 auto; }
    h1 { font-family: 'Space Grotesk', sans-serif; color: #38bdf8; margin-bottom: 0.5rem; }
    .badge { background: #1e293b; border: 1px solid #334155; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.8rem; color: #94a3b8; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; margin-top: 1.5rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .endpoint { background: #0f172a; padding: 0.75rem 1rem; border-radius: 8px; border-left: 4px solid #38bdf8; margin-bottom: 0.75rem; font-family: monospace; font-size: 0.9rem; }
    .method-get { color: #34d399; }
    .method-post { color: #fbbf24; }
    button { background: #2563eb; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
    button:hover { background: #1d4ed8; }
    pre { background: #0b1120; padding: 1rem; border-radius: 8px; overflow-x: auto; color: #a5f3fc; font-size: 0.85rem; max-height: 250px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Program 3 &bull; Node.js Native HTTP Utility</span>
    <h1>College Event Utility & Stream Processor</h1>
    <p style="color: #94a3b8;">Built entirely without Express using Node.js core modules: http, fs, path, stream, events.</p>

    <div class="card">
      <h3>🚀 Quick Interactive API Probes</h3>
      <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
        <button onclick="fetchEvents()">Fetch Events (JSON)</button>
        <button onclick="fetchRegistrations()">Fetch Registrations</button>
        <button onclick="streamAuditLog()">Stream Audit Logs (fs.Stream)</button>
        <a href="/api/export/csv" download="events.csv"><button>Download CSV (Transform Stream)</button></a>
      </div>
      <pre id="outputConsole">Click any button above to test Node.js core utility endpoints...</pre>
    </div>

    <div class="card">
      <h3>📡 Implemented Endpoints</h3>
      <div class="endpoint"><span class="method-get">GET</span> /api/events &rarr; List events from data/events.json</div>
      <div class="endpoint"><span class="method-get">GET</span> /api/events/:id &rarr; Single event lookup</div>
      <div class="endpoint"><span class="method-post">POST</span> /api/events &rarr; Create event + emit 'eventCreated'</div>
      <div class="endpoint"><span class="method-post">POST</span> /api/register &rarr; Atomic registration + emit 'registrationCreated' + 'capacityAlert'</div>
      <div class="endpoint"><span class="method-get">GET</span> /api/registrations &rarr; List registrations from data/registrations.json</div>
      <div class="endpoint"><span class="method-post">POST</span> /api/cancel-registration &rarr; Cancel registration + restore capacity</div>
      <div class="endpoint"><span class="method-get">GET</span> /api/logs/stream &rarr; Stream logs/audit.log via fs.createReadStream</div>
      <div class="endpoint"><span class="method-get">GET</span> /api/export/csv &rarr; Stream events as CSV via stream.Transform</div>
    </div>
  </div>

  <script>
    async function fetchEvents() {
      const res = await fetch('/api/events');
      const data = await res.json();
      document.getElementById('outputConsole').textContent = JSON.stringify(data, null, 2);
    }
    async function fetchRegistrations() {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      document.getElementById('outputConsole').textContent = JSON.stringify(data, null, 2);
    }
    async function streamAuditLog() {
      const res = await fetch('/api/logs/stream');
      const text = await res.text();
      document.getElementById('outputConsole').textContent = text;
    }
  </script>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

// Start Server
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Program 3: Node.js Native Utility Server (No Express) `);
    console.log(` Running on port: http://localhost:${PORT}              `);
    console.log(` Built-in Streams, EventEmitter & File System Active.  `);
    console.log(`=======================================================`);
  });
}

module.exports = { server, notifier, readJSONFile, writeJSONFile };
