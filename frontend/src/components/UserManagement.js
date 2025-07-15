import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TextField, Button,
    Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Box
} from '@mui/material';
import api from '../services/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'Requester'
    });

    const fetchUsers = () => {
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(() => setUsers([]));
    };
    useEffect(fetchUsers, []);

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async () => {
        try {
            await api.post('/auth/register', form);
            setForm({ name: '', email: '', password: '', role: 'Requester' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Users</Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                    label="Name" name="name"
                    value={form.name} onChange={handleChange}
                />
                <TextField
                    label="Email" name="email"
                    value={form.email} onChange={handleChange}
                />
                <TextField
                    label="Password" type="password" name="password"
                    value={form.password} onChange={handleChange}
                />
                <TextField
                    select label="Role" name="role"
                    value={form.role} onChange={handleChange}
                >
                    {['Requester', 'Technician', 'Admin'].map(r => (
                        <MenuItem key={r} value={r}>{r}</MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" onClick={handleAdd}>
                    Add User
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(u => (
                        <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.role}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}
