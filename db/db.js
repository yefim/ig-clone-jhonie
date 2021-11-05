const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'dev.db',
  logQueryParameters: true,
  benchmark: true,
});

sequelize.define('post', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  photoUrl: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  caption: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
});

module.exports = sequelize;
