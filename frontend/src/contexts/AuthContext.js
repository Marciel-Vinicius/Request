import React, { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            return response.data;
        } catch (err) {
            console.error('Login error response:', err.response);
            throw err;
        }
    }

    async function register(name, email, password, role) {
        try {
            // envia também o campo 'role' com valor 'solicitante' ou 'ti'
            const response = await api.post('/auth/register', {
                name,
                email,
                password,
                role
            });
            return response.data;
        } catch (err) {
            console.error('Register error response:', err.response);
            throw err;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register }}>
            {children}
        </AuthContext.Provider>
    );
}
