'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Login extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Login.belongsTo(models.Voter, { foreignKey: 'voter_id' });
    }
  }
  Login.init({
    voter_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    phone_encrypted: DataTypes.TEXT,
    epic_encrypted: DataTypes.TEXT,
    ip_hash: DataTypes.STRING,
    source: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Login',
  });
  return Login;
};