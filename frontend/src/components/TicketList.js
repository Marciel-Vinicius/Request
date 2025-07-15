// src/components/TicketList.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await api.get('/tickets');
        setTickets(res.data);
      } catch (err) {
        console.error('Erro ao carregar tickets:', err);
      }
    }
    fetchTickets();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tickets
      </Typography>

      <Button
        component={RouterLink}
        to="/tickets/new"
        variant="contained"
        sx={{ mb: 2 }}
      >
        New Ticket
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(t => (
              <TableRow
                key={t.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/tickets/${t.id}`)}
              >
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{t.assignee?.name || '—'}</TableCell>
                <TableCell>{t.Category?.name || '—'}</TableCell>
                <TableCell>{t.Priority?.level || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
