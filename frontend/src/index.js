import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Root() {
    const [mode, setMode] = React.useState(
        localStorage.getItem('theme') || 'light'
    );
    const colorMode = React.useMemo(() => ({
        toggleColorMode: () => {
            setMode(prev => {
                const next = prev === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', next);
                return next;
            });
        }
    }), []);
    const theme = React.useMemo(() => createTheme({
        palette: { mode }
    }), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <App colorMode={colorMode} />
        </ThemeProvider>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
