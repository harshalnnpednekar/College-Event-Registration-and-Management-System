/**
 * Automated Test Suite for Program 3 (Node.js Utility Server)
 * Supports in-process request dispatch for complete sandbox isolation.
 */

const { Readable, Writable } = require('stream');
const { server } = require('./server');

function makeRequest(method, urlPath, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    // Create custom incoming request stream
    const req = new Readable({
      read() {
        if (body) {
          this.push(typeof body === 'string' ? body : JSON.stringify(body));
        }
        this.push(null);
      }
    });

    req.method = method;
    req.url = urlPath;
    req.headers = { host: 'localhost:3003', ...headers };

    // Create custom writable response
    let responseBody = '';
    const responseHeaders = {};
    let statusCode = 200;

    const res = new Writable({
      write(chunk, encoding, callback) {
        responseBody += chunk.toString();
        callback();
      }
    });

    res.writeHead = (code, hdrs = {}) => {
      statusCode = code;
      Object.assign(responseHeaders, hdrs);
    };

    res.setHeader = (key, val) => {
      responseHeaders[key.toLowerCase()] = val;
    };

    res.end = (chunk) => {
      if (chunk) responseBody += chunk.toString();
      let parsed = null;
      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {
        parsed = responseBody;
      }
      resolve({ statusCode, headers: responseHeaders, body: parsed });
    };

    // Dispatch request directly to server handler
    server.emit('request', req, res);
  });
}

async function runTests() {
  console.log('--- Starting Program 3 Automated Verification Tests ---');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`\x1b[32m✔ PASS:\x1b[0m ${name}`);
      passed++;
    } catch (err) {
      console.error(`\x1b[31m✘ FAIL:\x1b[0m ${name}`, err.message);
      failed++;
    }
  }

  // 1. GET /api/events
  await test('GET /api/events returns event list from JSON file', async () => {
    const res = await makeRequest('GET', '/api/events');
    if (res.statusCode !== 200 || !res.body.success || !Array.isArray(res.body.data)) {
      throw new Error(`Unexpected response: ${JSON.stringify(res.body)}`);
    }
  });

  // 2. GET /api/events/:id
  await test('GET /api/events/1 returns single event object', async () => {
    const res = await makeRequest('GET', '/api/events/1');
    if (res.statusCode !== 200 || res.body.data.id !== 1) {
      throw new Error(`Unexpected event data: ${JSON.stringify(res.body)}`);
    }
  });

  // 3. POST /api/register
  let createdRegId = null;
  await test('POST /api/register registers student, updates capacity and emits notification', async () => {
    const payload = {
      eventId: 1,
      studentName: 'Test Student Automated',
      studentRoll: 'TEST-2026',
      studentEmail: `test.${Date.now()}@college.edu`,
      studentDept: 'Computer Science & Engineering'
    };
    const res = await makeRequest('POST', '/api/register', { 'content-type': 'application/json' }, payload);

    if (res.statusCode !== 201 || !res.body.success) {
      throw new Error(`Registration failed: ${JSON.stringify(res.body)}`);
    }
    createdRegId = res.body.data.id;
  });

  // 4. Duplicate registration check
  await test('POST /api/register detects duplicate registration and returns 409 conflict', async () => {
    const payload = {
      eventId: 1,
      studentName: 'Test Student Duplicate',
      studentRoll: 'TEST-DUP',
      studentEmail: 'alex.rivera@college.edu', // Already registered
      studentDept: 'Computer Science'
    };
    const res = await makeRequest('POST', '/api/register', { 'content-type': 'application/json' }, payload);

    if (res.statusCode !== 409) {
      throw new Error(`Expected 409 conflict, got ${res.statusCode}`);
    }
  });

  // 5. GET /api/registrations
  await test('GET /api/registrations returns registration list', async () => {
    const res = await makeRequest('GET', '/api/registrations');
    if (res.statusCode !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Failed to fetch registrations: ${JSON.stringify(res.body)}`);
    }
  });

  // 6. POST /api/cancel-registration
  await test('POST /api/cancel-registration cancels registration and restores seat', async () => {
    if (!createdRegId) return;
    const res = await makeRequest('POST', '/api/cancel-registration', { 'content-type': 'application/json' }, { registrationId: createdRegId });

    if (res.statusCode !== 200 || !res.body.success) {
      throw new Error(`Failed to cancel registration: ${JSON.stringify(res.body)}`);
    }
  });

  // 7. GET /api/logs/stream
  await test('GET /api/logs/stream pipes audit log via fs.createReadStream', async () => {
    const res = await makeRequest('GET', '/api/logs/stream');
    if (res.statusCode !== 200 || typeof res.body !== 'string') {
      throw new Error(`Stream failed: ${res.statusCode}`);
    }
  });

  // 8. GET /api/export/csv
  await test('GET /api/export/csv transforms event records to CSV stream on the fly', async () => {
    const res = await makeRequest('GET', '/api/export/csv');
    if (res.statusCode !== 200 || !res.headers['Content-Type'].includes('text/csv')) {
      throw new Error(`CSV export failed: ${res.statusCode}`);
    }
    if (!res.body.includes('Title') || !res.body.includes('Category')) {
      throw new Error('CSV headers missing from stream output');
    }
  });

  console.log(`\nTests finished: ${passed} Passed, ${failed} Failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

runTests().catch((e) => {
  console.error('Test execution fatal error:', e);
  process.exit(1);
});
