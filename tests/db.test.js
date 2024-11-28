const { Sequelize } = require('sequelize');
require('dotenv').config();

describe('Testando a conexão com o PostgreSQL', () => {
  let sequelize;
  beforeAll(async () => {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
    });
    try {
      await sequelize.authenticate();
      console.log('Conexão estabelecida com sucesso.');
    } catch (error) {
      console.error('Não foi possível conectar ao banco de dados:', error);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Conexão bem-sucedida com o PostgreSQL', async () => {
    expect(sequelize).toBeDefined();
    await expect(sequelize.authenticate()).resolves.toBeUndefined();
  });
});
