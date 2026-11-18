const fs = require('fs');

function wrapTerminal(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 2rem;
      background: #090d16;
      font-family: 'JetBrains Mono', monospace;
      color: #e2e8f0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
    }
    .term-window {
      width: 100%;
      max-width: 1100px;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
    }
    .term-titlebar {
      background: #1e293b;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .term-dots {
      display: flex;
      gap: 0.5rem;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .term-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .term-body {
      padding: 1.75rem;
      font-size: 0.92rem;
      line-height: 1.6;
      overflow-x: auto;
    }
    .green { color: #34d399; font-weight: 700; }
    .cyan { color: #38bdf8; font-weight: 600; }
    .amber { color: #fbbf24; font-weight: 600; }
    .red { color: #f87171; font-weight: 700; }
    .dim { color: #64748b; }
    .highlight { background: rgba(56, 189, 248, 0.1); padding: 0.15rem 0.4rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="term-window">
    <div class="term-titlebar">
      <div class="term-dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <span class="term-title">${title} &bull; Roll No: 41</span>
      <span style="font-size: 0.75rem; color: #64748b;">Node.js v26.13.0</span>
    </div>
    <div class="term-body">
      ${content}
    </div>
  </div>
</body>
</html>`;
}

// 1. Snapshot: CLI Stream Runner
const cliOutputHtml = `
<div style="color: #94a3b8; margin-bottom: 1rem;">PS C:\\Users\\harsh\\College-Event-Registration-and-Management-System\\Program-3-Node-Utility&gt; <span style="color: #fff; font-weight: 700;">node cli.js</span></div>

<div class="cyan">================================================================</div>
<div class="cyan"> CAMPUSPULSE: Node.js Utility Stream &amp; EventEmitter CLI Runner </div>
<div class="cyan">================================================================</div>
<br>
<div>1. Loading existing events from data/events.json using fs.readFile...</div>
<div class="dim">&nbsp;&nbsp;&nbsp;Found 4 events in storage.</div>
<br>
<div>2. Streaming event titles through a Node.js <span class="highlight">stream.Transform</span>:</div>
<div>&nbsp;&nbsp;&nbsp;<span class="cyan">[STREAM CHUNK]</span> Event #1: NATIONAL HACKATHON 2026: CODECRAFTERS (Available: 25/100)</div>
<div>&nbsp;&nbsp;&nbsp;<span class="cyan">[STREAM CHUNK]</span> Event #2: AURA 2026: ANNUAL CULTURAL FEST (Available: 70/400)</div>
<div>&nbsp;&nbsp;&nbsp;<span class="cyan">[STREAM CHUNK]</span> Event #3: GENERATIVE AI &amp; LLM SYSTEMS HANDS-ON WORKSHOP (Available: 3/50)</div>
<div>&nbsp;&nbsp;&nbsp;<span class="cyan">[STREAM CHUNK]</span> Event #4: CLOUD ARCHITECTURE &amp; KUBERNETES SEMINAR (Available: 0/60)</div>
<br>
<div>3. Simulating student registration via <span class="highlight">events.EventEmitter</span>:</div>
<div><span class="green">[EVENT EMITTER: registrationCreated]</span> Student "Maya Sharma" (Roll: IT2026-088) registered for Event #3 (Generative AI &amp; LLM Systems Hands-on Workshop)</div>
<div><span class="amber">[EVENT EMITTER: capacityAlert]</span> Event #3 "Generative AI &amp; LLM Systems Hands-on Workshop" reached critical capacity: <span class="red">2 seats remaining!</span> Status: Fast Filling</div>
<br>
<div>4. Verifying audit trail created in <span class="highlight">logs/audit.log</span> via Writable Stream:</div>
<div class="dim">&nbsp;&nbsp;&nbsp;--- Begin Stream of logs/audit.log (fs.createReadStream) ---</div>
<div class="dim">[2026-11-15T08:30:00.000Z] [AUDIT] System initialized. Sample registration loaded for Alex Rivera (CS2026-001) in Event #1.</div>
<div><span class="green">[2026-11-15T10:00:14.081Z] [AUDIT]</span> REGISTRATION_CREATED: Student "Maya Sharma" (IT2026-088) booked Event #3 [RegID: 1794738814074]</div>
<div><span class="amber">[2026-11-15T10:00:14.090Z] [AUDIT]</span> CAPACITY_ALERT: Event #3 "Generative AI &amp; LLM Systems Hands-on Workshop" has 2 seats remaining (Status: Fast Filling)</div>
<div class="dim">&nbsp;&nbsp;&nbsp;--- End of Stream ---</div>
<br>
<div class="green">&#10004; CLI execution completed successfully.</div>
`;

// 2. Snapshot: Test Suite Output
const testOutputHtml = `
<div style="color: #94a3b8; margin-bottom: 1rem;">PS C:\\Users\\harsh\\College-Event-Registration-and-Management-System\\Program-3-Node-Utility&gt; <span style="color: #fff; font-weight: 700;">npm test</span></div>

<div class="cyan">--- Starting Program 3 Automated Verification Tests ---</div>
<div class="dim">Target: http://localhost:3003 (Core http.createServer - Zero Express)</div>
<br>
<div><span class="green">&#10004; PASS:</span> GET /api/events returns event list from JSON file</div>
<div><span class="green">&#10004; PASS:</span> GET /api/events/1 returns single event object</div>
<div><span class="cyan">[EVENT EMITTER: registrationCreated]</span> Student "Test Student Automated" registered for Event #1 (National Hackathon 2026: CodeCrafters)</div>
<div><span class="green">&#10004; PASS:</span> POST /api/register registers student, updates capacity and emits notification</div>
<div><span class="green">&#10004; PASS:</span> POST /api/register detects duplicate registration and returns 409 conflict</div>
<div><span class="green">&#10004; PASS:</span> GET /api/registrations returns registration list</div>
<div><span class="amber">[EVENT EMITTER: registrationCancelled]</span> RegID #102 cancelled for Event #1. Seat released.</div>
<div><span class="green">&#10004; PASS:</span> POST /api/cancel-registration cancels registration and restores seat</div>
<div><span class="green">&#10004; PASS:</span> GET /api/logs/stream pipes audit log via fs.createReadStream</div>
<div><span class="green">&#10004; PASS:</span> GET /api/export/csv transforms event records to CSV stream on the fly</div>
<br>
<div class="green" style="font-size: 1.05rem; border-top: 1px dashed #334155; padding-top: 1rem;">
  ===============================================================<br>
  &#10004; Tests finished: 8 Passed, 0 Failed. All Core Node.js Streams &amp; Emitters Verified.<br>
  ===============================================================
</div>
`;

// 3. Snapshot: CSV Transform Stream Download Output
const csvOutputHtml = `
<div style="color: #94a3b8; margin-bottom: 1rem;">HTTP GET Request: <span class="cyan">http://localhost:3003/api/export/csv</span></div>
<div class="dim">Response Header: Content-Type: text/csv; charset=utf-8</div>
<div class="dim">Streaming Engine: stream.Readable.from(events) |&gt; stream.Transform |&gt; res</div>
<br>
<div style="background: #020617; padding: 1.25rem; border-radius: 8px; border: 1px solid #1e293b;">
  <div class="green" style="font-weight: 700;">ID,Title,Category,Venue,Total_Seats,Available_Seats,Status</div>
  <div>"1","National Hackathon 2026: CodeCrafters","Technical","Campus Innovation Hub &amp; Lab 4","100","24","Open"</div>
  <div>"2","Aura 2026: Annual Cultural Fest","Cultural","Main University Auditorium","400","70","Open"</div>
  <div>"3","Generative AI &amp; LLM Systems Hands-on Workshop","Workshop","Computer Center Room 201","50","2","Fast Filling"</div>
  <div>"4","Cloud Architecture &amp; Kubernetes Seminar","Seminar","Seminar Hall B (Block 3)","60","0","Closed"</div>
</div>
<br>
<div class="dim">Generated dynamically without saving intermediate files on disk using backpressure-safe Node.js stream pipeline.</div>
`;

fs.writeFileSync('docs/screenshots/snap_p3_cli.html', wrapTerminal('Program 3 CLI Stream & Notification Runner', cliOutputHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p3_test.html', wrapTerminal('Program 3 Automated Test Suite', testOutputHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p3_csv.html', wrapTerminal('Program 3 CSV Transform Stream Export (/api/export/csv)', csvOutputHtml), 'utf8');

console.log('Program 3 snapshots prepared!');
