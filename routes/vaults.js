const express = require('express');
const router = express.Router();
const { Vault, User } = require('../models');
const auth = require('../middleware/auth');

// Criar novo cofre (admin)
router.post('/', async (req, res) => {
  try {
    const vault = await Vault.create(req.body);
    res.status(201).json(vault);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter todos os cofres
router.get('/', auth, async (req, res) => {
  try {
    const vaults = await Vault.findAll();
    res.json(vaults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Desbloquear um cofre
router.post('/:id/unlock', auth, async (req, res) => {
  try {
    const vault = await Vault.findByPk(req.params.id);
    const user = await User.findByPk(req.user.id);

    if (!vault) {
      return res.status(404).json({ message: 'Cofre não encontrado.' });
    }

    // Verifica se o usuário já desbloqueou o cofre
    const alreadyUnlocked = await user.hasVaultsDesbloqueados(vault);
    if (alreadyUnlocked) {
      return res.status(400).json({ message: 'Cofre já desbloqueado.' });
    }

    if (user.pontuacao < vault.custo) {
      return res.status(400).json({ message: 'Pontuação insuficiente.' });
    }

    user.pontuacao -= vault.custo;
    await user.save();

    await user.addVaultsDesbloqueados(vault);

    res.json({ message: 'Cofre desbloqueado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
