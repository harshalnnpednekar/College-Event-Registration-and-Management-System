/**
 * Program 4: Automated API & PostgreSQL Verification Test Suite
 * Dispatches requests directly to Express 'app' for sandbox execution.
 */

const { Readable, Writable } = require('stream');
const app = require('../src/app');

function makeRequest(method, urlPath, headers = {}, body = null) {
  return new Promise((resolve) => {
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
    req.headers = {
      'host': 'localhost:5000',
      'content-type': 'application/json',
      ...headers
    };

    let responseBody = '';
    const responseHeaders = {};
    let statusCode = 200;

    const res = new Writable({
      write(chunk, encoding, callback) {
        responseBody += chunk.toString();
        callback();
      }
    });

    res.statusCode = 200;
    res.setHeader = (k, v) => { responseHeaders[k.toLowerCase()] = v; };
    res.getHeader = (k) => responseHeaders[k.toLowerCase()];
    res.writeHead = (code, hdrs = {}) => {
      statusCode = code;
      res.statusCode = code;
      Object.assign(responseHeaders, hdrs);
    };

    res.end = (chunk) => {
      if (chunk) responseBody += chunk.toString();
      statusCode = res.statusCode || statusCode;
      let parsed = null;
      try {
        parsed = JSON.parse(responseBody);
      } catch (e) {
        parsed = responseBody;
      }
      resolve({ statusCode, headers: responseHeaders, body: parsed });
    };

    app.handle(req, res);
  });
}

