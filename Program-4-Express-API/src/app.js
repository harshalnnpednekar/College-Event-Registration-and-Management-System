/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Root Health & Interactive Documentation
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'CampusPulse College Event Registration & Management System',
    program: 'Program 4 - Express.js REST API with PostgreSQL',
    status: 'Operational',
    database: 'PostgreSQL (pg client)',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Protected)'
      },
      events: {
        list: 'GET /api/events',
        details: 'GET /api/events/:id',
        create: 'POST /api/events (Admin)',
        update: 'PUT /api/events/:id (Admin)',
        delete: 'DELETE /api/events/:id (Admin)'
      },
      registrations: {
        book: 'POST /api/registrations (Student, Transactional)',
        my_registrations: 'GET /api/registrations/my (Student)',
        cancel: 'DELETE /api/registrations/:id (Student, Transactional)',
        all_registrations: 'GET /api/registrations/all (Admin)',
        stats: 'GET /api/registrations/stats (Admin)'
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' does not exist.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
