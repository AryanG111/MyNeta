const express = require('express');
const { Event } = require('../../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get all events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['event_date', 'ASC']]
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new event
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, description, event_date, location } = req.body;
    
    const event = await Event.create({
      title,
      description,
      event_date,
      location
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update event
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, location } = req.body;
    
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.update({
      title,
      description,
      event_date,
      location
    });

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete event
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


