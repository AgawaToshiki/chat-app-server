'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thread extends Model {
    static associate(models) {
      Thread.hasMany(models.Chat, { foreignKey: 'threadId' })
    }
  }
  Thread.init({
    id: {
      type:DataTypes.STRING,
      primaryKey: true
    },
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Thread',
  });
  return Thread;
};