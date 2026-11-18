/**
 * Centralized Error Handling Middleware
 */

function errorHandler(err, req, res, next) {
  console.error('[Centralized Error Handler]:', err.stack || err.message);

  // PostgreSQL unique constraint violation code: 23505
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'Conflict: Record with unique value already exists.',
      details: err.detail || err.message
    });
  }

  // PostgreSQL foreign key violation code: 23503
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      error: 'Foreign key reference violation.',
      details: err.detail || err.message
    });
  }

  // PostgreSQL check constraint violation code: 23514
  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      error: 'Database constraint violation (check constraint).',
      details: err.detail || err.message
    });
  }

  // Default internal server error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
}

module.exports = errorHandler;
