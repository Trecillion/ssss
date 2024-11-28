const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Task = sequelize.define('Task', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.STRING },
  pontos: { type: DataTypes.INTEGER, defaultValue: 10 },
  status: { type: DataTypes.ENUM('pendente', 'concluida'), defaultValue: 'pendente' },
  requisitos: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] },
});

module.exports = Task;
