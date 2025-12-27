'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User has many audit logs
      User.hasMany(models.AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
      // Note: approved_by is stored as integer FK, not as association to avoid circular issues
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
    last_login: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};