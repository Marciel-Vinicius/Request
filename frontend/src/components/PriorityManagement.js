// src/components/PriorityManagement.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Box
} from '@mui/material';
import api from '../services/api';

export default function PriorityManagement() {
  const [priorities, setPriorities] = useState([]);
  const [level, setLevel] = useState('');

  // Carrega prioridades (sem retornar Promise diretamente)
  useEffect(() => {
    async function fetchPriorities() {
      try {
        const res = await api.get('/priorities');
        setPriorities(res.data);
      } catch (err) {
        console.error('Erro ao buscar prioridades:', err);
      }
    }
    fetchPriorities();
  }, []);

  const handleAdd = async () => {
    try {
      await api.post('/priorities', { level });
      setLevel('');
      // Recarrega lista após criar
      const res = await api.get('/priorities');
      setPriorities(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Você precisa ser Admin para criar prioridades.');
      } else {
        alert(err.response?.data?.message || 'Erro ao criar prioridade');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Priorities</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Level"
          value={level}
          onChange={e => setLevel(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add Priority
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {priorities.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.level}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
