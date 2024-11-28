const express = require('express');
const router = express.Router();
const { Task, User } = require('../models');
const auth = require('../middleware/auth');

// Criar nova tarefa
router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, usuarioId: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter todas as tarefas do usuário
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { usuarioId: req.user.id } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar tarefa (marcar como concluída)
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

    if (task.status === 'concluida') {
      return res.status(400).json({ message: 'Tarefa já concluída.' });
    }

    // Verifica se a tarefa pertence ao usuário
    if (task.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Atualiza o status da tarefa
    task.status = 'concluida';
    await task.save();

    // Atualizar pontuação do usuário
    const user = await User.findByPk(req.user.id);
    user.pontuacao += task.pontos;
    await user.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
