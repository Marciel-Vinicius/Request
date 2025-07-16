require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./models');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const prioritiesRouter = require('./routes/priorities');
const ticketsRouter = require('./routes/tickets');
const { authenticate } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Torna o io acessível nas rotas
app.set('io', io);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use(authenticate);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/priorities', prioritiesRouter);
app.use('/api/tickets', ticketsRouter);

db.sequelize.sync({ alter: true }).then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
});

// Log conexões Socket.IO
io.on('connection', socket => {
  console.log('Novo cliente conectado', socket.id);
  socket.on('disconnect', () => console.log('Cliente desconectado', socket.id));
});
