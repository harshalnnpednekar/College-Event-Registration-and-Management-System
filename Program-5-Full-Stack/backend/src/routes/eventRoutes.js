/**
 * Event Routes
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validator');

// Public endpoints
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Admin-protected endpoints
router.post('/', verifyToken, isAdmin, validateEvent, eventController.createEvent);
router.put('/:id', verifyToken, isAdmin, eventController.updateEvent);
router.delete('/:id', verifyToken, isAdmin, eventController.deleteEvent);

module.exports = router;
