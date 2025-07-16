import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody, Box
} from '@mui/material';
import api from '../services/api';

export default function PriorityManagement() {
  const [prs, setPrs] = useState([]);
  const [level, setLevel] = useState('');

  useEffect(() => {
    async function fetch() {
      const res = await api.get('/priorities');
      setPrs(res.data);
    }
    fetch();
  }, []);

  const handleAdd = async () => {
    try {
      await api.post('/priorities', { level });
      setLevel('');
      const res = await api.get('/priorities');
      setPrs(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Acesso negado! Apenas TI pode criar prioridades.');
      } else {
        alert('Erro ao criar prioridade');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Prioridades</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Nível"
          value={level}
          onChange={e => setLevel(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>Adicionar</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nível</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prs.map(p => (
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
