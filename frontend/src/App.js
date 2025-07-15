import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import TicketForm from './components/TicketForm';
import CategoryManagement from './components/CategoryManagement';
import PriorityManagement from './components/PriorityManagement';
import UserManagement from './components/UserManagement';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = tok => {
    localStorage.setItem('token', tok);
    setToken(tok);
  };

  const Private = ({ children }) =>
    token ? children : <Navigate to="/login" replace />;

  return (
    <Router>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* privadas dentro do Layout */}
        <Route path="/" element={
          <Private>
            <Layout><Dashboard /></Layout>
          </Private>
        } />
        <Route path="/tickets" element={
          <Private>
            <Layout><TicketList /></Layout>
          </Private>
        } />
        <Route path="/tickets/new" element={
          <Private>
            <Layout><TicketForm /></Layout>
          </Private>
        } />
        <Route path="/tickets/:id" element={
          <Private>
            <Layout><TicketDetail /></Layout>
          </Private>
        } />
        <Route path="/users" element={
          <Private>
            <Layout><UserManagement /></Layout>
          </Private>
        } />
        <Route path="/categories" element={
          <Private>
            <Layout><CategoryManagement /></Layout>
          </Private>
        } />
        <Route path="/priorities" element={
          <Private>
            <Layout><PriorityManagement /></Layout>
          </Private>
        } />
      </Routes>
    </Router>
  );
}

export default App;
