/**
 * Registration Controller
 * Uses PostgreSQL Database Transactions (BEGIN, COMMIT, ROLLBACK)
 * for atomic seat allocation, duplicate prevention, and seat release.
 */

const db = require('../config/db');

/**
 * Register student for an event using a database transaction
 */
exports.registerForEvent = async (req, res, next) => {
  const userId = req.user.id;
  const { event_id } = req.body;
  const eventId = Number(event_id);

  const client = await db.getClient();

  try {
    // 1. Begin transaction
    await client.query('BEGIN');

    // 2. Lock event row for update and check current availability
    const eventResult = await client.query(
      'SELECT id, title, total_seats, available_seats, status FROM events WHERE id = $1 FOR UPDATE',
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: `Event #${eventId} not found.` });
    }

    const event = eventResult.rows[0];

    // Check if seats remain
    if (event.available_seats <= 0 || event.status === 'Closed') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: `Event "${event.title}" has reached full capacity. No seats available.`
      });
    }

    // 3. Check for duplicate registration
    const dupCheck = await client.query(
      'SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );

    if (dupCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: 'Duplicate registration: You have already registered for this event.'
      });
    }

    // 4. Insert registration record
    const regResult = await client.query(
      `INSERT INTO registrations (user_id, event_id, registration_date, status)
       VALUES ($1, $2, NOW(), 'confirmed')
       RETURNING id, user_id, event_id, registration_date, status`,
      [userId, eventId]
    );

    // 5. Decrement available seats and update status
    const nextSeats = event.available_seats - 1;
    let nextStatus = event.status;
    if (nextSeats === 0) nextStatus = 'Closed';
    else if (nextSeats <= 15) nextStatus = 'Fast Filling';

    await client.query(
      'UPDATE events SET available_seats = $1, status = $2 WHERE id = $3',
      [nextSeats, nextStatus, eventId]
    );

    // 6. Commit transaction
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: `Registration confirmed for "${event.title}"!`,
      data: regResult.rows[0],
      remainingSeats: nextSeats
    });

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    if (client.release) client.release();
  }
};

/**
 * Cancel registration and release seat via transaction
 */
exports.cancelRegistration = async (req, res, next) => {
  const userId = req.user.id;
  const regId = Number(req.params.id);

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Check ownership of registration
    const regResult = await client.query(
      'SELECT id, user_id, event_id FROM registrations WHERE id = $1 AND user_id = $2',
      [regId, userId]
    );

    if (regResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Registration record not found or does not belong to you.'
      });
    }

    const reg = regResult.rows[0];

    // Delete registration
    await client.query('DELETE FROM registrations WHERE id = $1', [regId]);

    // Restore available seat on event
    const eventRes = await client.query(
      'SELECT id, total_seats, available_seats, status FROM events WHERE id = $1 FOR UPDATE',
      [reg.event_id]
    );

    if (eventRes.rows.length > 0) {
      const ev = eventRes.rows[0];
      const nextSeats = Math.min(ev.total_seats, ev.available_seats + 1);
      let nextStatus = ev.status;
      if (nextSeats > 15) nextStatus = 'Open';
      else if (nextSeats > 0) nextStatus = 'Fast Filling';

      await client.query(
        'UPDATE events SET available_seats = $1, status = $2 WHERE id = $3',
        [nextSeats, nextStatus, reg.event_id]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Registration successfully cancelled and seat restored.'
    });

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    next(err);
  } finally {
    if (client.release) client.release();
  }
};

/**
 * Get all registrations for the logged-in student
 */
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        r.id,
        r.registration_date,
        r.status,
        e.id AS event_id,
        e.title,
        e.description,
        e.category,
        e.venue,
        e.event_date
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
      ORDER BY r.registration_date DESC
    `;

    const result = await db.query(query, [userId]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all registrations across all students (Admin)
 */
exports.getAllRegistrations = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        r.id,
        r.registration_date,
        r.status,
        u.id AS student_id,
        u.name AS student_name,
        u.email AS student_email,
        e.id AS event_id,
        e.title AS event_title,
        e.category,
        e.venue,
        e.event_date
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      ORDER BY r.registration_date DESC
    `;

    const result = await db.query(query);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Dashboard Statistics
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const eventStats = await db.query(`
      SELECT 
        COUNT(*) AS total_events,
        COALESCE(SUM(total_seats), 0) AS total_capacity,
        COALESCE(SUM(available_seats), 0) AS available_capacity
      FROM events
    `);

    const regStats = await db.query(`
      SELECT COUNT(*) AS total_registrations FROM registrations WHERE status = 'confirmed'
    `);

    const userStats = await db.query(`
      SELECT COUNT(*) AS total_students FROM users WHERE role = 'student'
    `);

    const categoryStats = await db.query(`
      SELECT category, COUNT(*) as count FROM events GROUP BY category
    `);

    res.status(200).json({
      success: true,
      data: {
        total_events: Number(eventStats.rows[0]?.total_events || 0),
        total_capacity: Number(eventStats.rows[0]?.total_capacity || 0),
        available_capacity: Number(eventStats.rows[0]?.available_capacity || 0),
        total_registrations: Number(regStats.rows[0]?.total_registrations || 0),
        total_students: Number(userStats.rows[0]?.total_students || 0),
        categories: categoryStats.rows || []
      }
    });
  } catch (err) {
    next(err);
  }
};
