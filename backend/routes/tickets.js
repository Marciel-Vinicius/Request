const express = require('express');
const router = express.Router();
const { Ticket, Category, Priority, Comment, User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res) => {
  const filters = {};
  ['status', 'priorityId', 'categoryId', 'requesterId', 'assigneeId'].forEach(key => {
    if (req.query[key]) filters[key] = req.query[key];
  });
  const tickets = await Ticket.findAll({
    where: filters,
    include: ['requester', 'assignee', Category, Priority]
  });
  res.json(tickets);
});

router.post('/', async (req, res) => {
  const { title, description, categoryId, priorityId, assigneeId } = req.body;
  try {
    const ticket = await Ticket.create({
      title, description, categoryId, priorityId,
      requesterId: req.user.id,
      assigneeId: assigneeId || null
    });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id, {
    include: ['requester', 'assignee', Category, Priority, { model: Comment, include: User }]
  });
  res.json(ticket);
});

router.put('/:id', async (req, res) => {
  if (req.user.role === 'Requester') return res.status(403).json({ message: 'Forbidden' });
  const updates = {};
  ['title','description','status','categoryId','priorityId','assigneeId'].forEach(key => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  try {
    await Ticket.update(updates, { where: { id: req.params.id } });
    const updated = await Ticket.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (req.user.role === 'Requester') return res.status(403).json({ message: 'Forbidden' });
  try {
    await Ticket.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/comments', async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.create({
      content, ticketId: req.params.id, userId: req.user.id
    });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;