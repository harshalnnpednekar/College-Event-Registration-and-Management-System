/**
 * Request Input Validation Middleware
 */

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('Name must be at least 3 characters.');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required fields.'
    });
  }
  next();
}

function validateEvent(req, res, next) {
  const { title, category, venue, event_date, total_seats } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 4) {
    errors.push('Title must be at least 4 characters long.');
  }

  const validCategories = ['Technical', 'Cultural', 'Workshop', 'Sports', 'Seminar'];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}.`);
  }

  if (!venue || typeof venue !== 'string' || venue.trim().length < 3) {
    errors.push('Venue is required.');
  }

  if (!event_date || isNaN(Date.parse(event_date))) {
    errors.push('A valid ISO event_date is required.');
  }

  const seats = Number(total_seats);
  if (isNaN(seats) || seats <= 0) {
    errors.push('Total seats must be a positive integer.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
}

function validateRegistration(req, res, next) {
  const { event_id } = req.body;
  if (!event_id || isNaN(Number(event_id))) {
    return res.status(400).json({
      success: false,
      error: 'Valid numeric event_id is required.'
    });
  }
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateEvent,
  validateRegistration
};
