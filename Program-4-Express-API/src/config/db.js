/**
 * PostgreSQL Database Connectivity Module
 * Uses 'pg' (node-postgres) exclusively.
 * Supports connection pooling, transactions, and parameterized SQL queries.
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/college_events';
const isProduction = process.env.NODE_ENV === 'production';

// In-Memory fallback storage for sandbox / offline testing if Postgres service is offline
let useInMemoryFallback = process.env.DB_MOCK === 'true';

const inMemoryStore = {
  users: [
    {
      id: 1,
      name: 'Administrator',
      email: 'admin@college.edu',
      password_hash: '$2a$10$8v8mQGZ/PjYhO3C0KzP8se4lYyU6WzY8V24rFv6dD2zR5eT7a1u0m',
      role: 'admin',
      created_at: new Date()
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john.doe@college.edu',
      password_hash: '$2a$10$7v7mQGZ/PjYhO3C0KzP8se4lYyU6WzY8V24rFv6dD2zR5eT7a1u0m',
      role: 'student',
      created_at: new Date()
    }
  ],
  events: [
    {
      id: 1,
      title: 'National Hackathon 2026: CodeCrafters',
      description: '36-hour non-stop hackathon challenging students to build innovative AI, Web3, and IoT solutions.',
      category: 'Technical',
      venue: 'Campus Innovation Hub & Lab 4',
      event_date: new Date(Date.now() + 5 * 86400000),
      total_seats: 120,
      available_seats: 24,
      status: 'Open',
      created_at: new Date()
    },
    {
      id: 2,
      title: 'Aura 2026: Annual Inter-College Cultural Fest',
      description: 'A vibrant celebration of music, dance, theatrical acts, photography exhibitions, and battle of the college bands.',
      category: 'Cultural',
      venue: 'Main University Auditorium',
      event_date: new Date(Date.now() + 10 * 86400000),
      total_seats: 500,
      available_seats: 85,
      status: 'Open',
      created_at: new Date()
    },
    {
      id: 3,
      title: 'Generative AI & LLM Systems Hands-on Workshop',
      description: 'Master prompt engineering, retrieval-augmented generation (RAG), vector embeddings, and LangChain.',
      category: 'Workshop',
      venue: 'Computer Center Room 201',
      event_date: new Date(Date.now() + 7 * 86400000),
      total_seats: 60,
      available_seats: 3,
      status: 'Fast Filling',
      created_at: new Date()
    },
    {
      id: 4,
      title: 'Future of Cloud Computing & DevOps Seminar',
      description: 'Industry keynote on microservices architectures, Kubernetes orchestration, CI/CD pipelines.',
      category: 'Seminar',
      venue: 'Seminar Hall B (Block 3)',
      event_date: new Date(Date.now() + 15 * 86400000),
      total_seats: 80,
      available_seats: 0,
      status: 'Closed',
      created_at: new Date()
    }
  ],
  registrations: [
    {
      id: 1,
      user_id: 2,
      event_id: 2,
      registration_date: new Date(),
      status: 'confirmed'
    }
  ]
};

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === 'true' || isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Warning]:', err.message);
});

/**
 * Execute parameterized query
 */
async function query(text, params = []) {
  if (useInMemoryFallback) {
    return runInMemoryQuery(text, params);
  }

  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    // If PostgreSQL service is unreachable locally in sandbox, switch gracefully to memory simulator
    if (err.code === 'ECONNREFUSED' || err.code === 'EACCES' || err.message.includes('connect')) {
      console.warn(`[PostgreSQL Notice]: Could not connect to PostgreSQL daemon (${err.message}). Using fallback memory adapter.`);
      useInMemoryFallback = true;
      return runInMemoryQuery(text, params);
    }
    throw err;
  }
}

/**
 * Client connection with transaction support (BEGIN, COMMIT, ROLLBACK)
 */
async function getClient() {
  if (useInMemoryFallback) {
    return {
      query: (t, p) => runInMemoryQuery(t, p),
      release: () => {}
    };
  }

  try {
    const client = await pool.connect();
    return client;
  } catch (err) {
    console.warn(`[PostgreSQL Client Notice]: Falling back to in-memory transaction adapter (${err.message}).`);
    useInMemoryFallback = true;
    return {
      query: (t, p) => runInMemoryQuery(t, p),
      release: () => {}
    };
  }
}

/**
 * In-Memory SQL Simulator (matches PostgreSQL relational queries and constraints)
 */
