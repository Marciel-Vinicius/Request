import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function TicketForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
    api.get('/priorities').then(res => setPriorities(res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/tickets', { title, description, categoryId, priorityId });
      navigate('/tickets');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>New Ticket</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Title" fullWidth margin="normal" value={title} onChange={e => setTitle(e.target.value)} />
        <TextField label="Description" multiline rows={4} fullWidth margin="normal" value={description} onChange={e => setDescription(e.target.value)} />
        <TextField select label="Category" fullWidth margin="normal" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
        </TextField>
        <TextField select label="Priority" fullWidth margin="normal" value={priorityId} onChange={e => setPriorityId(e.target.value)}>
          {priorities.map(p => <MenuItem key={p.id} value={p.id}>{p.level}</MenuItem>)}
        </TextField>
        <Button type="submit" variant="contained" fullWidth>Submit</Button>
      </form>
    </Container>
); }