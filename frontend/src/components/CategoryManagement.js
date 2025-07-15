// src/components/CategoryManagement.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody, Box
} from '@mui/material';
import api from '../services/api';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  // Carrega categorias
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    try {
      await api.post('/categories', { name });
      setName('');
      // Recarrega lista
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Você precisa estar logado como Admin para criar categorias.');
      } else {
        alert(err.response?.data?.message || 'Erro ao criar categoria');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Categories</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add Category
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map(c => (
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
