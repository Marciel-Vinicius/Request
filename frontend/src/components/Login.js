// src/components/Login.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      onLogin(data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao entrar');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" align="center">Entrar</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            required
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" fullWidth>
            Entrar
          </Button>
        </Box>

        {/* Botão para página de registro */}
        <Button
          component={Link}
          to="/register"
          variant="outlined"
          fullWidth
        >
          Criar Conta
        </Button>
      </Box>
    </Container>
  );
}
