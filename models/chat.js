'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.Thread, { foreignKey: 'threadId', targetKey: 'id' })
    }
  }
  Chat.init({
    id: {
      type:DataTypes.STRING,
      primaryKey: true
    },
    message: DataTypes.STRING,
    username: DataTypes.STRING,
    threadId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};