/**
 * Event Controller (PostgreSQL parameterized queries)
 */

const db = require('../config/db');

exports.getAllEvents = async (req, res, next) => {
  try {
    const { category, status, search, sortBy } = req.query;

    let baseQuery = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      baseQuery += ` AND category = $${params.length}`;
    }

    if (status && status !== 'All') {
      params.push(status);
      baseQuery += ` AND status = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      baseQuery += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(venue) LIKE $${params.length})`;
    }

    // Sorting
    switch (sortBy) {
      case 'date-asc':
        baseQuery += ' ORDER BY event_date ASC';
        break;
      case 'date-desc':
        baseQuery += ' ORDER BY event_date DESC';
        break;
      case 'seats-desc':
        baseQuery += ' ORDER BY available_seats DESC';
        break;
      case 'seats-asc':
        baseQuery += ' ORDER BY available_seats ASC';
        break;
      case 'title-asc':
        baseQuery += ' ORDER BY title ASC';
        break;
      case 'title-desc':
        baseQuery += ' ORDER BY title DESC';
        break;
      default:
        baseQuery += ' ORDER BY event_date ASC';
    }

    const result = await db.query(baseQuery, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM events WHERE id = $1', [Number(id)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Event with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, category, venue, event_date, total_seats } = req.body;
    const seats = Number(total_seats);

    const result = await db.query(
      `INSERT INTO events (title, description, category, venue, event_date, total_seats, available_seats, status)
       VALUES ($1, $2, $3, $4, $5, $6, $6, 'Open')
       RETURNING *`,
      [title.trim(), description ? description.trim() : '', category, venue.trim(), new Date(event_date), seats]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, venue, event_date, total_seats, status } = req.body;

    // Check if event exists
    const check = await db.query('SELECT * FROM events WHERE id = $1', [Number(id)]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Event #${id} not found.` });
    }

    const current = check.rows[0];
    const newTitle = title !== undefined ? title.trim() : current.title;
    const newDesc = description !== undefined ? description.trim() : current.description;
    const newCat = category !== undefined ? category : current.category;
    const newVenue = venue !== undefined ? venue.trim() : current.venue;
    const newDate = event_date !== undefined ? new Date(event_date) : current.event_date;
    const newTotal = total_seats !== undefined ? Number(total_seats) : current.total_seats;
    const newStatus = status !== undefined ? status : current.status;

    // Recalculate available seats if capacity changed
    const registeredCount = current.total_seats - current.available_seats;
    const newAvailable = Math.max(0, newTotal - registeredCount);

    const result = await db.query(
      `UPDATE events
       SET title = $1, description = $2, category = $3, venue = $4, event_date = $5, total_seats = $6, available_seats = $7, status = $8
       WHERE id = $9
       RETURNING *`,
      [newTitle, newDesc, newCat, newVenue, newDate, newTotal, newAvailable, newStatus, Number(id)]
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING id, title', [Number(id)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Event #${id} not found.` });
    }

    res.status(200).json({
      success: true,
      message: `Event "${result.rows[0].title}" and all related registrations were deleted.`
    });
  } catch (err) {
    next(err);
  }
};
