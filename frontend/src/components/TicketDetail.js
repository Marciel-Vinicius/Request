// src/components/TicketDetail.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button,
  MenuItem, List, ListItem, ListItemText, Box
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

  useEffect(() => {
    async function init() {
      try {
        // busca ticket, categorias e prioridades em paralelo
        const [tRes, cRes, pRes] = await Promise.all([
          api.get(`/tickets/${id}`),
          api.get('/categories'),
          api.get('/priorities')
        ]);
        setTicket(tRes.data);
        setCategorias(cRes.data);
        setPrioridades(pRes.data);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar detalhes do chamado');
      }
    }
    init();

    // real‑time para atualizações de status ou de qualquer campo
    socket.on('ticketUpdated', t => {
      if (t.id === id) setTicket(t);
    });

    return () => socket.disconnect();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/tickets/${id}`, {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        categoryId: ticket.categoryId,
        priorityId: ticket.priorityId
      });
      alert('Chamado atualizado!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erro ao salvar alterações');
    }
  };

  const handleComment = async () => {
    try {
      await api.post(`/tickets/${id}/comments`, { content: comment });
      setComment('');
      // refetch comentários
      const { data } = await api.get(`/tickets/${id}`);
      setTicket(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao adicionar comentário');
    }
  };

  if (!ticket) return <Typography>Carregando...</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Detalhe do Chamado
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Título"
          fullWidth
          value={ticket.title}
          onChange={e => setTicket({ ...ticket, title: e.target.value })}
        />

        <TextField
          label="Descrição"
          fullWidth
          multiline
          rows={4}
          value={ticket.description}
          onChange={e => setTicket({ ...ticket, description: e.target.value })}
        />

        <TextField
          select
          label="Status"
          fullWidth
          value={ticket.status}
          onChange={e => setTicket({ ...ticket, status: e.target.value })}
        >
          {['Aberto', 'Em Andamento', 'Pendente', 'Fechado'].map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Categoria"
          fullWidth
          value={ticket.categoryId || ''}
          onChange={e => setTicket({ ...ticket, categoryId: e.target.value })}
        >
          {categorias.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Prioridade"
          fullWidth
          value={ticket.priorityId || ''}
          onChange={e => setTicket({ ...ticket, priorityId: e.target.value })}
        >
          {prioridades.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.level}</MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={handleUpdate}>
          Salvar Alterações
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Comentários
      </Typography>
      <List>
        {ticket.Comments.map(c => (
          <ListItem key={c.id}>
            <ListItemText primary={c.content} secondary={c.User.name} />
          </ListItem>
        ))}
      </List>

      <TextField
        label="Novo Comentário"
        fullWidth
        multiline
        rows={2}
        value={comment}
        onChange={e => setComment(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleComment} sx={{ mt: 1 }}>
        Adicionar Comentário
      </Button>
    </Container>
  );
}
