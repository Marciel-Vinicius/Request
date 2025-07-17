// backend/index.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./models');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const prioritiesRouter = require('./routes/priorities');
const ticketsRouter = require('./routes/tickets');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Defina aqui as origens permitidas
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001'
];

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(morgan('combined'));

// CORS dinâmico
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRouter);

// Rotas protegidas
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/priorities', prioritiesRouter);
app.use('/api/tickets', ticketsRouter);

// Middleware de erro
app.use(errorHandler);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
  })
  .catch(err => console.error('❌ Falha ao sincronizar banco:', err));

// Socket.IO (sem alteração)
io.on('connection', socket => {
  console.log('🟢 Novo cliente conectado', socket.id);
  socket.on('disconnect', () => console.log('🔴 Cliente desconectado', socket.id));
});
