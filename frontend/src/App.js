import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketDetail from './components/TicketDetail';
import CategoryManagement from './components/CategoryManagement';
import PriorityManagement from './components/PriorityManagement';
import UserManagement from './components/UserManagement';

export default function App({ colorMode }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = tok => {
    // salva token
    localStorage.setItem('token', tok);
    setToken(tok);

    // decodifica payload para extrair role
    try {
      const payload = JSON.parse(atob(tok.split('.')[1]));
      localStorage.setItem('userRole', payload.role);
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
    }
  };

  const Private = ({ children }) =>
    token ? children : <Navigate to="/login" replace />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Privadas */}
        <Route
          path="/"
          element={
            <Private>
              <Layout colorMode={colorMode}>
                <Dashboard />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/tickets"
          element={
            <Private>
              <Layout colorMode={colorMode}>
                <TicketList />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <Private>
              <Layout colorMode={colorMode}>
                <TicketForm />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <Private>
              <Layout colorMode={colorMode}>
                <TicketDetail />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/categorias"
          element={
            <Private>
              <Layout colorMode={colorMode}>
                <CategoryManagement />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/prioridades"
          element={
            <Private>
              <Layout colorMode={colorMode}>
                <PriorityManagement />
              </Layout>
            </Private>
          }
        />
        <Route
          path="/usuarios"
          element={
            <Private>
              <Layout colorMode={colorMode}>
                <UserManagement />
              </Layout>
            </Private>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
