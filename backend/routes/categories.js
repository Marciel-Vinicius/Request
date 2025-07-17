const express = require('express');
const { body, param } = require('express-validator');
const { Category } = require('../models');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, categories });
  } catch (err) { next(err); }
});

router.post('/', [
  body('name').isString().notEmpty()
], validate, async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) { next(err); }
});

router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().isString().notEmpty()
], validate, async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    await category.update(req.body);
    res.json({ success: true, category });
  } catch (err) { next(err); }
});

router.delete('/:id', [
  param('id').isUUID()
], validate, async (req, res, next) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;