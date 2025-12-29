const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { registerSchema, registerVoterSchema, loginSchema, register, registerVoter, login } = require('../controllers/authController');
const validate = require('../middleware/validate');

// Registration routes
router.post('/register', register);
router.post('/register-voter', validate(registerVoterSchema), registerVoter);

// Login route (identifier: email or phone)
router.post('/login', validate(loginSchema), login);

module.exports = router;

