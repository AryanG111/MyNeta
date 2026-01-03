const express = require('express');
const router = express.Router();
const { Task, User } = require('../../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { notifyVolunteerTaskAssigned } = require('../emailService');
const { awardPoints } = require('../gamification');

// Get all tasks (admin sees all, volunteer sees their own)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const where = req.user.role === 'admin' ? {} : { assigned_to: req.user.id };

        const tasks = await Task.findAll({
            where,
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'assigner', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});

// Create a new task (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { title, description, assigned_to, priority, due_date } = req.body;

        if (!title || !assigned_to) {
            return res.status(400).json({ message: 'Title and assignee are required' });
        }

        // Verify the assigned user is a volunteer
        const volunteer = await User.findOne({
            where: { id: assigned_to, role: 'volunteer', is_approved: true }
        });

        if (!volunteer) {
            return res.status(400).json({ message: 'Invalid volunteer' });
        }

        const task = await Task.create({
            title,
            description,
            assigned_to,
            assigned_by: req.user.id,
            priority: priority || 'medium',
            due_date: due_date || null
        });

        const taskWithDetails = await Task.findByPk(task.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'assigner', attributes: ['id', 'name'] }
            ]
        });

        // Send email notification to volunteer
        notifyVolunteerTaskAssigned(task, volunteer.email);

        res.status(201).json(taskWithDetails);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Failed to create task' });
    }
});

// Update task status
router.patch('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Volunteers can only update their own tasks
        if (req.user.role !== 'admin' && task.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const wasCompleted = task.status === 'completed';
        await task.update({ status });

        // Award points if task just completed
        if (status === 'completed' && !wasCompleted) {
            const reward = await awardPoints(task.assigned_to, 'TASK_COMPLETED');
            console.log('🎮 Points awarded:', reward);
        }

        const updatedTask = await Task.findByPk(id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'assigner', attributes: ['id', 'name'] }
            ]
        });

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Failed to update task' });
    }
});

// Delete task (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task' });
    }
});

// Request collaboration on a task
router.post('/:id/request-collab', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only assigned volunteer can request collaboration
        if (task.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await task.update({ collaboration_requested: true });

        const updatedTask = await Task.findByPk(id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'assigner', attributes: ['id', 'name'] }
            ]
        });

        res.json(updatedTask);
    } catch (error) {
        console.error('Error requesting collaboration:', error);
        res.status(500).json({ message: 'Failed to request collaboration' });
    }
});

module.exports = router;
