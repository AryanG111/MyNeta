const { User, Badge } = require('../models');

// Points configuration
const POINTS = {
    TASK_COMPLETED: 10,
    COMPLAINT_RESOLVED: 15,
    COLLABORATION: 5,
    EVENT_ATTENDED: 8
};

// Badge definitions
const BADGES = {
    FIRST_TASK: {
        id: 'first_task',
        name: 'First Task',
        description: 'Completed your first task',
        icon: '🥇',
        condition: (user) => user.tasks_completed >= 1
    },
    TASK_MASTER: {
        id: 'task_master',
        name: 'Task Master',
        description: 'Completed 10 tasks',
        icon: '🎯',
        condition: (user) => user.tasks_completed >= 10
    },
    FIRST_RESOLVE: {
        id: 'first_resolve',
        name: 'Problem Solver',
        description: 'Resolved your first complaint',
        icon: '✅',
        condition: (user) => user.complaints_resolved >= 1
    },
    STAR_RESOLVER: {
        id: 'star_resolver',
        name: 'Star Resolver',
        description: 'Resolved 10 complaints',
        icon: '⭐',
        condition: (user) => user.complaints_resolved >= 10
    },
    TEAM_PLAYER: {
        id: 'team_player',
        name: 'Team Player',
        description: 'Helped teammates 3 times',
        icon: '🤝',
        condition: (user) => user.collaborations >= 3
    },
    ON_FIRE: {
        id: 'on_fire',
        name: 'On Fire',
        description: 'Earned 100+ points',
        icon: '🔥',
        condition: (user) => user.points >= 100
    },
    LEGEND: {
        id: 'legend',
        name: 'Legend',
        description: 'Earned 500+ points',
        icon: '👑',
        condition: (user) => user.points >= 500
    }
};

// Level thresholds
const LEVELS = [
    { level: 1, minPoints: 0, title: 'Rookie' },
    { level: 2, minPoints: 50, title: 'Contributor' },
    { level: 3, minPoints: 150, title: 'Active' },
    { level: 4, minPoints: 300, title: 'Dedicated' },
    { level: 5, minPoints: 500, title: 'Expert' },
    { level: 6, minPoints: 800, title: 'Champion' },
    { level: 7, minPoints: 1200, title: 'Legend' }
];

// Calculate level from points
const calculateLevel = (points) => {
    let currentLevel = LEVELS[0];
    for (const level of LEVELS) {
        if (points >= level.minPoints) {
            currentLevel = level;
        } else {
            break;
        }
    }
    return currentLevel;
};

// Award points to user
const awardPoints = async (userId, action) => {
    const pointsToAdd = POINTS[action];
    if (!pointsToAdd) return null;

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'volunteer') return null;

    // Update stats based on action
    const updates = { points: user.points + pointsToAdd };

    if (action === 'TASK_COMPLETED') {
        updates.tasks_completed = user.tasks_completed + 1;
    } else if (action === 'COMPLAINT_RESOLVED') {
        updates.complaints_resolved = user.complaints_resolved + 1;
    } else if (action === 'COLLABORATION') {
        updates.collaborations = user.collaborations + 1;
    }

    // Calculate new level
    const newLevel = calculateLevel(updates.points);
    updates.level = newLevel.level;

    await user.update(updates);

    // Check for new badges
    const newBadges = await checkAndAwardBadges(userId);

    return {
        pointsEarned: pointsToAdd,
        totalPoints: updates.points,
        level: newLevel,
        newBadges
    };
};

// Check and award badges
const checkAndAwardBadges = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return [];

    const existingBadges = await Badge.findAll({
        where: { user_id: userId },
        attributes: ['badge_type']
    });
    const existingBadgeTypes = existingBadges.map(b => b.badge_type);

    const newBadges = [];

    for (const [key, badge] of Object.entries(BADGES)) {
        if (!existingBadgeTypes.includes(badge.id) && badge.condition(user)) {
            await Badge.create({
                user_id: userId,
                badge_type: badge.id
            });
            newBadges.push(badge);
        }
    }

    return newBadges;
};

// Get user's gamification stats
const getUserStats = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) return null;

    const badges = await Badge.findAll({
        where: { user_id: userId },
        order: [['earned_at', 'DESC']]
    });

    const level = calculateLevel(user.points);
    const nextLevel = LEVELS.find(l => l.level === level.level + 1);
    const pointsToNextLevel = nextLevel ? nextLevel.minPoints - user.points : 0;

    return {
        points: user.points,
        level: level.level,
        levelTitle: level.title,
        pointsToNextLevel,
        nextLevelTitle: nextLevel?.title || 'Max Level',
        tasksCompleted: user.tasks_completed,
        complaintsResolved: user.complaints_resolved,
        collaborations: user.collaborations,
        badges: badges.map(b => ({
            ...BADGES[Object.keys(BADGES).find(k => BADGES[k].id === b.badge_type)],
            earnedAt: b.earned_at
        }))
    };
};

// Get leaderboard
const getLeaderboard = async (limit = 10) => {
    const users = await User.findAll({
        where: { role: 'volunteer', is_approved: true },
        order: [['points', 'DESC']],
        limit,
        attributes: ['id', 'name', 'points', 'level', 'tasks_completed', 'complaints_resolved', 'avatar_path']
    });

    return users.map((user, index) => ({
        rank: index + 1,
        id: user.id,
        name: user.name,
        points: user.points,
        level: user.level,
        levelTitle: calculateLevel(user.points).title,
        tasksCompleted: user.tasks_completed,
        complaintsResolved: user.complaints_resolved,
        avatar: user.avatar_path
    }));
};

module.exports = {
    POINTS,
    BADGES,
    LEVELS,
    awardPoints,
    checkAndAwardBadges,
    getUserStats,
    getLeaderboard,
    calculateLevel
};
