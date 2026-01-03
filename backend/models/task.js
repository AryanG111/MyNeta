const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        assigned_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
            defaultValue: 'pending'
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium'
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        collaboration_requested: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'Tasks',
        timestamps: true
    });

    Task.associate = (models) => {
        Task.belongsTo(models.User, { as: 'assignee', foreignKey: 'assigned_to' });
        Task.belongsTo(models.User, { as: 'assigner', foreignKey: 'assigned_by' });
    };

    return Task;
};
