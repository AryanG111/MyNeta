const express = require('express');
const bcrypt = require('bcrypt');
const VoterRequest = require('../models/VoterRequest');
const { User, Voter } = require('../../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { notifyVoterApproved } = require('../emailService');

const router = express.Router();

// Public voter sign-up
router.post('/request', async (req, res) => {
    try {
        const { name, email, phone, password, address, area, ward_no, voter_id, message } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if email already exists
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        await VoterRequest.create({
            name, email, phone, password_hash, address, area, ward_no, voter_id, message, status: 'pending'
        });

        return res.status(201).json({ message: 'Voter registration submitted – awaiting approval' });
    } catch (e) {
        console.error('Error creating voter request:', e);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get all voter requests (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const pending = await VoterRequest.findAll({
            where: { status: 'pending' },
            order: [['createdAt', 'DESC']]
        });
        res.json({ pending });
    } catch (error) {
        console.error('Error fetching voter requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Approve voter (admin only)
router.post('/:id/approve', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        const voterRequest = await VoterRequest.findOne({
            where: { id, status: 'pending' }
        });

        if (!voterRequest) {
            return res.status(404).json({ message: 'Voter request not found or already processed' });
        }

        // Check if user with this email already exists
        let user = await User.findOne({ where: { email: voterRequest.email } });

        if (!user) {
            // Create user in Users table for login
            user = await User.create({
                name: voterRequest.name,
                email: voterRequest.email,
                mobile: voterRequest.phone,
                password_hash: voterRequest.password_hash,
                role: 'voter',
                is_approved: true,
                approved_by: adminId,
                approved_at: new Date(),
                area: voterRequest.area
            });
        } else {
            // User already exists - update their role
            await user.update({ is_approved: true, role: 'voter' });
        }

        // Also create a record in Voters table so they appear in voters list
        await Voter.create({
            name: voterRequest.name,
            email: voterRequest.email,
            phone: voterRequest.phone,
            address: voterRequest.address || voterRequest.area || '',
            category: 'supporter', // Default to supporter for registered voters
            booth: voterRequest.area || '',
            ward_no: voterRequest.ward_no || '',
            user_id: user.id,
            notes: `Registered via online form. Voter ID: ${voterRequest.voter_id || 'N/A'}`
        });

        await voterRequest.update({ status: 'approved' });

        // Notify voter
        notifyVoterApproved(voterRequest.name, voterRequest.email);

        res.json({ message: 'Voter approved successfully', userId: user.id });
    } catch (error) {
        console.error('Error approving voter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reject voter (admin only)
router.post('/:id/reject', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const voterRequest = await VoterRequest.findOne({
            where: { id, status: 'pending' }
        });

        if (!voterRequest) {
            return res.status(404).json({ message: 'Voter request not found or already processed' });
        }

        await voterRequest.update({ status: 'rejected' });

        res.json({ message: 'Voter application rejected' });
    } catch (error) {
        console.error('Error rejecting voter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
