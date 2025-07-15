const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res) => {
  const cats = await Category.findAll();
  res.json(cats);
});

router.post('/', async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const { name } = req.body;
  try {
    const cat = await Category.create({ name });
    res.json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.params;
  const { name } = req.body;
  try {
    await Category.update({ name }, { where: { id } });
    res.json({ id, name });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.params;
  try {
    await Category.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;