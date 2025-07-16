import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Solicitante');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao registrar');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Registrar</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Nome" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Senha" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <TextField select label="Perfil" fullWidth margin="normal" value={role} onChange={e => setRole(e.target.value)}>
          <MenuItem value="Solicitante">Solicitante</MenuItem>
          <MenuItem value="TI">TI</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" fullWidth>Registrar</Button>
      </form>
    </Container>
  );
}
