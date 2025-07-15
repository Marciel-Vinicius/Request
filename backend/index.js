require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const prioritiesRouter = require('./routes/priorities');
const ticketsRouter = require('./routes/tickets');
const { authenticate } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use(authenticate);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/priorities', prioritiesRouter);
app.use('/api/tickets', ticketsRouter);

const PORT = process.env.PORT || 5000;
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});