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

// sempre inclua o localhost:3000, mesmo que exista FRONTEND_URL
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,    // opcional, se você apontar isto em .env
  'http://localhost:3001'
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(morgan('combined'));

// **CORS**: aplica aos Routes e responde ao preflight OPTIONS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRouter);

// Rotas protegidas
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/priorities', prioritiesRouter);
app.use('/api/tickets', ticketsRouter);

// Handler de erros
app.use(errorHandler);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Backend na porta ${PORT}`));
  })
  .catch(err => console.error('❌ Falha ao sincronizar DB:', err));

// Socket.IO (sem alterações)
io.on('connection', socket => {
  console.log('🟢 Cliente conectado', socket.id);
  socket.on('disconnect', () => console.log('🔴 Cliente desconectado', socket.id));
});
