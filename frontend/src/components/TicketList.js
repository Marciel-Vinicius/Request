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
  Paper,
  TextField,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const navigate = useNavigate();
  const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

  // Papel do usuário salvo no login
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    async function fetchAll() {
      try {
        const [tkRes, catRes, priRes] = await Promise.all([
          api.get('/tickets'),
          api.get('/categories'),
          api.get('/priorities')
        ]);
        setTickets(tkRes.data);
        setCategorias(catRes.data);
        setPrioridades(priRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    }
    fetchAll();

    socket.on('ticketCreated', t =>
      setTickets(prev => [t, ...prev])
    );
    socket.on('ticketUpdated', t =>
      setTickets(prev => prev.map(x => (x.id === t.id ? t : x)))
    );

    return () => socket.disconnect();
  }, []);

  const handleUpdate = async (id, field, value) => {
    try {
      await api.put(`/tickets/${id}`, { [field]: value });
      // o socket notificará a atualização
    } catch (err) {
      console.error(`Erro ao atualizar ${field}:`, err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chamados
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => navigate('/tickets/new')}
      >
        Novo Chamado
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Solicitante</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Prioridade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(t => (
              <TableRow key={t.id} hover>
                <TableCell
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                >
                  {t.title}
                </TableCell>
                <TableCell>{t.requester?.name || '—'}</TableCell>

                {/* Status sempre editável */}
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={t.status}
                    onChange={e =>
                      handleUpdate(t.id, 'status', e.target.value)
                    }
                  >
                    {['Aberto', 'Em Andamento', 'Pendente', 'Fechado'].map(
                      s => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </TableCell>

                <TableCell>{t.assignee?.name || '—'}</TableCell>

                {/* Categoria: só TI pode editar */}
                <TableCell>
                  {userRole === 'TI' ? (
                    <TextField
                      select
                      size="small"
                      value={t.Category?.id ?? ''}
                      onChange={e =>
                        handleUpdate(t.id, 'categoryId', e.target.value)
                      }
                    >
                      <MenuItem value="">—</MenuItem>
                      {categorias.map(c => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    t.Category?.name || '—'
                  )}
                </TableCell>

                {/* Prioridade: só TI pode editar */}
                <TableCell>
                  {userRole === 'TI' ? (
                    <TextField
                      select
                      size="small"
                      value={t.Priority?.id ?? ''}
                      onChange={e =>
                        handleUpdate(t.id, 'priorityId', e.target.value)
                      }
                    >
                      <MenuItem value="">—</MenuItem>
                      {prioridades.map(p => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.level}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    t.Priority?.level || '—'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
