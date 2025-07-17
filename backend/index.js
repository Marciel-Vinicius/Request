require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const prioritiesRouter = require('./routes/priorities');
const ticketsRouter = require('./routes/tickets');
const commentsRouter = require('./routes/comments');

const app = express();

// Segurança HTTP headers
app.use(helmet());
// Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
// Logging
app.use(morgan('combined'));
// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Rotas públicas\app.use('/api/auth', authRouter);

// Rotas protegidas
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/priorities', prioritiesRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/comments', commentsRouter);

// Middleware de erro
app.use(errorHandler);

// Conectar ao DB e iniciar servidor
const PORT = process.env.PORT || 10000;
sequelize.authenticate()
  .then(() => {
    console.log('DB conectado');
    app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
  })
  .catch(err => console.error('Impossível conectar ao DB:', err));