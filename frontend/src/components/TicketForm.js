import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from './Spinner';
import Notification from './Notification';
import { TextField, Button, Box } from '@mui/material';

export default function TicketForm() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

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
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <Spinner /> : 'Criar Chamado'}
      </Button>
      <Notification {...notif} onClose={() => setNotif(n => ({ ...n, open: false }))} />
    </Box>
  );
}
