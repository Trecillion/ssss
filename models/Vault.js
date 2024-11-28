const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Vault = sequelize.define('Vault', {
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING },
  custo: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Vault;
