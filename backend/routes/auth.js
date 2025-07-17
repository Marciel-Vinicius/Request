// backend/routes/auth.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Garante que a variável esteja definida
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET não foi definida em .env');
  process.exit(1);
}

// Registro
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Credenciais inválidas' });

    // Cria o token
    const payload = { id: user.id, name: user.name, sector: user.sector };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    res.json({ success: true, user: payload, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
