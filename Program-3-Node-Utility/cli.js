/**
 * Program 3: CLI Utility Demonstration
 * Executes Node.js file streams, EventEmitters, and record operations directly in terminal.
 */

const fs = require('fs');
const path = require('path');
const { Readable, Transform } = require('stream');
const { notifier, readJSONFile, writeJSONFile } = require('./server');

const EVENTS_FILE = path.join(__dirname, 'data', 'events.json');
const REGISTRATIONS_FILE = path.join(__dirname, 'data', 'registrations.json');

async function runCliDemo() {
  console.log('================================================================');
  console.log(' CAMPUSPULSE: Node.js Utility Stream & EventEmitter CLI Runner ');
  console.log('================================================================\n');

  console.log('1. Loading existing events from data/events.json using fs.readFile...');
  const events = await readJSONFile(EVENTS_FILE);
  console.log(`   Found ${events.length} events in storage.\n`);

  console.log('2. Streaming event titles through a Node.js Transform Stream:');
  const upperCaseStream = new Transform({
    objectMode: true,
    transform(event, encoding, callback) {
      const line = `   [STREAM CHUNK] Event #${event.id}: ${event.title.toUpperCase()} (Available: ${event.available_seats}/${event.total_seats})`;
      callback(null, line + '\n');
    }
  });

  const readable = Readable.from(events);
  readable.pipe(upperCaseStream).pipe(process.stdout);

  await new Promise(r => setTimeout(r, 600));

  console.log('\n3. Simulating student registration via EventEmitter:');
  const testReg = {
    id: Date.now(),
    eventId: 3,
    eventTitle: 'Generative AI & LLM Systems Hands-on Workshop',
    studentName: 'Maya Sharma',
    studentRoll: 'IT2026-088',
    studentEmail: 'maya.s@college.edu',
    studentDept: 'Information Technology',
    status: 'Confirmed',
    registeredAt: new Date().toISOString()
  };

  notifier.emit('registrationCreated', testReg);

  // Check capacity alert trigger
  const targetEvent = events.find(e => e.id === 3);
  if (targetEvent) {
    targetEvent.available_seats = Math.max(0, targetEvent.available_seats - 1);
    if (targetEvent.available_seats <= 3) {
      notifier.emit('capacityAlert', targetEvent);
    }
  }

  console.log('\n4. Verifying audit trail created in logs/audit.log:');
  const auditPath = path.join(__dirname, 'logs', 'audit.log');
  if (fs.existsSync(auditPath)) {
    const stream = fs.createReadStream(auditPath, { encoding: 'utf8', highWaterMark: 128 });
    console.log('   --- Begin Stream of logs/audit.log ---');
    stream.on('data', chunk => process.stdout.write(chunk));
    stream.on('end', () => {
      console.log('   --- End of Stream ---\n');
      console.log('CLI execution completed successfully.');
    });
  }
}

runCliDemo().catch(console.error);
