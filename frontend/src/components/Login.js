// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Chama o método de login do contexto, que faz o POST /auth/login
      await login(form.email, form.password);
      // Se deu certo, vai para a lista de tickets
      navigate('/');
    } catch (err) {
      // Exibe a mensagem enviada pelo backend (ex: "Credenciais inválidas")
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Erro ao fazer login';
      setError(msg);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" align="center">
          Entrar no Service Request
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />

        <TextField
          label="Senha"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />

        <Button type="submit" variant="contained" size="large">
          Entrar
        </Button>

        <Typography variant="body2" align="center">
          Ainda não tem conta?{' '}
          <Link component={RouterLink} to="/register">
            Cadastre‑se
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
