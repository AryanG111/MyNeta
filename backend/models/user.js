'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
      User.hasMany(models.Badge, { foreignKey: 'user_id', as: 'badges' });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password_hash: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'volunteer', 'voter'),
    mobile: DataTypes.STRING,
    area: DataTypes.STRING,
    avatar_path: DataTypes.STRING,
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    approved_by: DataTypes.INTEGER,
    approved_at: DataTypes.DATE,
    last_login: DataTypes.DATE,
    // Gamification fields
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    tasks_completed: { type: DataTypes.INTEGER, defaultValue: 0 },
    complaints_resolved: { type: DataTypes.INTEGER, defaultValue: 0 },
    collaborations: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};