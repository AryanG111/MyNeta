const express = require('express');
const { Complaint, Voter } = require('../../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Valid complaint statuses
const VALID_STATUSES = ['pending', 'in_progress', 'resolved', 'flagged'];

// Get all complaints with optional filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const complaints = await Complaint.findAndCountAll({
      where: whereClause,
      include: [{
        model: Voter,
        as: 'voter',
        attributes: ['name', 'phone']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Transform the data to match frontend expectations
    const transformedComplaints = complaints.rows.map(complaint => ({
      id: complaint.id,
      issue: complaint.issue,
      status: complaint.status,
      created_at: complaint.createdAt,
      voter_name: complaint.voter ? complaint.voter.name : 'Unknown Voter',
      voter_phone: complaint.voter ? complaint.voter.phone : null
    }));

    res.json(transformedComplaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new complaint
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { voter_id, issue, status = 'pending' } = req.body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const complaint = await Complaint.create({
      voter_id,
      issue,
      status
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update complaint status
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.update({ status });
    res.json(complaint);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete complaint
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.destroy();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


