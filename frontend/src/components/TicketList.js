import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Spinner from './Spinner';
import Notification from './Notification';
import { Table, TableHead, TableBody, TableRow, TableCell, TablePagination, TextField } from '@mui/material';

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
      const { data } = await api.get('/tickets', { params: { q: filter } });
      setTickets(data.tickets);
    } catch (err) {
      setNotif({ open: true, message: 'Erro ao carregar tickets', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(fetchTickets, [filter]);

  return (
    <>
      <TextField
        label="Buscar"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      />
      {loading ? <Spinner /> : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>…</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={tickets.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </>
      )}
      <Notification {...notif} onClose={() => setNotif({ ...notif, open: false })} />
    </>
  );
}