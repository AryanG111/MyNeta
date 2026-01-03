const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getUserStats, getLeaderboard, BADGES } = require('../gamification');

// Get current user's gamification stats
router.get('/my-stats', authenticateToken, async (req, res) => {
    try {
        const stats = await getUserStats(req.user.id);
        if (!stats) {
            return res.status(404).json({ message: 'Stats not found' });
        }
        res.json(stats);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
});

// Get leaderboard
router.get('/leaderboard', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const leaderboard = await getLeaderboard(limit);
        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
});

// Get all available badges
router.get('/badges', authenticateToken, (req, res) => {
    const badges = Object.values(BADGES).map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon
    }));
    res.json(badges);
});

module.exports = router;
