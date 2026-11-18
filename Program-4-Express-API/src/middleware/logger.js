/**
 * Request Logging Middleware
 * Captures method, path, status, and response duration.
 */

function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    let color = '\x1b[32m'; // green
    if (statusCode >= 400 && statusCode < 500) color = '\x1b[33m'; // yellow
    if (statusCode >= 500) color = '\x1b[31m'; // red

    console.log(
      `[${timestamp}] ${color}${req.method}\x1b[0m ${req.originalUrl} - ${color}${statusCode}\x1b[0m (${duration}ms)`
    );
  });

  next();
}

module.exports = requestLogger;
