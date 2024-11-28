const User = require('./User');
const Task = require('./Task');
const Vault = require('./Vault');

// Relações
User.hasMany(Task, { as: 'tasks', foreignKey: 'usuarioId' });
Task.belongsTo(User, { as: 'usuario', foreignKey: 'usuarioId' });

User.belongsToMany(Vault, { through: 'UserVaults', as: 'vaultsDesbloqueados' });
Vault.belongsToMany(User, { through: 'UserVaults', as: 'desbloqueadoPor' });

module.exports = {
  User,
  Task,
  Vault,
};
