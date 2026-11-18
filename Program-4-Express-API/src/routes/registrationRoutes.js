/**
 * Registration Routes
 */

const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validator');

// Student-protected routes
router.post('/', verifyToken, validateRegistration, registrationController.registerForEvent);
router.get('/my', verifyToken, registrationController.getMyRegistrations);
router.delete('/:id', verifyToken, registrationController.cancelRegistration);

// Admin-protected routes
router.get('/all', verifyToken, isAdmin, registrationController.getAllRegistrations);
router.get('/stats', verifyToken, isAdmin, registrationController.getAdminStats);

module.exports = router;
