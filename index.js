require('dotenv').config(); // Carrega as variáveis de ambiente

const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

// Importa os modelos para sincronizar as associações
require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const vaultRoutes = require('./routes/vaults');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/vaults', vaultRoutes);

// Sincroniza os modelos com o banco de dados
sequelize.sync().then(() => {
  console.log('Modelos sincronizados com o banco de dados.');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
