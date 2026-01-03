const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const VolunteerRequest = require('../models/VolunteerRequest');
const { User, Voter, Complaint, Event, sequelize } = require('../../models');

const router = express.Router();

// List pending volunteer requests
router.get('/volunteer-requests', authenticateToken, authorizeRoles('admin'), async (req, res) => {
	try {
		const rows = await VolunteerRequest.findAll({ where: { status: 'pending' } });
		// map avatar_path to full URL
		const base = `${req.protocol}://${req.get('host')}`;
		return res.json(rows.map(r => ({
			id: r.id,
			name: r.name,
			email: r.email,
			phone: r.phone,
			message: r.message,
			status: r.status,
			avatar_url: r.avatar_path ? `${base}/${r.avatar_path}` : null
		})));
	} catch (error) {
		console.error('Error fetching volunteer requests:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

// Approve volunteer
router.post('/approve-volunteer/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
	try {
		const id = req.params.id;
		const reqRow = await VolunteerRequest.findByPk(id);
		if (!reqRow || reqRow.status !== 'pending') return res.status(404).json({ message: 'Request not found' });
		const existing = await User.findOne({ where: { email: reqRow.email } });
		if (existing) return res.status(409).json({ message: 'User already exists' });
		const created = await User.create({
			name: reqRow.name,
			email: reqRow.email,
			mobile: reqRow.phone,
			password_hash: reqRow.password_hash,
			role: 'volunteer',
			is_approved: true,
			area: null,
			avatar_path: reqRow.avatar_path || null
		});
		await reqRow.update({ status: 'approved' });
		return res.json({ message: 'Volunteer approved', userId: created.id });
	} catch (error) {
		console.error('Error approving volunteer:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

// Reject volunteer
router.post('/reject-volunteer/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
	try {
		const id = req.params.id;
		const reqRow = await VolunteerRequest.findByPk(id);
		if (!reqRow || reqRow.status !== 'pending') return res.status(404).json({ message: 'Request not found' });
		await reqRow.update({ status: 'rejected' });
		return res.json({ message: 'Volunteer request rejected' });
	} catch (error) {
		console.error('Error rejecting volunteer:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
});

// Dashboard stats - optimized single endpoint for all dashboard metrics
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
	try {
		const [voterCounts, complaintStats, totalEvents, totalVolunteers, pendingVolunteers] = await Promise.all([
			// Voter counts by category
			Voter.findAll({
				attributes: [
					'category',
					[sequelize.fn('COUNT', sequelize.col('id')), 'count']
				],
				group: ['category'],
				raw: true
			}),
			// Complaint counts by status
			Complaint.findAll({
				attributes: [
					'status',
					[sequelize.fn('COUNT', sequelize.col('id')), 'count']
				],
				group: ['status'],
				raw: true
			}),
			// Total events
			Event.count(),
			// Total approved volunteers
			User.count({ where: { role: 'volunteer', is_approved: true } }),
			// Pending volunteer requests
			User.count({ where: { role: 'volunteer', is_approved: false } })
		]);

		const totalVoters = voterCounts.reduce((sum, v) => sum + parseInt(v.count || 0), 0);
		const totalComplaints = complaintStats.reduce((sum, c) => sum + parseInt(c.count || 0), 0);

		res.json({
			totalVoters,
			totalComplaints,
			totalEvents,
			totalVolunteers,
			pendingVolunteers,
			voterCounts: voterCounts.map(v => ({
				category: v.category,
				count: parseInt(v.count)
			})),
			complaintStats: complaintStats.map(c => ({
				status: c.status,
				count: parseInt(c.count)
			}))
		});
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = router;



