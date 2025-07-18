import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('solicitante');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(name, email, password, role);
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
      <Typography variant="h5" align="center">
        Registrar‑se
      </Typography>

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

      <FormControl fullWidth>
        <InputLabel id="role-label">Tipo de usuário</InputLabel>
        <Select
          labelId="role-label"
          value={role}
          label="Tipo de usuário"
          onChange={e => setRole(e.target.value)}
          required
        >
          <MenuItem value="solicitante">Solicitante</MenuItem>
          <MenuItem value="ti">TI</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" size="large">
        Registrar
      </Button>

      <Typography variant="body2" align="center">
        Já tem conta?{' '}
        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
          Entrar
        </Link>
      </Typography>
    </Box>
  );
}
