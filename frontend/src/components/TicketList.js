import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Spinner from './Spinner';
import Notification from './Notification';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  Box,
  Button,
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este chamado?')) return;
    try {
      await api.delete(`/tickets/${id}`);
      setNotif({ open: true, message: 'Chamado excluído', severity: 'success' });
      fetchTickets();
    } catch {
      setNotif({ open: true, message: 'Erro ao excluir ticket', severity: 'error' });
    }
  };

  const handleToggle = async (ticket) => {
    const newStatus = ticket.status === 'Fechado' ? 'Aberto' : 'Fechado';
    try {
      const res = await api.put(`/tickets/${ticket.id}`, { status: newStatus });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? res.data : t))
      );
      setNotif({
        open: true,
        message: `Chamado ${newStatus === 'Fechado' ? 'fechado' : 'reaberto'} com sucesso!`,
        severity: 'success'
      });
    } catch (err) {
      console.error(err);
      setNotif({ open: true, message: 'Erro ao atualizar status', severity: 'error' });
    }
  };

  const filtered = tickets.filter((t) =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Buscar"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          component={RouterLink}
          to="/tickets/new"
          sx={{ ml: 2 }}
        >
          Novo Chamado
        </Button>
      </Box>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Solicitante</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.requester?.name}</TableCell>
                    <TableCell>{ticket.Priority?.level}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>
                      <IconButton component={RouterLink} to={`/tickets/${ticket.id}`}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleToggle(ticket)}>
                        {ticket.status === 'Fechado' ? (
                          <LockOpenIcon />
                        ) : (
                          <LockIcon />
                        )}
                      </IconButton>
                      <IconButton onClick={() => handleDelete(ticket.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
          />
        </>
      )}

      <Notification
        open={notif.open}
        message={notif.message}
        severity={notif.severity}
        onClose={() => setNotif((n) => ({ ...n, open: false }))}
      />
    </Box>
  );
}
