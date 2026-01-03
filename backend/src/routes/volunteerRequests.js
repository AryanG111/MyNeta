const express = require('express');
const bcrypt = require('bcrypt');
const { uploadAvatar } = require('../config/upload');
const VolunteerRequest = require('../models/VolunteerRequest');
const { User } = require('../../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { notifyAdminVolunteerRegistration } = require('../emailService');

const router = express.Router();

// Public volunteer sign-up
router.post('/request', uploadAvatar.single('avatar'), async (req, res) => {
	try {
		const { name, email, phone, password, message } = req.body;
		if (!name || !email || !phone || !password) return res.status(400).json({ message: 'Missing required fields' });
		const password_hash = await bcrypt.hash(password, 10);
		const avatar_path = req.file ? `uploads/avatars/${req.file.filename}` : null;
		await VolunteerRequest.create({ name, email, phone, password_hash, message, avatar_path, status: 'pending', request_type: 'volunteer' });

		// Send email notification to admin
		notifyAdminVolunteerRegistration({ name, email, mobile: phone, message });

		return res.status(201).json({ message: 'Volunteer request submitted – awaiting admin approval' });
	} catch (e) {
		return res.status(500).json({ message: 'Server error' });
	}
});

// Admin endpoints
router.get('/admin/volunteer-requests', authenticateToken, authorizeRoles('admin'), async (req, res) => {
	const pending = await VolunteerRequest.findAll({ where: { status: 'pending' } });
	return res.json(pending);
});

router.post('/admin/approve-volunteer/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
	try {
		const id = req.params.id;
		const reqRow = await VolunteerRequest.findByPk(id);
		if (!reqRow || reqRow.status !== 'pending') return res.status(404).json({ message: 'Request not found' });
		// Create user
		const user = await User.create({
			name: reqRow.name,
			email: reqRow.email,
			mobile: reqRow.phone,
			password_hash: reqRow.password_hash,
			role: 'volunteer',
			is_approved: true,
			area: null,
		});
		await reqRow.update({ status: 'approved' });
		return res.json({ message: 'Volunteer approved', userId: user.id });
	} catch (e) {
		return res.status(500).json({ message: 'Server error' });
	}
});

router.post('/admin/reject-volunteer/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
	const id = req.params.id;
	const reqRow = await VolunteerRequest.findByPk(id);
	if (!reqRow || reqRow.status !== 'pending') return res.status(404).json({ message: 'Request not found' });
	await reqRow.update({ status: 'rejected' });
	return res.json({ message: 'Volunteer request rejected' });
});

module.exports = router;


