'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Voter has many complaints
      Voter.hasMany(models.Complaint, { foreignKey: 'voter_id', as: 'complaints' });
      // Voter has many login records
      Voter.hasMany(models.Login, { foreignKey: 'voter_id', as: 'logins' });
      // Voter belongs to a User
      Voter.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Voter.init({
    epic_encrypted: DataTypes.TEXT,
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    address: DataTypes.TEXT,
    booth: DataTypes.STRING,
    city: DataTypes.STRING,
    section: DataTypes.STRING,
    part_no: DataTypes.STRING,
    ward_no: DataTypes.STRING,
    notes: DataTypes.TEXT,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.ENUM('supporter', 'neutral', 'opponent'),
      defaultValue: 'neutral'
    }
  }, {
    sequelize,
    modelName: 'Voter',
  });
  return Voter;
};