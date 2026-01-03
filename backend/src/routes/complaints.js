const express = require('express');
const multer = require('multer');
const path = require('path');
const { Complaint, Voter, User } = require('../../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { notifyAdminNewComplaint, notifyVoterComplaintResolved } = require('../emailService');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/resolutions'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resolution-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Valid complaint statuses
const VALID_STATUSES = ['pending', 'in_progress', 'resolved'];

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
      include: [
        { model: Voter, as: 'voter', attributes: ['name', 'phone'] },
        { model: User, as: 'volunteer', attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Transform the data
    const transformedComplaints = complaints.rows.map(complaint => ({
      id: complaint.id,
      issue: complaint.issue,
      status: complaint.status,
      priority: complaint.priority,
      created_at: complaint.createdAt,
      voter_name: complaint.voter ? complaint.voter.name : 'Unknown Voter',
      voter_phone: complaint.voter ? complaint.voter.phone : null,
      assigned_volunteer: complaint.volunteer ? complaint.volunteer.name : null,
      assigned_volunteer_id: complaint.assigned_volunteer,
      resolution_photo: complaint.resolution_photo,
      resolution_notes: complaint.resolution_notes,
      resolved_at: complaint.resolved_at,
      approved_by_admin: complaint.approved_by_admin
    }));

    res.json(transformedComplaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get resolved complaints for public display
router.get('/resolved', async (req, res) => {
  try {
    const resolvedComplaints = await Complaint.findAll({
      where: { status: 'resolved', approved_by_admin: true },
      include: [{ model: Voter, as: 'voter', attributes: ['name'] }],
      order: [['resolved_at', 'DESC']],
      limit: 10
    });

    const transformed = resolvedComplaints.map(c => ({
      id: c.id,
      issue: c.issue,
      resolution_notes: c.resolution_notes,
      resolution_photo: c.resolution_photo,
      resolved_at: c.resolved_at,
      voter_name: c.voter?.name || 'Anonymous'
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching resolved complaints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new complaint
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { voter_id, issue, priority = 'medium' } = req.body;

    const complaint = await Complaint.create({
      voter_id,
      issue,
      priority,
      status: 'pending'
    });

    // Get voter name for email
    const voter = await Voter.findByPk(voter_id);
    const voterName = voter?.name || 'Unknown Voter';

    // Send email notification to admin
    notifyAdminNewComplaint(complaint, voterName);

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Assign volunteer to complaint (admin only)
router.patch('/:id/assign', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { volunteer_id } = req.body;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.update({
      assigned_volunteer: volunteer_id,
      status: 'in_progress'
    });

    res.json(complaint);
  } catch (error) {
    console.error('Error assigning volunteer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Volunteer accepts/picks up a complaint
router.patch('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Only volunteers can accept
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Only volunteers can accept complaints' });
    }

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'pending') {
      return res.status(400).json({ message: 'Complaint is already being handled' });
    }

    await complaint.update({
      assigned_volunteer: req.user.id,
      status: 'in_progress'
    });

    res.json({ message: 'Complaint accepted', complaint });
  } catch (error) {
    console.error('Error accepting complaint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit resolution with photo (volunteer)
router.post('/:id/resolve', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Volunteer can only resolve their assigned complaints
    if (req.user.role !== 'admin' && complaint.assigned_volunteer !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to resolve this complaint' });
    }

    const photoPath = req.file ? `/uploads/resolutions/${req.file.filename}` : null;

    await complaint.update({
      resolution_notes: notes,
      resolution_photo: photoPath,
      status: 'resolved',
      resolved_at: new Date(),
      approved_by_admin: req.user.role === 'admin' // Auto-approve if admin resolves
    });

    res.json(complaint);
  } catch (error) {
    console.error('Error resolving complaint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Approve resolution (admin only)
router.patch('/:id/approve', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.update({ approved_by_admin: true });
    res.json(complaint);
  } catch (error) {
    console.error('Error approving resolution:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update complaint status
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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
