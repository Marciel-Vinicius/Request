const express = require('express');
const router = express.Router();
const { Priority } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res) => {
  const ps = await Priority.findAll();
  res.json(ps);
});

router.post('/', async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const { level } = req.body;
  try {
    const pr = await Priority.create({ level });
    res.json(pr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.params;
  const { level } = req.body;
  try {
    await Priority.update({ level }, { where: { id } });
    res.json({ id, level });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const { id } = req.params;
  try {
    await Priority.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;