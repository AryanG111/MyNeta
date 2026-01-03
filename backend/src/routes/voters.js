const express = require('express');
const { Voter, User, sequelize } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
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
      include: [{
        model: User,
        as: 'user',
        attributes: ['email', 'is_approved', 'last_login']
      }],
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

// Create new voter (Proper Signup Procedure)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, address, booth, phone, category, email, password } = req.body;
    const adminId = req.user.id;

    let userId = null;

    if (email && password) {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        mobile: phone,
        password_hash: hash,
        role: 'voter',
        is_approved: true, // Admin-created users are auto-approved
        approved_by: adminId,
        approved_at: new Date(),
        area: booth
      }, { transaction });
      userId = user.id;
    }

    const voter = await Voter.create({
      name,
      address,
      booth,
      phone,
      category,
      email: email || null,
      user_id: userId
    }, { transaction });

    await transaction.commit();
    res.status(201).json(voter);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update voter
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, booth, phone, category, email } = req.body;

    const voter = await Voter.findByPk(id, { include: ['user'] });
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    await voter.update({
      name,
      address,
      booth,
      phone,
      category,
      email
    });

    if (voter.user) {
      await voter.user.update({
        name,
        email,
        mobile: phone,
        area: booth
      });
    }

    res.json(voter);
  } catch (error) {
    console.error('Error updating voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete voter
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const voter = await Voter.findByPk(id);
    if (!voter) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Voter not found' });
    }

    const userId = voter.user_id;

    await voter.destroy({ transaction });

    if (userId) {
      await User.destroy({ where: { id: userId }, transaction });
    }

    await transaction.commit();
    res.json({ message: 'Voter and associated user deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting voter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

