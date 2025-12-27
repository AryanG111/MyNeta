const express = require('express');
const { Voter, sequelize } = require('../../models');
const { Op } = require('sequelize');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get all voters with optional filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, booth, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (booth) {
      whereClause.booth = booth;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const voters = await Voter.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: voters.rows,
      total: voters.count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching voters:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get voter counts by category
router.get('/counts', authenticateToken, async (req, res) => {
  try {
    const counts = await Voter.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    res.json(counts);
  } catch (error) {
    console.error('Error fetching voter counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new voter
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, address, booth, phone, category } = req.body;
    
    const voter = await Voter.create({
      name,
      address,
      booth,
      phone,
      category
    });

    res.status(201).json(voter);
  } catch (error) {
    console.error('Error creating voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update voter
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, booth, phone, category } = req.body;
    
    const voter = await Voter.findByPk(id);
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    await voter.update({
      name,
      address,
      booth,
      phone,
      category
    });

    res.json(voter);
  } catch (error) {
    console.error('Error updating voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete voter
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const voter = await Voter.findByPk(id);
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    await voter.destroy();
    res.json({ message: 'Voter deleted successfully' });
  } catch (error) {
    console.error('Error deleting voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
