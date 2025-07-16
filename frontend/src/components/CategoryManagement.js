// src/components/CategoryManagement.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box
} from '@mui/material';
import api from '../services/api';

export default function CategoryManagement() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');

  // Carrega categorias sem retornar Promise diretamente
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get('/categories');
        setCategorias(res.data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    }
    fetchCategorias();
  }, []);

  const handleAdd = async () => {
    try {
      await api.post('/categories', { name: nome });
      setNome('');
      // Recarrega lista
      const res = await api.get('/categories');
      setCategorias(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Acesso negado! Apenas TI pode criar categorias.');
      } else {
        alert(err.response?.data?.message || 'Erro ao criar categoria');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Categorias</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Adicionar
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categorias.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
