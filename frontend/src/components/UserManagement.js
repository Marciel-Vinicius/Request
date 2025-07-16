import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TextField, Button,
    Table, TableHead, TableRow, TableCell, TableBody,
    MenuItem, Box
} from '@mui/material';
import api from '../services/api';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'Solicitante'
    });

    // Agora o useEffect chama fetchUsers, não retorna Promise
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch {
                setUsers([]);
            }
        }
        fetchUsers();
    }, []);

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleAdd = async () => {
        try {
            await api.post('/auth/register', form);
            setForm({ name: '', email: '', password: '', role: 'Solicitante' });
            // Recarrega lista depois de criar
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao criar usuário');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Usuários</Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                    label="Nome" name="name"
                    value={form.name} onChange={handleChange}
                />
                <TextField
                    label="Email" name="email"
                    value={form.email} onChange={handleChange}
                />
                <TextField
                    label="Senha" type="password" name="password"
                    value={form.password} onChange={handleChange}
                />
                <TextField
                    select label="Perfil" name="role"
                    value={form.role} onChange={handleChange}
                >
                    <MenuItem value="Solicitante">Solicitante</MenuItem>
                    <MenuItem value="TI">TI</MenuItem>
                </TextField>
                <Button variant="contained" onClick={handleAdd}>Adicionar</Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Perfil</TableCell>
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
