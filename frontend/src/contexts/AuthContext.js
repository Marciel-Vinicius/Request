import React, { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function login(email, password) {
        // envia { email, password } como JSON
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data.user);
        return response.data;
    }

    async function register(name, email, password) {
        return api.post('/auth/register', { name, email, password });
    }

    return (
        <AuthContext.Provider value={{ user, login, register }}>
            {children}
        </AuthContext.Provider>
    );
}
