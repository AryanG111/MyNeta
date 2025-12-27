'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VotersImport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // no associations for now
    }
  }
  VotersImport.init({
    file_path: DataTypes.STRING,
    version: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VotersImport',
  });
  return VotersImport;
};