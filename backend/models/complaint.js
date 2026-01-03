'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
      Complaint.belongsTo(models.Voter, {
        foreignKey: 'voter_id',
        as: 'voter'
      });
      Complaint.belongsTo(models.User, {
        foreignKey: 'assigned_volunteer',
        as: 'volunteer'
      });
    }
  }

  Complaint.init({
    voter_id: DataTypes.INTEGER,
    issue: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved'),
      defaultValue: 'pending'
    },
    resolution: DataTypes.TEXT,
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    // Phase 2: Resolution workflow fields
    assigned_volunteer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    resolution_photo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Complaint',
  });

  return Complaint;
};
