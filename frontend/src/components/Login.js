import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao autenticar';
      alert(msg);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 360,
        mx: 'auto',
        mt: 8,
        p: 3,
        display: 'grid',
        gap: 2,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h5" align="center">Entrar</Typography>

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

      <Button type="submit" variant="contained" size="large">
        Entrar
      </Button>

      <Typography variant="body2" align="center">
        Ainda não tem conta?{' '}
        <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
          Registrar‑se
        </Link>
      </Typography>
    </Box>
  );
}
