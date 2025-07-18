import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from './Spinner';
import Notification from './Notification';
import { TextField, Button, Box, MenuItem } from '@mui/material';

export default function TicketForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    priorityId: ''
  });
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
    api.get('/priorities')
      .then(res => setPriorities(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tickets', form);
      setNotif({ open: true, message: 'Chamado criado com sucesso!', severity: 'success' });
      navigate('/');
    } catch {
      setNotif({ open: true, message: 'Erro ao criar chamado', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 4, display: 'grid', gap: 2 }}
    >
      <TextField
        label="Título"
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        required
      />
      <TextField
        label="Descrição"
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        multiline
        rows={4}
        required
      />
      <TextField
        select
        label="Categoria"
        value={form.categoryId}
        onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
        required
      >
        {categories.map(c => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Prioridade"
        value={form.priorityId}
        onChange={e => setForm(f => ({ ...f, priorityId: e.target.value }))}
        required
      >
        {priorities.map(p => (
          <MenuItem key={p.id} value={p.id}>
            {p.level}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <Spinner /> : 'Criar Chamado'}
      </Button>
      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={() => setNotif(n => ({ ...n, open: false }))}
      />
    </Box>
  );
}
