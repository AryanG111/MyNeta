'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    event_date: DataTypes.DATE,
    location: DataTypes.STRING,
    event_type: {
      type: DataTypes.ENUM('meeting', 'campaign', 'rally', 'other'),
      defaultValue: 'meeting'
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    attendees_count: DataTypes.INTEGER,
    budget: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};


