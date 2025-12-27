const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { User } = require('../../models');

// Get all volunteers (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const volunteers = await User.findAll({
      where: {
        role: 'volunteer',
        is_approved: true
      },
      attributes: ['id', 'name', 'email', 'mobile', 'area', 'last_login', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const pending = await User.findAll({
      where: {
        role: 'volunteer',
        is_approved: false
      },
      attributes: ['id', 'name', 'email', 'mobile', 'area', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({ volunteers, pending });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Approve volunteer (admin only)
router.post('/:id/approve', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const volunteer = await User.findOne({
      where: {
        id,
        role: 'volunteer',
        is_approved: false
      }
    });

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found or already approved' });
    }

    await volunteer.update({
      is_approved: true,
      approved_by: adminId,
      approved_at: new Date()
    });

    res.json({ message: 'Volunteer approved successfully' });
  } catch (error) {
    console.error('Error approving volunteer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject volunteer (admin only)
router.post('/:id/reject', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await User.findOne({
      where: {
        id,
        role: 'volunteer',
        is_approved: false
      }
    });

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found or already processed' });
    }

    // Delete the volunteer record
    await volunteer.destroy();

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


