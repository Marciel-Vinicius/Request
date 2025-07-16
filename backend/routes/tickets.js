const express = require('express');
const router = express.Router();
const { Ticket, Category, Priority, Comment, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// LISTAR
router.get('/', async (req, res) => {
  const tickets = await Ticket.findAll({
    include: [
      { model: User, as: 'requester', attributes: ['id', 'name'] },
      { model: User, as: 'assignee', attributes: ['id', 'name'] },
      { model: Category },
      { model: Priority }
    ]
  });
  res.json(tickets);
});

// CRIAR
router.post('/', async (req, res) => {
  try {
    const { title, description, categoryId, priorityId, assigneeId } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      CategoryId: categoryId,    // ← aqui
      PriorityId: priorityId,    // ← e aqui
      requesterId: req.user.id,
      assigneeId: assigneeId || null
    });
    const full = await Ticket.findByPk(ticket.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name'] },
        { model: Category },
        { model: Priority }
      ]
    });
    const io = req.app.get('io');
    io.emit('ticketCreated', full);
    res.json(full);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DETALHAR
router.get('/:id', async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id, {
    include: [
      { model: User, as: 'requester', attributes: ['id', 'name'] },
      { model: User, as: 'assignee', attributes: ['id', 'name'] },
      { model: Category },
      { model: Priority },
      { model: Comment, include: { model: User, attributes: ['id', 'name'] } }
    ]
  });
  res.json(ticket);
});

// ATUALIZAR
router.put('/:id', async (req, res) => {
  try {
    // Mapeamento entre body keys e campos do modelo
    const map = {
      title: 'title',
      description: 'description',
      status: 'status',
      categoryId: 'CategoryId',   // ← mapeia pra FK correta
      priorityId: 'PriorityId',   // ← idem
      assigneeId: 'assigneeId'
    };
    const updates = {};
    for (const [bodyKey, modelKey] of Object.entries(map)) {
      if (req.body[bodyKey] !== undefined) {
        updates[modelKey] = req.body[bodyKey];
      }
    }

    await Ticket.update(updates, { where: { id: req.params.id } });
    const updated = await Ticket.findByPk(req.params.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name'] },
        { model: Category },
        { model: Priority }
      ]
    });
    const io = req.app.get('io');
    io.emit('ticketUpdated', updated);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETAR
router.delete('/:id', async (req, res) => {
  if (req.user.role === 'Solicitante') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  await Ticket.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

// COMENTÁRIOS
router.post('/:id/comments', async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.create({
      content,
      ticketId: req.params.id,
      userId: req.user.id
    });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
