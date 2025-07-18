import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box } from '@mui/material';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(name, email, password);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao registrar';
      alert(msg);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 360, mx: 'auto', mt: 8, display: 'grid', gap: 2 }}
    >
      <TextField
        label="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <TextField
        label="E‑mail"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained">
        Registrar
      </Button>
    </Box>
  );
}
