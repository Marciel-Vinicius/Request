import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import api from '../services/api';
import { useParams } from 'react-router-dom';

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    api.get(`/tickets/${id}`).then(res => setTicket(res.data));
  }, [id]);

  const handleUpdate = async () => {
    const { title, description, status, categoryId, priorityId, assigneeId } = ticket;
    try {
      await api.put(`/tickets/${id}`, { title, description, status, categoryId, priorityId, assigneeId });
      alert('Updated');
    } catch (err) {
      alert('Error');
    }
  };

  const handleComment = async () => {
    try {
      await api.post(`/tickets}/${id}/comments`, { content: comment });
      const updated = await api.get(`/tickets/${id}`);
      setTicket(updated.data);
      setComment('');
    } catch (err) {
      alert('Error');
    }
  };

  if (!ticket) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Ticket Detail</Typography>
      <TextField label="Title" fullWidth margin="normal" value={ticket.title} onChange={e => setTicket({ ...ticket, title: e.target.value })} />
      <TextField label="Description" multiline rows={4} fullWidth margin="normal" value={ticket.description} onChange={e => setTicket({ ...ticket, description: e.target.value })} />
      <TextField select label="Status" fullWidth margin="normal" value={ticket.status} onChange={e => setTicket({ ...ticket, status: e.target.value })}>
        {['Open', 'In Progress', 'Pending', 'Closed'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
      </TextField>
      <Button variant="contained" onClick={handleUpdate} style={{ marginTop: 16 }}>Update</Button>
      <Typography variant="h6" gutterBottom style={{ marginTop: 24 }}>Comments</Typography>
      <List>
        {ticket.Comments.map(c => (
          <ListItem key={c.id}><ListItemText primary={c.content} secondary={c.User.name} /></ListItem>
        ))}
      </List>
      <TextField label="New Comment" fullWidth margin="normal" value={comment} onChange={e => setComment(e.target.value)} />
      <Button variant="contained" onClick={handleComment}>Add Comment</Button>
    </Container>
); }