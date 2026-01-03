const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { User } = require('../../models');
const VolunteerRequest = require('../models/VolunteerRequest');
const { notifyVolunteerApproved, notifyVoterApproved } = require('../emailService');

// Get all volunteers (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const volunteers = await User.findAll({
      where: {
        role: 'volunteer',
        is_approved: true
      },
      attributes: ['id', 'name', 'email', 'mobile', 'area', 'last_login', 'createdAt', 'points', 'level'],
      order: [['createdAt', 'DESC']]
    });

    // Fetch pending from VolunteerRequest table (where new registrations go)
    const pending = await VolunteerRequest.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']]
    });

    res.json({ volunteers, pending });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Approve volunteer (admin only) - creates user from VolunteerRequest
router.post('/:id/approve', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Find in VolunteerRequest table
    const volunteerRequest = await VolunteerRequest.findOne({
      where: { id, status: 'pending' }
    });

    if (!volunteerRequest) {
      return res.status(404).json({ message: 'Volunteer request not found or already processed' });
    }

    // Check if user with this email already exists
    let user = await User.findOne({ where: { email: volunteerRequest.email } });

    // Determine role from request_type (defaults to volunteer if not set)
    const role = volunteerRequest.request_type || 'volunteer';

    if (user) {
      // User already exists - update their approval status and role
      await user.update({ is_approved: true, role: role });
      await volunteerRequest.update({ status: 'approved' });
      return res.json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} approved successfully`, userId: user.id });
    }

    // Create user in Users table with correct role
    user = await User.create({
      name: volunteerRequest.name,
      email: volunteerRequest.email,
      mobile: volunteerRequest.phone,
      password_hash: volunteerRequest.password_hash,
      role: role,
      is_approved: true,
      approved_by: adminId,
      approved_at: new Date(),
      avatar_path: volunteerRequest.avatar_path,
      points: 0,
      level: 1,
      tasks_completed: 0,
      complaints_resolved: 0,
      collaborations: 0
    });

    // Update request status
    await volunteerRequest.update({ status: 'approved' });

    // Send approval email notification
    try {
      console.log(`[EMAIL] Sending approval email to ${role}: ${volunteerRequest.email}`);
      if (role === 'volunteer') {
        await notifyVolunteerApproved(volunteerRequest.name, volunteerRequest.email);
      } else {
        await notifyVoterApproved(volunteerRequest.name, volunteerRequest.email);
      }
      console.log(`[EMAIL] Approval email sent successfully to: ${volunteerRequest.email}`);
    } catch (emailErr) {
      console.error(`[EMAIL] Failed to send approval email to ${volunteerRequest.email}:`, emailErr.message);
    }

    res.json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} approved successfully`, userId: user.id });
  } catch (error) {
    console.error('Error approving volunteer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject volunteer (admin only)
router.post('/:id/reject', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const volunteerRequest = await VolunteerRequest.findOne({
      where: { id, status: 'pending' }
    });

    if (!volunteerRequest) {
      return res.status(404).json({ message: 'Volunteer request not found or already processed' });
    }

    await volunteerRequest.update({ status: 'rejected' });

    res.json({ message: 'Volunteer application rejected' });
  } catch (error) {
    console.error('Error rejecting volunteer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Deactivate volunteer (admin only)
router.post('/:id/deactivate', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await User.findOne({
      where: {
        id,
        role: 'volunteer',
        is_approved: true
      }
    });

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // For now, we'll just update the approval status to false
    // In a real app, you might want to add a separate 'is_active' field
    await volunteer.update({
      is_approved: false
    });

    res.json({ message: 'Volunteer deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating volunteer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

// Volunteer profile for logged-in volunteer
router.get('/profile', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    const base = `${req.protocol}://${req.get('host')}`;
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_path ? `${base}/${user.avatar_path}` : null
    });
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});


