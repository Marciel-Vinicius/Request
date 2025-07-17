import React, { useState } from 'react';
import api from '../services/api';
import Spinner from './Spinner';
import Notification from './Notification';
import { TextField, Button, Box } from '@mui/material';

export default function TicketForm({ onSuccess }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tickets', form);
      setNotif({ open: true, message: 'Ticket criado', severity: 'success' });
      onSuccess();
    } catch (err) {
      setNotif({ open: true, message: 'Erro ao criar ticket', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField
        label="Título"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
      />
      <TextField
        label="Descrição"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        multiline
        rows={4}
        required
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <Spinner /> : 'Criar Ticket'}
      </Button>
      <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
    </Box>
  );
}