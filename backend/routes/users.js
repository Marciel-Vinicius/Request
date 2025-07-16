const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');

// Aplica autenticação em todas as rotas
router.use(authenticate);

// Listar usuários — só quem for TI pode ver
router.get('/', async (req, res) => {
  if (req.user.role !== 'TI') {
    return res.status(403).json({ message: 'Acesso negado! Apenas equipe de TI pode listar usuários.' });
  }
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role']
  });
  res.json(users);
});

module.exports = router;