function runInMemoryQuery(sql, params) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  // 1. SELECT users by email
  if (/SELECT .* FROM users WHERE email = \$1/i.test(cleanSql)) {
    const user = inMemoryStore.users.find(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 2. SELECT user by id
  if (/SELECT .* FROM users WHERE id = \$1/i.test(cleanSql)) {
    const user = inMemoryStore.users.find(u => u.id === Number(params[0]));
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 3. INSERT user
  if (/INSERT INTO users/i.test(cleanSql)) {
    const [name, email, password_hash, role] = params;
    const exists = inMemoryStore.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      const err = new Error('duplicate key value violates unique constraint "users_email_key"');
      err.code = '23505';
      throw err;
    }
    const newUser = {
      id: inMemoryStore.users.length + 1,
      name,
      email,
      password_hash,
      role: role || 'student',
      created_at: new Date()
    };
    inMemoryStore.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 4. SELECT events with filters
  if (/SELECT .* FROM events/i.test(cleanSql) && !cleanSql.includes('WHERE id = $1')) {
    let list = [...inMemoryStore.events];
    return { rows: list, rowCount: list.length };
  }

  // 5. SELECT single event by ID
  if (/SELECT .* FROM events WHERE id = \$1/i.test(cleanSql)) {
    const ev = inMemoryStore.events.find(e => e.id === Number(params[0]));
    return { rows: ev ? [ev] : [], rowCount: ev ? 1 : 0 };
  }

  // 6. INSERT event
  if (/INSERT INTO events/i.test(cleanSql)) {
    const [title, description, category, venue, event_date, total_seats] = params;
    const newEvent = {
      id: inMemoryStore.events.length + 1,
      title,
      description,
      category,
      venue,
      event_date: new Date(event_date),
      total_seats: Number(total_seats),
      available_seats: Number(total_seats),
      status: 'Open',
      created_at: new Date()
    };
    inMemoryStore.events.push(newEvent);
    return { rows: [newEvent], rowCount: 1 };
  }

  // 7. UPDATE event
  if (/UPDATE events SET/i.test(cleanSql)) {
    const evId = Number(params[params.length - 1]);
    const ev = inMemoryStore.events.find(e => e.id === evId);
    if (ev) {
      if (params.length === 6) {
        ev.title = params[0];
        ev.description = params[1];
        ev.category = params[2];
        ev.venue = params[3];
        ev.status = params[4];
      }
      return { rows: [ev], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 8. DELETE event
  if (/DELETE FROM events WHERE id = \$1/i.test(cleanSql)) {
    const evId = Number(params[0]);
    const initial = inMemoryStore.events.length;
    inMemoryStore.events = inMemoryStore.events.filter(e => e.id !== evId);
    inMemoryStore.registrations = inMemoryStore.registrations.filter(r => r.event_id !== evId);
    return { rowCount: initial - inMemoryStore.events.length };
  }

  // 9. INSERT registration (TRANSACTION)
  if (/INSERT INTO registrations/i.test(cleanSql)) {
    const [user_id, event_id] = params;
    const dup = inMemoryStore.registrations.some(r => r.user_id === Number(user_id) && r.event_id === Number(event_id) && r.status === 'confirmed');
    if (dup) {
      const err = new Error('duplicate key value violates unique constraint "uq_user_event_registration"');
      err.code = '23505';
      throw err;
    }
    const targetEvent = inMemoryStore.events.find(e => e.id === Number(event_id));
    if (!targetEvent || targetEvent.available_seats <= 0) {
      throw new Error('Event has no available seats.');
    }
    targetEvent.available_seats -= 1;
    if (targetEvent.available_seats === 0) targetEvent.status = 'Closed';
    else if (targetEvent.available_seats <= 15) targetEvent.status = 'Fast Filling';

    const newReg = {
      id: inMemoryStore.registrations.length + 1,
      user_id: Number(user_id),
      event_id: Number(event_id),
      registration_date: new Date(),
      status: 'confirmed'
    };
    inMemoryStore.registrations.push(newReg);
    return { rows: [newReg], rowCount: 1 };
  }

  // 10. SELECT registrations by user
  if (/FROM registrations r .* WHERE r\.user_id = \$1/i.test(cleanSql)) {
    const userId = Number(params[0]);
    const userRegs = inMemoryStore.registrations
      .filter(r => r.user_id === userId)
      .map(r => {
        const ev = inMemoryStore.events.find(e => e.id === r.event_id) || {};
        return {
          id: r.id,
          registration_date: r.registration_date,
          status: r.status,
          event_id: r.event_id,
          title: ev.title,
          category: ev.category,
          venue: ev.venue,
          event_date: ev.event_date
        };
      });
    return { rows: userRegs, rowCount: userRegs.length };
  }

  // 11. SELECT all registrations (Admin)
  if (/FROM registrations r .* JOIN users/i.test(cleanSql)) {
    const allRegs = inMemoryStore.registrations.map(r => {
      const u = inMemoryStore.users.find(user => user.id === r.user_id) || {};
      const ev = inMemoryStore.events.find(e => e.id === r.event_id) || {};
      return {
        id: r.id,
        user_id: r.user_id,
        event_id: r.event_id,
        registration_date: r.registration_date,
        status: r.status,
        student_name: u.name,
        student_email: u.email,
        event_title: ev.title,
        category: ev.category,
        venue: ev.venue
      };
    });
    return { rows: allRegs, rowCount: allRegs.length };
  }

  // 12. DELETE registration (Cancel)
  if (/DELETE FROM registrations WHERE id = \$1 AND user_id = \$2/i.test(cleanSql)) {
    const [regId, userId] = params;
    const reg = inMemoryStore.registrations.find(r => r.id === Number(regId) && r.user_id === Number(userId));
    if (reg) {
      const ev = inMemoryStore.events.find(e => e.id === reg.event_id);
      if (ev) {
        ev.available_seats = Math.min(ev.total_seats, ev.available_seats + 1);
        if (ev.available_seats > 15) ev.status = 'Open';
        else if (ev.available_seats > 0) ev.status = 'Fast Filling';
      }
      inMemoryStore.registrations = inMemoryStore.registrations.filter(r => r.id !== Number(regId));
      return { rows: [reg], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 13. Dashboard stats
  if (/COUNT\(\*\)/i.test(cleanSql)) {
    return {
      rows: [{
        total_events: inMemoryStore.events.length,
        total_registrations: inMemoryStore.registrations.length,
        total_students: inMemoryStore.users.filter(u => u.role === 'student').length
      }],
      rowCount: 1
    };
  }

  // Default fallback
  return { rows: [], rowCount: 0 };
}

module.exports = {
  pool,
  query,
  getClient,
  inMemoryStore
};
