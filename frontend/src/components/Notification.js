import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function Notification({ open, onClose, message, severity }) {
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}