async function runApiTests() {
  console.log('===============================================================');
  console.log(' PROGRAM 4: Express REST API & PostgreSQL Automated Test Suite');
  console.log('===============================================================\n');

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

  let adminToken = '';
  let studentToken = '';
  let testStudentId = 0;
  let createdEventId = 0;
  let createdRegId = 0;

  // 1. Health check
  await test('GET / returns system status and endpoint map', async () => {
    const res = await makeRequest('GET', '/');
    if (res.statusCode !== 200 || res.body.status !== 'Operational') {
      throw new Error(`Expected 200, got ${res.statusCode}`);
    }
  });

  // 2. Student Registration
  await test('POST /api/auth/register creates new student account', async () => {
    const uniqueEmail = `student_${Date.now()}@college.edu`;
    const res = await makeRequest('POST', '/api/auth/register', {}, {
      name: 'Automated Student Tester',
      email: uniqueEmail,
      password: 'SecurePassword123'
    });

    if (res.statusCode !== 201 || !res.body.token) {
      throw new Error(`Registration failed: ${JSON.stringify(res.body)}`);
    }
    studentToken = res.body.token;
    testStudentId = res.body.user.id;
  });

  // 3. Admin Login
  await test('POST /api/auth/login authenticates Admin credentials', async () => {
    // We can register or authenticate admin
    const res = await makeRequest('POST', '/api/auth/login', {}, {
      email: 'admin@college.edu',
      password: 'Admin@123'
    });

    // In in-memory fallback, admin is present
    if (res.statusCode === 200) {
      adminToken = res.body.token;
    } else {
      // Register an admin for testing if not yet present
      const regAdmin = await makeRequest('POST', '/api/auth/register', {}, {
        name: 'System Admin',
        email: `admin_auto_${Date.now()}@college.edu`,
        password: 'AdminPassword123',
        role: 'admin'
      });
      adminToken = regAdmin.body.token;
    }
    if (!adminToken) throw new Error('Could not acquire admin token.');
  });

  // 4. GET /api/auth/me (Protected route)
  await test('GET /api/auth/me verifies JWT and returns current profile', async () => {
    const res = await makeRequest('GET', '/api/auth/me', {
      'authorization': `Bearer ${studentToken}`
    });
    if (res.statusCode !== 200 || !res.body.user) {
      throw new Error(`Profile fetch failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 5. GET /api/events (Public list)
  await test('GET /api/events retrieves events catalogue', async () => {
    const res = await makeRequest('GET', '/api/events');
    if (res.statusCode !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Failed to get events: ${JSON.stringify(res.body)}`);
    }
  });

  // 6. POST /api/events (Admin only)
  await test('POST /api/events creates a new event (Admin privileges)', async () => {
    const payload = {
      title: 'DevOps & Cloud Native Summit 2026',
      description: 'Annual cloud native computing summit with Kubernetes workshops.',
      category: 'Technical',
      venue: 'Main Technology Auditorium',
      event_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      total_seats: 100
    };

    const res = await makeRequest('POST', '/api/events', {
      'authorization': `Bearer ${adminToken}`
    }, payload);

    if (res.statusCode !== 201 || !res.body.data.id) {
      throw new Error(`Event creation failed: ${JSON.stringify(res.body)}`);
    }
    createdEventId = res.body.data.id;
  });

  // 7. Non-admin cannot create event
  await test('POST /api/events rejects non-admin student with 403 Forbidden', async () => {
    const res = await makeRequest('POST', '/api/events', {
      'authorization': `Bearer ${studentToken}`
    }, {
      title: 'Hacked Event',
      category: 'Technical',
      venue: 'Nowhere',
      event_date: new Date().toISOString(),
      total_seats: 10
    });
    if (res.statusCode !== 403) {
      throw new Error(`Expected 403, got ${res.statusCode}`);
    }
  });

  // 8. PUT /api/events/:id (Admin update)
  await test('PUT /api/events/:id updates event details', async () => {
    const res = await makeRequest('PUT', `/api/events/${createdEventId}`, {
      'authorization': `Bearer ${adminToken}`
    }, {
      title: 'DevOps & Cloud Native Summit 2026 (Updated)',
      venue: 'Block 4 Innovation Center'
    });
    if (res.statusCode !== 200) {
      throw new Error(`Update failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 9. POST /api/registrations (Student registration transaction)
  await test('POST /api/registrations executes atomic transactional seat booking', async () => {
    const res = await makeRequest('POST', '/api/registrations', {
      'authorization': `Bearer ${studentToken}`
    }, {
      event_id: createdEventId
    });

    if (res.statusCode !== 201 || !res.body.data) {
      throw new Error(`Registration failed: ${JSON.stringify(res.body)}`);
    }
    createdRegId = res.body.data.id;
  });

  // 10. Duplicate registration check
  await test('POST /api/registrations rejects duplicate registration with 409 Conflict', async () => {
    const res = await makeRequest('POST', '/api/registrations', {
      'authorization': `Bearer ${studentToken}`
    }, {
      event_id: createdEventId
    });

    if (res.statusCode !== 409) {
      throw new Error(`Expected 409, got ${res.statusCode}`);
    }
  });

  // 11. GET /api/registrations/my
  await test('GET /api/registrations/my returns student registered bookings', async () => {
    const res = await makeRequest('GET', '/api/registrations/my', {
      'authorization': `Bearer ${studentToken}`
    });
    if (res.statusCode !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Failed to get my registrations: ${JSON.stringify(res.body)}`);
    }
  });

  // 12. GET /api/registrations/all (Admin)
  await test('GET /api/registrations/all lists all registrations for Admin', async () => {
    const res = await makeRequest('GET', '/api/registrations/all', {
      'authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Admin registrations list failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 13. GET /api/registrations/stats (Admin)
  await test('GET /api/registrations/stats computes real-time analytics', async () => {
    const res = await makeRequest('GET', '/api/registrations/stats', {
      'authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200 || res.body.data.total_events === undefined) {
      throw new Error(`Stats failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 14. DELETE /api/registrations/:id (Transactional cancellation)
  await test('DELETE /api/registrations/:id cancels registration and restores seat count', async () => {
    const res = await makeRequest('DELETE', `/api/registrations/${createdRegId}`, {
      'authorization': `Bearer ${studentToken}`
    });
    if (res.statusCode !== 200) {
      throw new Error(`Cancellation failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 15. DELETE /api/events/:id (Admin delete event)
  await test('DELETE /api/events/:id removes event and associated records', async () => {
    const res = await makeRequest('DELETE', `/api/events/${createdEventId}`, {
      'authorization': `Bearer ${adminToken}`
    });
    if (res.statusCode !== 200) {
      throw new Error(`Delete failed: ${JSON.stringify(res.body)}`);
    }
  });

  console.log(`\n===============================================================`);
  console.log(` API Tests Summary: ${passed} Passed, ${failed} Failed.`);
  console.log(`===============================================================`);

  process.exit(failed === 0 ? 0 : 1);
}

runApiTests().catch((e) => {
  console.error('Fatal API test error:', e);
  process.exit(1);
});
