require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Rotas
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const prioritiesRouter = require('./routes/priorities');
const ticketsRouter = require('./routes/tickets');
const commentsRouter = require('./routes/comments');

const app = express();

// 1) Segurança nos headers HTTP
app.use(helmet());

// 2) Limite de requisições
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,                  // 100 requisições por IP
  })
);

// 3) Logger de requisições
app.use(morgan('combined'));

// 4) CORS configurado
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// 5) Body parser
app.use(express.json());

// → Rotas públicas
app.use('/api/auth', authRouter);

// → Rotas protegidas
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/priorities', prioritiesRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/comments', commentsRouter);

// Middleware de tratamento de erros (deve vir por último)
app.use(errorHandler);

// Conecta ao banco e inicia o servidor
const PORT = process.env.PORT || 10000;
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Conectado ao banco de dados');
    app.listen(PORT, () => {
      console.log(`🚀 Backend rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Falha ao conectar ao banco:', err);
  });
