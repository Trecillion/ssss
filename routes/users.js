const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'Usuário já existe.' });

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    user = await User.create({ nome, email, senha: senhaHash });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas.' });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas.' });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter informações do usuário
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['senha'] },
      include: [{ association: 'vaultsDesbloqueados' }],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
