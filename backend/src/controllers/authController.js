const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../../models');
const config = require('../config');
const audit = require('../services/auditService');

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().valid('admin', 'volunteer', 'voter').required(),
    area: Joi.string().when('role', { is: 'volunteer', then: Joi.required(), otherwise: Joi.optional() })
  })
});

const registerVoterSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(8).max(128).required(),
    address: Joi.string().min(3).max(300).required(),
    epic_no: Joi.string().alphanum().min(6).max(20).required(),
    area: Joi.string().optional(),
    lat: Joi.number().optional(),
    lng: Joi.number().optional()
  })
});

const loginSchema = Joi.object({
  body: Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid('admin', 'volunteer', 'voter').optional()
  })
});

async function register(req, res) {
  try {
    const { name, email, password, mobile, role, area } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, config.bcryptRounds);

    // Create user with approval status
    const userData = {
      name,
      email: email.toLowerCase(),
      password_hash,
      mobile,
      role,
      area: role === 'volunteer' ? area : null,
      is_approved: role === 'voter' ? true : false // Voters are auto-approved, volunteers need admin approval
    };

    const user = await User.create(userData);

    // Log the registration
    await audit.log(req.user?.id || null, 'register_user', 'Users', user.id, { email, role, mobile });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_approved: user.is_approved,
      message: role === 'volunteer'
        ? 'Account created successfully! Your account is pending admin approval.'
        : 'Account created successfully! You can now login.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    // Normalize identifier
    const id = identifier?.trim();
    const where = id?.includes('@') ? { email: id.toLowerCase() } : { mobile: id };

    console.log(`[AUTH] Login attempt for identifier: ${id}, Resolved where:`, where);

    const user = await User.findOne({ where });

    if (!user) {
      console.log(`[AUTH] User not found for: ${id}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log(`[AUTH] Password mismatch for: ${id}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if volunteer account is approved
    if (user.role === 'volunteer' && !user.is_approved) {
      return res.status(403).json({ message: 'Volunteer account awaiting admin approval' });
    }

    await user.update({ last_login: new Date() });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, config.jwtSecret, { expiresIn: '8h' });

    return res.json({
      token,
      role: user.role,
      name: user.name,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        area: user.area
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Register voter endpoint as per new requirements
async function registerVoter(req, res) {
  try {
    const { name, email, phone, password, address, epic_no, lat, lng } = req.body;

    // Ward 11 validation
    const { isPointInsideWard11, isAddressLikelyInWard11 } = require('../utils/geo');
    const allowedLocalities = ["Ram Bagh Colony", "Shivtirth Nagar", "Arandavana", "Mathura Kunj", "Rohini Kunj"]; // curated list
    let allowed = false;
    if (typeof lat === 'number' && typeof lng === 'number') {
      allowed = isPointInsideWard11(lat, lng);
    } else {
      allowed = isAddressLikelyInWard11(address || '', allowedLocalities);
    }
    if (!allowed) {
      return res.status(400).json({ message: 'Registration allowed only for Ward 11 residents' });
    }

    // Duplicate checks: email and phone in Users
    const existingByEmail = await User.findOne({ where: { email } });
    if (existingByEmail) return res.status(409).json({ message: 'Email already exists' });
    const existingByPhone = await User.findOne({ where: { mobile: phone } });
    if (existingByPhone) return res.status(409).json({ message: 'Phone already exists' });

    const password_hash = await bcrypt.hash(password, config.bcryptRounds);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash,
      mobile: phone,
      role: 'voter',
      area: null,
      is_approved: true
    });

    // Create a record in Voters table so they can register complaints
    await Voter.create({
      name,
      email: email.toLowerCase(),
      phone,
      address,
      booth: req.body.area || '',
      user_id: user.id,
      category: 'neutral',
      notes: `Publicly registered. Voter ID: ${epic_no}`
    });

    return res.status(201).json({ message: 'Account created successfully. Please login.' });
  } catch (error) {
    console.error('Voter registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { registerSchema, registerVoterSchema, loginSchema, register, registerVoter, login };

