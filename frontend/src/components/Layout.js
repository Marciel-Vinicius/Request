import React, { useContext } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../context/ColorModeContext';

export default function Layout() {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                    >
                        Service Request
                    </Typography>

                    <IconButton
                        component={RouterLink}
                        to="/tickets/new"
                        color="inherit"
                        sx={{ mr: 1 }}
                    >
                        <AddIcon />
                    </IconButton>

                    <IconButton onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ p: 2 }}>
                <Outlet />
            </Box>
        </>
    );
}
