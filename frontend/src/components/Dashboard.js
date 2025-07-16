import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, byStatus: {} });

  useEffect(() => {
    async function fetch() {
      try {
        const { data: tickets } = await api.get('/tickets');
        const total = tickets.length;
        const byStatus = tickets.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {});
        setStats({ total, byStatus });
      } catch (err) {
        console.error(err);
      }
    }
    fetch();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Painel</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total de Chamados</Typography>
            <Typography variant="h3">{stats.total}</Typography>
          </Paper>
        </Grid>
        {Object.entries(stats.byStatus).map(([status, count]) => (
          <Grid item xs={12} sm={6} md={4} key={status}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{status}</Typography>
              <Typography variant="h3">{count}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button component={RouterLink} to="/tickets/new" variant="contained">
        Novo Chamado
      </Button>
    </Container>
  );
}
