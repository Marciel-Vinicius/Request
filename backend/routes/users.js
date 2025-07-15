const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
  res.json(users);
});

module.exports = router;