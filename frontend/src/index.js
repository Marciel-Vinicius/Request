import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ColorModeContext } from './context/ColorModeContext';

const container = document.getElementById('root');
const root = createRoot(container);

function Main() {
    const [mode, setMode] = useState('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode(prev => (prev === 'light' ? 'dark' : 'light'));
            }
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: { mode }
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);
