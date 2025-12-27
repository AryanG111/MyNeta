'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
      Complaint.belongsTo(models.Voter, {
        foreignKey: 'voter_id',
        as: 'voter'
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
    }
  }, {
    sequelize,
    modelName: 'Complaint',
  });
  return Complaint;
};


