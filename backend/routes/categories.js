// backend/routes/categories.js
const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// qualquer usuário autenticado (Solicitante ou TI) pode listar, 
// pois precisa escolher categoria ao abrir chamado
router.get('/', async (req, res) => {
  const cats = await Category.findAll();
  res.json(cats);
});

// só quem for TI pode criar
router.post('/', async (req, res) => {
  if (req.user.role !== 'TI') {
    return res.status(403).json({ message: 'Acesso negado! Apenas equipe de TI pode criar categorias.' });
  }
  try {
    const { name } = req.body;
    const cat = await Category.create({ name });
    res.json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// só TI pode atualizar
router.put('/:id', async (req, res) => {
  if (req.user.role !== 'TI') {
    return res.status(403).json({ message: 'Acesso negado! Apenas equipe de TI pode editar categorias.' });
  }
  try {
    const { id } = req.params;
    const { name } = req.body;
    await Category.update({ name }, { where: { id } });
    res.json({ id, name });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// só TI pode excluir
router.delete('/:id', async (req, res) => {
  if (req.user.role !== 'TI') {
    return res.status(403).json({ message: 'Acesso negado! Apenas equipe de TI pode excluir categorias.' });
  }
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    res.json({ message: 'Categoria excluída' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
