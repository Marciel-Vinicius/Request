import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Service Request
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Dashboard</Button>
                    <Button color="inherit" component={Link} to="/tickets">Tickets</Button>
                    <Button color="inherit" component={Link} to="/users">Users</Button>
                    <Button color="inherit" component={Link} to="/categories">Categories</Button>
                    <Button color="inherit" component={Link} to="/priorities">Priorities</Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 2 }}>
                {children}
            </Box>
        </>
    );
}
