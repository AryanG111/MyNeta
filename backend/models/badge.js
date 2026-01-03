'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Badge extends Model {
        static associate(models) {
            Badge.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        }
    }

    Badge.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        badge_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        earned_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Badge',
    });

    return Badge;
};
