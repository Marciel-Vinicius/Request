import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Layout({ children, colorMode }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Sistema de Chamados</Typography>
                    <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <Button color="inherit" component={Link} to="/">Painel</Button>
                    <Button color="inherit" component={Link} to="/tickets">Chamados</Button>
                    <Button color="inherit" component={Link} to="/usuarios">Usuários</Button>
                    <Button color="inherit" component={Link} to="/categorias">Categorias</Button>
                    <Button color="inherit" component={Link} to="/prioridades">Prioridades</Button>
                    <Button color="inherit" onClick={logout}>Sair</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 2 }}>{children}</Box>
        </>
    );
}
