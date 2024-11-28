const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  pontuacao: { type: DataTypes.INTEGER, defaultValue: 0 },
  badges: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
});

module.exports = User;
