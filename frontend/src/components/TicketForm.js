// src/components/TicketForm.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, MenuItem, Box
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function TicketForm() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');      // estado em PT
  const [prioridadeId, setPrioridadeId] = useState('');    // estado em PT
  const navigate = useNavigate();

  // Carrega categorias e prioridades
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, priRes] = await Promise.all([
          api.get('/categories'),
          api.get('/priorities')
        ]);
        setCategorias(catRes.data);
        setPrioridades(priRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados iniciais:', err);
        alert('Falha ao carregar categorias ou prioridades');
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim() || !categoriaId || !prioridadeId) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.post('/tickets', {
        title: titulo,
        description: descricao,
        categoryId: categoriaId,      // <— corrigido
        priorityId: prioridadeId     // <— já estava ok
      });
      navigate('/tickets');
    } catch (err) {
      console.error('Erro ao criar chamado:', err);
      const msg = err.response?.data?.message;
      alert(msg || 'Erro ao criar chamado: ' + err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Novo Chamado</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />
        <TextField
          label="Descrição"
          multiline
          rows={4}
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />
        <TextField
          select
          label="Categoria"
          value={categoriaId}
          onChange={e => setCategoriaId(e.target.value)}
          required
        >
          {categorias.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Prioridade"
          value={prioridadeId}
          onChange={e => setPrioridadeId(e.target.value)}
          required
        >
          {prioridades.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.level}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained">Enviar</Button>
      </Box>
    </Container>
  );
}
