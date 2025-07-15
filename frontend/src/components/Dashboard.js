import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, byStatus: {} });

  useEffect(() => {
    api.get('/tickets').then(({ data: tickets }) => {
      const total = tickets.length;
      const byStatus = tickets.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {});
      setStats({ total, byStatus });
    });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Tickets</Typography>
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

      <Button
        component={Link}
        to="/tickets/new"
        variant="contained"
      >
        Open New Ticket
      </Button>
    </Container>
  );
}
